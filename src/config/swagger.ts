import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { EnvService } from './env';

export function setupSwagger(
  app: INestApplication,
  envService: EnvService,
): void {
  const appName = envService.get('APP_NAME');
  const appDescription = envService.get('APP_DESCRIPTION');
  const appVersion = envService.get('APP_VERSION');
  const swaggerPath = envService.get('SWAGGER_PATH');

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(appDescription)
    .setVersion(appVersion)
    .addSecurity('Auth', {
      description: 'Bearer <JWT>',
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .addSecurityRequirements('Auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document);
}
