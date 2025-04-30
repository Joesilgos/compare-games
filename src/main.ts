import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }),
);

  const config = new DocumentBuilder()
    .setTitle('Games API')
    .setDescription(
      'API para buscar e listar informações de jogos, integrando com RAWG e HowLongToBeat.',
    )
    .setVersion('1.0')
    .addTag('games', 'Operações relacionadas a jogos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document)

  // Start the application
  const port = Number(process.env.PORT) || 3333;
  const hostname = '0.0.0.0';
  await app.listen(port, '0.0.0.0', () => {
    const address = 'http://' + hostname + ':' + port + '/';
    Logger.log('Listening at ' + address);
  });
}
bootstrap();
