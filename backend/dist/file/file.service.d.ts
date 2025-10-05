export declare class FileService {
    private genAI;
    constructor();
    convertAudioToText(file: Express.Multer.File): Promise<{
        text: string;
        filename: string;
        size: number;
    }>;
    private transcribeWithGemini;
    private cleanupFile;
    getUploadInfo(): Promise<{
        supportedFormats: string[];
        maxFileSize: string;
        apiStatus: string;
        note: string;
    }>;
}
