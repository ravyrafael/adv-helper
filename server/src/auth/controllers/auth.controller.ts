import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('status')
  @ApiOperation({
    summary: 'Status da autenticação',
    description: 'Verifica o status do módulo de autenticação',
  })
  @ApiResponse({
    status: 200,
    description: 'Status do módulo de autenticação',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ready' },
        message: {
          type: 'string',
          example: 'Authentication module ready for implementation',
        },
      },
    },
  })
  getAuthStatus() {
    return this.authService.getAuthStatus();
  }
}
