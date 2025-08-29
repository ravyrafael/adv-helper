import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000', // Frontend Next.js
      'http://localhost:3001',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Adv Helper API')
      .setDescription(
        'Sistema de Auxílio de Advocacia - API para conversão de PDF em imagens',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('pdf', 'Operações relacionadas a conversão de PDF')
      .addTag('auth', 'Autenticação e autorização')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log('🚀 Servidor NestJS rodando na porta', port);
  console.log('📁 Diretório de uploads:', process.cwd() + '/uploads');
  console.log('📁 Diretório de saída:', process.cwd() + '/output');
  console.log('🌐 Acesse: http://localhost:' + port);
  console.log('📚 Documentação: http://localhost:' + port + '/api/docs');
}

bootstrap();
