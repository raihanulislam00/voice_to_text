"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
const fs = require("fs-extra");
let FileService = class FileService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log('Environment variables:', Object.keys(process.env).filter(key => key.includes('GEMINI')));
        console.log('GEMINI_API_KEY loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
        if (!apiKey) {
            console.warn('GEMINI_API_KEY not found in environment variables. Please set it to use AI features.');
        }
        else {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
            console.log('✅ Gemini AI initialized successfully!');
        }
    }
    async convertAudioToText(file) {
        if (!file) {
            throw new common_1.BadRequestException('No audio file provided');
        }
        const allowedMimeTypes = [
            'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg',
            'audio/mp4', 'audio/m4a', 'audio/webm', 'audio/flac'
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Please upload an audio file.');
        }
        try {
            let transcribedText = '';
            if (this.genAI) {
                try {
                    transcribedText = await this.transcribeWithGemini(file);
                }
                catch (error) {
                    console.warn('Gemini transcription failed, using fallback message:', error.message);
                    transcribedText = `Audio transcription failed: ${error.message}\n\nNOTE: Current Gemini models don't support direct audio transcription. For production use, consider:\n\n1. Google Speech-to-Text API: https://cloud.google.com/speech-to-text\n2. OpenAI Whisper API: https://openai.com/research/whisper\n3. AssemblyAI: https://www.assemblyai.com\n\nFile details:\n- Name: ${file.originalname}\n- Size: ${(file.size / 1024).toFixed(2)} KB\n- Type: ${file.mimetype}`;
                }
            }
            else {
                transcribedText = 'Gemini AI transcription is not available. Please set GEMINI_API_KEY environment variable.';
            }
            await this.cleanupFile(file.path);
            return {
                text: transcribedText,
                filename: file.originalname,
                size: file.size
            };
        }
        catch (error) {
            await this.cleanupFile(file.path);
            throw new common_1.InternalServerErrorException(`Error processing audio file: ${error.message}`);
        }
    }
    async transcribeWithGemini(file) {
        try {
            console.log('Attempting audio transcription with available models...');
            const modelsToTry = [
                'gemini-1.5-pro',
                'gemini-1.5-flash',
                'gemini-pro'
            ];
            for (const modelName of modelsToTry) {
                try {
                    console.log(`Trying model: ${modelName}`);
                    const audioData = await fs.readFile(file.path);
                    const base64Audio = audioData.toString('base64');
                    const model = this.genAI.getGenerativeModel({ model: modelName });
                    const prompt = `Please transcribe the following audio file to text. Provide only the transcribed text without any additional formatting or explanations.`;
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
                }
                catch (modelError) {
                    console.log(`Model ${modelName} failed:`, modelError.message);
                    continue;
                }
            }
            throw new Error('Audio transcription is not currently supported by available Gemini models. Please use Google Speech-to-Text API or OpenAI Whisper for audio transcription.');
        }
        catch (error) {
            console.error('Gemini AI transcription error:', error);
            if (error.message?.includes('API key')) {
                throw new Error('Invalid or expired Gemini API key. Please check your API key configuration.');
            }
            else if (error.message?.includes('quota')) {
                throw new Error('Gemini API quota exceeded. Please check your usage limits.');
            }
            else if (error.message?.includes('Audio transcription is not currently supported')) {
                throw new Error(error.message);
            }
            else {
                throw new Error('Current Gemini models do not support audio transcription. Consider using Google Speech-to-Text API or OpenAI Whisper API for audio processing.');
            }
        }
    }
    async cleanupFile(filePath) {
        try {
            if (await fs.pathExists(filePath)) {
                await fs.remove(filePath);
            }
        }
        catch (error) {
            console.warn(`Failed to cleanup file ${filePath}:`, error.message);
        }
    }
    async getUploadInfo() {
        return {
            supportedFormats: ['MP3', 'WAV', 'OGG', 'MP4', 'M4A', 'WEBM', 'FLAC'],
            maxFileSize: '10MB',
            apiStatus: this.genAI ? 'Connected (Limited Audio Support)' : 'API Key Required',
            note: 'Current Gemini models have limited audio transcription support. For production use, consider Google Speech-to-Text API or OpenAI Whisper.'
        };
    }
};
exports.FileService = FileService;
exports.FileService = FileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FileService);
//# sourceMappingURL=file.service.js.map