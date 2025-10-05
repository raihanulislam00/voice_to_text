import { FileService } from './file.service';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    uploadAudio(file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            text: string;
            filename: string;
            size: number;
        };
        timestamp: string;
    }>;
    getUploadInfo(): Promise<{
        success: boolean;
        message: string;
        data: {
            supportedFormats: string[];
            maxFileSize: string;
            apiStatus: string;
            note: string;
        };
        timestamp: string;
    }>;
    getHealthCheck(): {
        success: boolean;
        message: string;
        service: string;
        timestamp: string;
    };
}
