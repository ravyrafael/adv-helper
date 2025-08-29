import { ApiProperty } from '@nestjs/swagger';

export class UploadPdfDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'PDF file to convert to images',
    example: 'documento.pdf',
  })
  file: Express.Multer.File;
}
