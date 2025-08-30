import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as path from 'path';
import { FileService } from '../../common/services/file.service';
import {
  ConvertedImage,
  ConversionResult,
  ConversionSummary,
} from '../interfaces/pdf-conversion.interface';

@Injectable()
export class PdfConversionService {
  private readonly logger = new Logger(PdfConversionService.name);

  constructor(private readonly fileService: FileService) {}

  async convertPdfToImages(
    file: Express.Multer.File,
    outputDir: string,
  ): Promise<ConvertedImage[]> {
    try {
      this.logger.log(`Starting PDF conversion for: ${file.originalname}`);

      // Use worker thread to handle ES module
      const { convertPdfWithWorker } = require('./pdf-worker.js');

      let counter = 1;
      const images: ConvertedImage[] = [];

      // Configure conversion with high quality
      const imageBuffers = await convertPdfWithWorker(file.path, {
        scale: 3, // 3x scale for high quality (~300 DPI)
      });

      // Save each page
      for (const image of imageBuffers) {
        const filename = `page.${counter}.png`;
        const imagePath = path.join(outputDir, filename);

        // Save image
        await this.fileService.writeFile(imagePath, image);

        images.push({
          page: counter,
          filename: filename,
          path: imagePath,
          size: image.length,
        });

        this.logger.debug(`Converted page ${counter} - ${filename}`);
        counter++;
      }

      this.logger.log(`Successfully converted ${images.length} pages`);
      return images;
    } catch (error) {
      this.logger.error(`PDF conversion failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        `Erro na conversão do PDF: ${error.message}`,
      );
    }
  }

  async processUploadedPdf(
    file: Express.Multer.File,
  ): Promise<ConversionResult> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo PDF foi enviado');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Apenas arquivos PDF são permitidos');
    }

    const outputDir = this.fileService.generateOutputDirectoryPath(
      file.filename,
    );

    try {
      // Ensure output directory exists
      await this.fileService.ensureDirectoryExists(outputDir);

      // Convert PDF to images
      const images = await this.convertPdfToImages(file, outputDir);

      // Clean up temporary file
      await this.fileService.deleteFile(file.path);

      return {
        success: true,
        message: 'PDF convertido em imagens com sucesso',
        originalFile: file.originalname,
        totalPages: images.length,
        outputDirectory: outputDir,
        images,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // Clean up on error
      await this.fileService.deleteFile(file.path);
      throw error;
    }
  }

  async listConversions(): Promise<ConversionSummary[]> {
    try {
      const outputPath = path.join(process.cwd(), 'output');
      const directories = await this.fileService.listDirectories(outputPath);

      const conversions: ConversionSummary[] = [];

      for (const dir of directories) {
        const dirPath = path.join(outputPath, dir);
        const stats = await this.fileService.getDirectoryStats(dirPath);

        conversions.push({
          id: dir,
          createdAt: stats.createdAt,
          totalPages: stats.imageFiles,
          imageFiles: stats.imageFiles,
          totalSize: stats.totalSize,
          path: dirPath,
        });
      }

      // Sort by creation date (newest first)
      return conversions.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    } catch (error) {
      this.logger.error(
        `Failed to list conversions: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Erro ao listar conversões');
    }
  }

  async deleteDocument(documentId: string): Promise<void> {
    try {
      this.logger.log(`Deleting document: ${documentId}`);

      // Verificar se o documento existe
      const conversions = await this.listConversions();
      const document = conversions.find((c) => c.id === documentId);

      if (!document) {
        throw new BadRequestException(
          `Documento com ID ${documentId} não encontrado`,
        );
      }

      const outputPath = path.join(process.cwd(), 'output', documentId);

      // Deletar o diretório e todos os arquivos
      await this.fileService.deleteDirectory(outputPath);

      this.logger.log(`Document ${documentId} deleted successfully`);
    } catch (error) {
      this.logger.error(
        `Failed to delete document ${documentId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
