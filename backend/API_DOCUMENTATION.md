# Voice to Text API

A powerful NestJS API that converts audio files to text using Google's Gemini AI.

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Get your Gemini API key from:** https://makersuite.google.com/app/apikey

### 3. Run the Application
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

### 4. Access the Application
- **Web Interface**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/file/info
- **Health Check**: http://localhost:3000/api/file/health

## 📡 API Endpoints

### POST `/api/file/upload`
Convert audio file to text.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `audio` field containing the audio file

**Supported Audio Formats:**
- MP3, WAV, OGG, MP4, M4A, WEBM, FLAC
- Maximum file size: 10MB

**Response:**
```json
{
  "success": true,
  "message": "Audio file successfully converted to text",
  "data": {
    "text": "Transcribed text content...",
    "filename": "original_filename.mp3",
    "size": 1234567
  },
  "timestamp": "2025-10-05T05:30:00.000Z"
}
```

### GET `/api/file/info`
Get upload information and supported formats.

**Response:**
```json
{
  "success": true,
  "message": "Upload information retrieved successfully",
  "data": {
    "supportedFormats": ["MP3", "WAV", "OGG", "MP4", "M4A", "WEBM", "FLAC"],
    "maxFileSize": "10MB",
    "apiStatus": "Connected"
  },
  "timestamp": "2025-10-05T05:30:00.000Z"
}
```

### GET `/api/file/health`
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Voice to Text API is running",
  "service": "file-upload-service",
  "timestamp": "2025-10-05T05:30:00.000Z"
}
```

## 🧪 Testing with cURL

### Upload an audio file:
```bash
curl -X POST \
  http://localhost:3000/api/file/upload \
  -H "Content-Type: multipart/form-data" \
  -F "audio=@path/to/your/audio/file.mp3"
```

### Check API status:
```bash
curl http://localhost:3000/api/file/health
```

### Get upload info:
```bash
curl http://localhost:3000/api/file/info
```

## 🔧 Development

### Available Scripts
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run lint` - Run linter

### Project Structure
```
src/
├── main.ts              # Application entry point
├── app.module.ts        # Root module
└── file/
    ├── file.controller.ts   # API endpoints
    ├── file.service.ts      # Business logic & Gemini AI integration
    └── file.module.ts       # File module configuration
public/
└── index.html           # Web interface
uploads/                 # Temporary audio file storage
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini AI API Key | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## 🛠️ Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY not found"**
   - Make sure you've created a `.env` file with your API key
   - Get your API key from: https://makersuite.google.com/app/apikey

2. **"Invalid file type"**
   - Ensure your audio file is in a supported format
   - Check that the file is not corrupted

3. **"File too large"**
   - Audio files must be under 10MB
   - Consider compressing your audio file

4. **"Cannot connect to API"**
   - Make sure the server is running on port 3000
   - Check if any firewall is blocking the connection

## 📝 Notes

- Files are temporarily stored in the `uploads/` directory and automatically deleted after processing
- The API uses Google's Gemini AI for audio transcription
- CORS is enabled for all origins in development mode
- The web interface provides a user-friendly way to test the API

## 🔒 Security Considerations

- The API validates file types and sizes
- Uploaded files are automatically cleaned up after processing
- Consider implementing rate limiting for production use
- Keep your Gemini API key secure and never commit it to version control

## 📄 License

MIT License