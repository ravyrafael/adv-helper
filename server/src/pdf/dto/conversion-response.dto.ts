import { ApiProperty } from '@nestjs/swagger';

export class ConvertedImageDto {
  @ApiProperty({ description: 'Page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Generated filename', example: 'page.1.png' })
  filename: string;

  @ApiProperty({
    description: 'Full path to the image',
    example: 'output/uuid_document/page.1.png',
  })
  path: string;

  @ApiProperty({ description: 'File size in bytes', example: 320663 })
  size: number;
}

export class ConversionResponseDto {
  @ApiProperty({ description: 'Operation success status', example: true })
  success: boolean;

  @ApiProperty({
    description: 'Success message',
    example: 'PDF convertido em imagens com sucesso',
  })
  message: string;

  @ApiProperty({
    description: 'Original filename',
    example: 'documento.pdf',
  })
  originalFile: string;

  @ApiProperty({ description: 'Total number of pages', example: 17 })
  totalPages: number;

  @ApiProperty({
    description: 'Output directory path',
    example: 'output/uuid_documento',
  })
  outputDirectory: string;

  @ApiProperty({
    type: [ConvertedImageDto],
    description: 'Array of converted images',
  })
  images: ConvertedImageDto[];

  @ApiProperty({
    description: 'Conversion timestamp',
    example: '2025-08-29T14:56:25.352Z',
  })
  timestamp: string;
}

export class ConversionSummaryDto {
  @ApiProperty({
    description: 'Unique conversion ID',
    example: 'uuid_documento',
  })
  id: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-08-29T14:56:25.352Z',
  })
  createdAt: Date;

  @ApiProperty({ description: 'Total number of pages', example: 17 })
  totalPages: number;

  @ApiProperty({ description: 'Number of image files', example: 17 })
  imageFiles: number;

  @ApiProperty({ description: 'Total size in bytes', example: 6234567 })
  totalSize: number;

  @ApiProperty({
    description: 'Full path to conversion directory',
    example: '/path/to/output/uuid_documento',
  })
  path: string;
}

export class ConversionsListResponseDto {
  @ApiProperty({
    type: [ConversionSummaryDto],
    description: 'List of all conversions',
  })
  conversions: ConversionSummaryDto[];
}
