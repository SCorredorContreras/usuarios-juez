import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with secure defaults
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*', // Recommended: Specify exact origins in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Allow cookies/sessions if needed
    allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
  });

  // Global validation pipe for all endpoints
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove non-whitelisted properties
      forbidNonWhitelisted: true, // Throw errors for non-whitelisted properties
      transform: true, // Automatically transform payloads to DTO instances
    })
  );

  const port = Number(process.env.SERVER_PORT) || 3000;

  // Swagger documentation configuration
  const config = new DocumentBuilder()
    .setTitle('Authentication Microservice API')
    .setDescription(`
      ## API Documentation
      Secure authentication and user management system.

      ### Features
      - User registration and login
      - JWT token generation and validation
      - Password reset functionality
      - Role-based access control
      - User profile management

      ### Authentication
      Most endpoints require JWT authentication. Include the token in the Authorization header as:
      \`Authorization: Bearer <your-token>\`
    `)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth' // This name references the security scheme
    )
    .addTag('Auth', 'Authentication endpoints (login, register, token refresh)')
    .addTag('Users', 'User management operations')
    .addTag('Admin', 'Administrative operations (requires admin role)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Swagger UI setup
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Preserve auth token across page refreshes
      tagsSorter: 'alpha', // Sort tags alphabetically
      operationsSorter: 'alpha', // Sort operations alphabetically
      docExpansion: 'none', // Collapse all docs by default
      filter: true, // Enable search/filter functionality
      displayRequestDuration: true, // Show request processing time
    },
    customSiteTitle: 'Authentication API Documentation',
    customCss: `
      .topbar { background-color: #2c3e50; }
      .swagger-ui .info { margin: 20px 0; }
    `,
  });

  await app.listen(port, () => {
    console.log(`🚀 Authentication service running on port ${port}`);
    console.log(`📚 API documentation available at http://localhost:${port}/api/docs`);
  });
}

bootstrap();