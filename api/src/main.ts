import { NestFactory } from '@nestjs/core';
import { apiReference } from '@scalar/nestjs-api-reference';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Hotel Bookings API')
    .setDescription('API for managing hotel bookings and rooming lists')
    .setVersion('1.0')
    .addServer(
      `http://localhost:${configService.get<number>('PORT') || 3001}`,
      'Local Development Server',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = () =>
    SwaggerModule.createDocument(app, config, {
      ignoreGlobalPrefix: false,
      deepScanRoutes: true,
      autoTagControllers: true,
    });

  app.use(
    '/docs',
    apiReference({
      withFastify: true,
      spec: {
        content: document(),
      },
      theme: 'default',
    }),
  );

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Scalar API Docs are available at: http://localhost:${port}/api-docs`,
  );
}
bootstrap();
