import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // En producción, cambia esto a tu origen específico
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
  });


  let puerto: number = Number(process.env.SERVER_PORT);

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      }
    )

    .addTag('cats')
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true, // Mantiene la autorización entre recargas
    },
  })

  await app.listen(puerto, () => {
    console.log("servidor funcionando en el puerto: " + puerto)
  });
}
bootstrap();
