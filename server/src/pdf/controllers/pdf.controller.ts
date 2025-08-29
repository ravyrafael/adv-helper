import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Logger,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { PdfConversionService } from '../services/pdf-conversion.service';
import { OpenAIService } from '../services/openai.service';
import { UploadPdfDto } from '../dto/upload-pdf.dto';
import {
  ConversionResponseDto,
  ConversionsListResponseDto,
} from '../dto/conversion-response.dto';
import { ContractAnalysisResponseDto } from '../dto/analysis-response.dto';

const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueName = `${uuidv4()}_${file.originalname}`;
      callback(null, uniqueName);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (file.mimetype === 'application/pdf') {
      callback(null, true);
    } else {
      callback(new Error('Apenas arquivos PDF são permitidos'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
};

@ApiTags('pdf')
@Controller('pdf')
export class PdfController {
  private readonly logger = new Logger(PdfController.name);

  constructor(
    private readonly pdfConversionService: PdfConversionService,
    private readonly openaiService: OpenAIService,
  ) {}

  @Post('convert')
  @ApiOperation({
    summary: 'Converter PDF em imagens',
    description:
      'Converte um arquivo PDF em imagens PNG de alta qualidade (escala 3x)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'PDF file to convert',
    type: UploadPdfDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'PDF convertido com sucesso',
    type: ConversionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Arquivo inválido ou dados incorretos',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno durante a conversão',
  })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async convertPdf(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ConversionResponseDto> {
    this.logger.log(`Converting PDF: ${file?.originalname}`);

    const result = await this.pdfConversionService.processUploadedPdf(file);

    this.logger.log(
      `Conversion completed: ${result.totalPages} pages generated`,
    );
    return result;
  }

  @Get('conversions')
  @ApiOperation({
    summary: 'Listar conversões',
    description:
      'Lista todas as conversões de PDF realizadas, ordenadas por data de criação',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de conversões recuperada com sucesso',
    type: ConversionsListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno ao listar conversões',
  })
  async listConversions(): Promise<ConversionsListResponseDto> {
    this.logger.log('Listing all conversions');

    const conversions = await this.pdfConversionService.listConversions();

    this.logger.log(`Found ${conversions.length} conversions`);
    return { conversions };
  }

  @Get('documents')
  @ApiOperation({
    summary: 'Listar documentos convertidos',
    description:
      'Lista todos os documentos convertidos com informações de análise',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de documentos recuperada com sucesso',
  })
  async listDocuments() {
    try {
      const conversions = await this.pdfConversionService.listConversions();
      const documents = [];

      for (const conversion of conversions) {
        const document = {
          id: conversion.id,
          filename: `${conversion.id}.pdf`,
          originalName: conversion.id.split('_').slice(1).join('_') + '.pdf',
          createdAt: conversion.createdAt,
          totalImages: conversion.totalPages,
          status: 'converted',
          hasAnalysis: false,
          analysisData: null,
        };

        // Verificar se existe cache de análise
        try {
          const cacheFilePath = path.join(
            process.cwd(),
            'output',
            conversion.id,
            'analysis_cache.json',
          );

          if (fs.existsSync(cacheFilePath)) {
            const cacheContent = fs.readFileSync(cacheFilePath, 'utf8');
            const cacheData = JSON.parse(cacheContent);

            if (cacheData.completed && cacheData.result) {
              document.hasAnalysis = true;
              document.status = 'analyzed';
              document.analysisData = {
                totalContratos: cacheData.result?.contratos?.length || 0,
                totalDescontosCartao:
                  cacheData.result?.descontos_cartao?.length || 0,
                beneficiario: cacheData.result?.beneficiario?.nome || 'N/A',
                dataEmissao: cacheData.result?.data_emissao || 'N/A',
              };
            }
          }
        } catch (error) {
          // Cache não disponível ou com erro
          this.logger.debug(`No analysis cache available for ${conversion.id}`);
        }

        documents.push(document);
      }

      return {
        success: true,
        data: documents,
        total: documents.length,
      };
    } catch (error) {
      this.logger.error(`Error listing documents: ${error.message}`);
      throw new BadRequestException(
        `Erro ao listar documentos: ${error.message}`,
      );
    }
  }

  @Post('analyze/:conversionId')
  @ApiOperation({
    summary: 'Analisar contrato com ChatGPT',
    description:
      'Envia as imagens de uma conversão para o ChatGPT analisar e extrair dados do contrato',
  })
  @ApiParam({
    name: 'conversionId',
    description: 'ID da conversão gerada anteriormente',
    example:
      'ac3df69e-f171-462d-8b71-fc099ef72d2e_extrato_emprestimo_consignado_completo_260324',
  })
  @ApiResponse({
    status: 200,
    description: 'Análise do contrato realizada com sucesso',
    type: ContractAnalysisResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'ID de conversão inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Conversão não encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno na análise',
  })
  async analyzeContract(
    @Param('conversionId') conversionId: string,
  ): Promise<ContractAnalysisResponseDto> {
    this.logger.log(`Analyzing contract for conversion: ${conversionId}`);

    if (!conversionId || conversionId.trim() === '') {
      throw new BadRequestException('ID de conversão é obrigatório');
    }

    try {
      // Verificar se a conversão existe
      const conversions = await this.pdfConversionService.listConversions();
      const conversion = conversions.find((c) => c.id === conversionId);

      if (!conversion) {
        throw new NotFoundException(
          `Conversão com ID ${conversionId} não encontrada`,
        );
      }

      // Obter caminhos das imagens
      const outputDir = path.join(process.cwd(), 'output', conversionId);
      const imagePaths: string[] = [];

      for (let i = 1; i <= conversion.totalPages; i++) {
        const imagePath = path.join(outputDir, `page.${i}.png`);
        imagePaths.push(imagePath);
      }

      this.logger.log(`Found ${imagePaths.length} images for analysis`);

      // Analisar com ChatGPT
      const analysis =
        await this.openaiService.analyzeContractImages(imagePaths);

      this.logger.log('Contract analysis completed successfully');

      return {
        success: true,
        message: 'Análise de contrato concluída com sucesso',
        conversionId,
        analysis,
        totalImages: imagePaths.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Error analyzing contract: ${error.message}`,
        error.stack,
      );

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException(
        `Erro na análise do contrato: ${error.message}`,
      );
    }
  }
}
