const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require('worker_threads');
const path = require('path');

if (isMainThread) {
  // Main thread - export function to create worker
  async function convertPdfWithWorker(pdfPath, options = {}) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: { pdfPath, options },
      });

      worker.on('message', (result) => {
        if (result.error) {
          reject(new Error(result.error));
        } else {
          resolve(result.images);
        }
      });

      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  module.exports = { convertPdfWithWorker };
} else {
  // Worker thread - do the actual conversion
  async function doConversion() {
    try {
      const { pdfPath, options } = workerData;

      // Dynamic import of ES module
      const { pdf } = await import('pdf-to-img');

      const document = await pdf(pdfPath, options);
      const images = [];

      for await (const image of document) {
        images.push(image);
      }

      parentPort.postMessage({ images });
    } catch (error) {
      parentPort.postMessage({ error: error.message });
    }
  }

  doConversion();
}
