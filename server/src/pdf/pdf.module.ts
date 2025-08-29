import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PdfController } from './controllers/pdf.controller';
import { PdfConversionService } from './services/pdf-conversion.service';
import { OpenAIService } from './services/openai.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    CommonModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [PdfController],
  providers: [PdfConversionService, OpenAIService],
  exports: [PdfConversionService, OpenAIService],
})
export class PdfModule {}
