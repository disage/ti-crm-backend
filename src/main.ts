import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:9000',
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
    .setTitle('TI CRM API')
    .setDescription('API for TalentInsight CRM system')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('CRM')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // console.log(JSON.stringify(document, null, 2));
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000/api`);
}
bootstrap();
