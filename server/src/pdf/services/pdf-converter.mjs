import { pdf } from 'pdf-to-img';

export async function convertPdfToImages(pdfPath, options = {}) {
  const document = await pdf(pdfPath, options);
  const images = [];

  for await (const image of document) {
    images.push(image);
  }

  return images;
}
