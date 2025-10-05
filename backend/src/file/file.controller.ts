import { 
  Controller, 
  Post, 
  Get, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `audio-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 
          'audio/mp4', 'audio/m4a', 'audio/webm', 'audio/flac'
        ];
        
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Invalid file type. Please upload an audio file.'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Please select an audio file to upload');
    }

    try {
      const result = await this.fileService.convertAudioToText(file);
      
      return {
        success: true,
        message: 'Audio file successfully converted to text',
        data: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('info')
  async getUploadInfo() {
    const info = await this.fileService.getUploadInfo();
    
    return {
      success: true,
      message: 'Upload information retrieved successfully',
      data: info,
      timestamp: new Date().toISOString()
    };
  }

  @Get('health')
  getHealthCheck() {
    return {
      success: true,
      message: 'Voice to Text API is running',
      service: 'file-upload-service',
      timestamp: new Date().toISOString()
    };
  }
}
