import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    summary: 'Informações da API',
    description: 'Retorna informações gerais sobre a API',
  })
  @ApiResponse({
    status: 200,
    description: 'Informações da API',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        version: { type: 'string' },
        endpoints: { type: 'object' },
        features: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  getAppInfo() {
    return {
      message:
        'Sistema de Auxílio de Advocacia - API para conversão de PDF em imagens',
      version: '2.0.0',
      framework: 'NestJS',
      endpoints: {
        convert: 'POST /api/v1/pdf/convert',
        conversions: 'GET /api/v1/pdf/conversions',
        auth: 'GET /api/v1/auth/status',
        health: 'GET /api/v1/health',
        docs: 'GET /api/docs',
      },
      features: [
        'Conversão de PDF para imagens PNG',
        'Alta qualidade (escala 3x)',
        'Arquitetura modular com NestJS',
        'Documentação automática com Swagger',
        'Rate limiting e segurança',
        'Preparado para autenticação',
        'Validação de dados',
        'Logs estruturados',
      ],
    };
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Verifica se a API está funcionando',
  })
  @ApiResponse({
    status: 200,
    description: 'API está funcionando',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        timestamp: { type: 'string', example: '2025-08-29T14:56:25.352Z' },
        uptime: { type: 'number', example: 12345 },
      },
    },
  })
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
