import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS for frontend integration
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Serve static files from public directory
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  // Set global prefix for API routes
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
  console.log('🚀 Voice to Text API is running on http://localhost:3000');
  console.log('📱 Web Interface: http://localhost:3000');
  console.log('📡 API Endpoint: http://localhost:3000/api/file/upload');
  console.log('💡 Make sure to set GEMINI_API_KEY environment variable for AI features');
}
bootstrap();