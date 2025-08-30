import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fsExtra.ensureDir(dirPath);
      this.logger.debug(`Directory ensured: ${dirPath}`);
    } catch (error) {
      this.logger.error(`Failed to ensure directory: ${dirPath}`, error);
      throw error;
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
      this.logger.debug(`File deleted: ${filePath}`);
    } catch (error) {
      this.logger.warn(`Failed to delete file: ${filePath}`, error);
      // Don't throw error for cleanup operations
    }
  }

  async deleteDirectory(dirPath: string): Promise<void> {
    try {
      await fsExtra.remove(dirPath);
      this.logger.debug(`Directory deleted: ${dirPath}`);
    } catch (error) {
      this.logger.error(`Failed to delete directory: ${dirPath}`, error);
      throw error;
    }
  }

  async writeFile(filePath: string, data: Buffer): Promise<void> {
    try {
      await fs.writeFile(filePath, data);
      this.logger.debug(`File written: ${filePath}`);
    } catch (error) {
      this.logger.error(`Failed to write file: ${filePath}`, error);
      throw error;
    }
  }

  generateUniqueFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    return `${uuidv4()}_${name}${ext}`;
  }

  generateOutputDirectoryPath(filename: string): string {
    const nameWithoutExt = path.parse(filename).name;
    return path.join('output', nameWithoutExt);
  }

  async getDirectoryStats(dirPath: string): Promise<{
    imageFiles: number;
    totalSize: number;
    createdAt: Date;
  }> {
    try {
      const stat = await fs.stat(dirPath);
      const files = await fs.readdir(dirPath);
      const imageFiles = files.filter((file) => file.endsWith('.png'));

      let totalSize = 0;
      for (const file of imageFiles) {
        const fileStat = await fs.stat(path.join(dirPath, file));
        totalSize += fileStat.size;
      }

      return {
        imageFiles: imageFiles.length,
        totalSize,
        createdAt: stat.birthtime,
      };
    } catch (error) {
      this.logger.error(`Failed to get directory stats: ${dirPath}`, error);
      return {
        imageFiles: 0,
        totalSize: 0,
        createdAt: new Date(),
      };
    }
  }

  async listDirectories(basePath: string): Promise<string[]> {
    try {
      const items = await fs.readdir(basePath);
      const directories = [];

      for (const item of items) {
        const itemPath = path.join(basePath, item);
        const stat = await fs.stat(itemPath);
        if (stat.isDirectory()) {
          directories.push(item);
        }
      }

      return directories;
    } catch (error) {
      this.logger.error(`Failed to list directories: ${basePath}`, error);
      return [];
    }
  }
}
