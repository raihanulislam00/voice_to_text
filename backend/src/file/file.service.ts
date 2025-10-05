import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class FileService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Initialize Gemini AI - you'll need to set your API key
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Environment variables:', Object.keys(process.env).filter(key => key.includes('GEMINI')));
    console.log('GEMINI_API_KEY loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
    
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found in environment variables. Please set it to use AI features.');
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
      console.log('✅ Gemini AI initialized successfully!');
    }
  }

  async convertAudioToText(file: Express.Multer.File): Promise<{ text: string; filename: string; size: number }> {
    if (!file) {
      throw new BadRequestException('No audio file provided');
    }

    // Validate file type
    const allowedMimeTypes = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 
      'audio/mp4', 'audio/m4a', 'audio/webm', 'audio/flac'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Please upload an audio file.');
    }

    try {
      let transcribedText = '';

      if (this.genAI) {
        try {
          // Attempt Gemini AI audio transcription
          transcribedText = await this.transcribeWithGemini(file);
        } catch (error) {
          console.warn('Gemini transcription failed, using fallback message:', error.message);
          // Provide informative fallback message
          transcribedText = `Audio transcription failed: ${error.message}\n\nNOTE: Current Gemini models don't support direct audio transcription. For production use, consider:\n\n1. Google Speech-to-Text API: https://cloud.google.com/speech-to-text\n2. OpenAI Whisper API: https://openai.com/research/whisper\n3. AssemblyAI: https://www.assemblyai.com\n\nFile details:\n- Name: ${file.originalname}\n- Size: ${(file.size / 1024).toFixed(2)} KB\n- Type: ${file.mimetype}`;
        }
      } else {
        // Fallback response when API key is not available
        transcribedText = 'Gemini AI transcription is not available. Please set GEMINI_API_KEY environment variable.';
      }

      // Clean up the uploaded file
      await this.cleanupFile(file.path);

      return {
        text: transcribedText,
        filename: file.originalname,
        size: file.size
      };

    } catch (error) {
      // Clean up file in case of error
      await this.cleanupFile(file.path);
      throw new InternalServerErrorException(`Error processing audio file: ${error.message}`);
    }
  }

  private async transcribeWithGemini(file: Express.Multer.File): Promise<string> {
    try {
      // Note: Current Gemini models don't support direct audio transcription
      // This is a limitation of the Gemini API - it's designed for text and image processing
      // For production use, consider integrating with Google Speech-to-Text API or OpenAI Whisper
      
      console.log('Attempting audio transcription with available models...');
      
      // Try different models that might support audio processing
      const modelsToTry = [
        'gemini-1.5-pro',
        'gemini-1.5-flash', 
        'gemini-pro'
      ];
      
      for (const modelName of modelsToTry) {
        try {
          console.log(`Trying model: ${modelName}`);
          
          // Read the audio file
          const audioData = await fs.readFile(file.path);
          const base64Audio = audioData.toString('base64');
          
          // Get the Gemini model
          const model = this.genAI.getGenerativeModel({ model: modelName });
          
          // Create the prompt for audio transcription
          const prompt = `Please transcribe the following audio file to text. Provide only the transcribed text without any additional formatting or explanations.`;
          
          // Prepare the request with audio data
          const result = await model.generateContent([
            prompt,
            {
              inlineData: {
                mimeType: file.mimetype,
                data: base64Audio
              }
            }
          ]);

          const response = await result.response;
          const text = response.text();
          
          console.log(`Successfully transcribed with model: ${modelName}`);
          return text || 'No speech detected in the audio file.';
          
        } catch (modelError) {
          console.log(`Model ${modelName} failed:`, modelError.message);
          continue; // Try next model
        }
      }
      
      // If all models fail, throw error with helpful message
      throw new Error('Audio transcription is not currently supported by available Gemini models. Please use Google Speech-to-Text API or OpenAI Whisper for audio transcription.');
      
    } catch (error) {
      console.error('Gemini AI transcription error:', error);
      
      // Return a more user-friendly error message
      if (error.message?.includes('API key')) {
        throw new Error('Invalid or expired Gemini API key. Please check your API key configuration.');
      } else if (error.message?.includes('quota')) {
        throw new Error('Gemini API quota exceeded. Please check your usage limits.');
      } else if (error.message?.includes('Audio transcription is not currently supported')) {
        throw new Error(error.message);
      } else {
        throw new Error('Current Gemini models do not support audio transcription. Consider using Google Speech-to-Text API or OpenAI Whisper API for audio processing.');
      }
    }
  }

  private async cleanupFile(filePath: string): Promise<void> {
    try {
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
      }
    } catch (error) {
      console.warn(`Failed to cleanup file ${filePath}:`, error.message);
    }
  }

  async getUploadInfo(): Promise<{ 
    supportedFormats: string[]; 
    maxFileSize: string; 
    apiStatus: string;
    note: string;
  }> {
    return {
      supportedFormats: ['MP3', 'WAV', 'OGG', 'MP4', 'M4A', 'WEBM', 'FLAC'],
      maxFileSize: '10MB',
      apiStatus: this.genAI ? 'Connected (Limited Audio Support)' : 'API Key Required',
      note: 'Current Gemini models have limited audio transcription support. For production use, consider Google Speech-to-Text API or OpenAI Whisper.'
    };
  }
}
