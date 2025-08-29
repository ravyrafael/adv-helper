export interface ConvertedImage {
  page: number;
  filename: string;
  path: string;
  size: number;
}

export interface ConversionResult {
  success: boolean;
  message: string;
  originalFile: string;
  totalPages: number;
  outputDirectory: string;
  images: ConvertedImage[];
  timestamp: string;
}

export interface ConversionSummary {
  id: string;
  createdAt: Date;
  totalPages: number;
  imageFiles: number;
  totalSize: number;
  path: string;
}
