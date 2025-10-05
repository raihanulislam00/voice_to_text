# 🎤 Voice to Text Converter

A modern full-stack application that converts audio files to text using AI-powered transcription services. Built with NestJS backend and Next.js frontend.

![Voice to Text Demo](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Voice+to+Text+Converter)

## ✨ Features

- 🎵 **Multiple Audio Formats Support** - MP3, WAV, OGG, MP4, M4A, WEBM, FLAC
- 🚀 **Modern Tech Stack** - NestJS + Next.js with TypeScript
- 🎨 **Beautiful UI** - Responsive design with Tailwind CSS
- 📁 **Drag & Drop Upload** - Intuitive file upload interface
- 🔄 **Real-time Processing** - Live upload progress and status updates
- 📝 **Text Export** - Copy transcribed text to clipboard
- 🛡️ **Type Safe** - Full TypeScript implementation
- 🎯 **RESTful API** - Well-documented API endpoints
- 🔍 **File Validation** - Size and format validation
- 🧹 **Auto Cleanup** - Automatic temporary file cleanup

## 🏗️ Architecture

```
voice_to_text/
├── backend/          # NestJS API Server
│   ├── src/
│   │   ├── file/     # File upload & transcription logic
│   │   └── main.ts   # Application entry point
│   ├── uploads/      # Temporary file storage
│   └── public/       # Static web interface
└── frontend/         # Next.js React Application
    ├── app/          # App Router pages
    └── public/       # Static assets
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Gemini API Key** (for AI transcription)

### 1. Clone the Repository

```bash
git clone https://github.com/raihanulislam00/voice_to_text.git
cd voice_to_text
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

**Get your Gemini API key from:** [Google AI Studio](https://makersuite.google.com/app/apikey)

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Start Development Servers

**Backend (Terminal 1):**
```bash
cd backend
npm run start:dev
```
Server runs on: `http://localhost:3000`

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3001`

## 🎯 Usage

### Web Interface

1. **Visit the Application**:
   - Frontend: `http://localhost:3001` (Modern React UI)
   - Backend Web: `http://localhost:3000` (Built-in interface)

2. **Upload Audio**:
   - Drag & drop audio file or click to select
   - Supported formats: MP3, WAV, OGG, MP4, M4A, WEBM, FLAC
   - Maximum size: 10MB

3. **Get Transcription**:
   - Wait for AI processing
   - Copy transcribed text
   - Start new transcription

### API Usage

**Upload Audio File:**
```bash
curl -X POST \
  http://localhost:3000/api/file/upload \
  -H "Content-Type: multipart/form-data" \
  -F "audio=@path/to/your/audio/file.mp3"
```

**Response:**
```json
{
  "success": true,
  "message": "Audio file successfully converted to text",
  "data": {
    "text": "Your transcribed text here...",
    "filename": "audio.mp3",
    "size": 1234567
  },
  "timestamp": "2025-10-05T12:00:00.000Z"
}
```

## 📡 API Endpoints

| Method | Endpoint             | Description                    |
|--------|---------------------|--------------------------------|
| POST   | `/api/file/upload`  | Upload and transcribe audio    |
| GET    | `/api/file/info`    | Get supported formats & status |
| GET    | `/api/file/health`  | Health check                   |

## ⚙️ Configuration

### Environment Variables

**Backend (`.env`):**
```env
# Required
GEMINI_API_KEY=your_gemini_api_key

# Optional
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_PATH=./uploads
```

### File Upload Limits

- **Maximum file size:** 10MB
- **Supported formats:** MP3, WAV, OGG, MP4, M4A, WEBM, FLAC
- **Processing timeout:** 60 seconds

## 🛠️ Development

### Backend Scripts

```bash
npm run start:dev    # Development with hot reload
npm run start:debug  # Debug mode
npm run build       # Build for production
npm run start:prod  # Production mode
npm run test        # Run tests
npm run lint        # Run linter
```

### Frontend Scripts

```bash
npm run dev     # Development server
npm run build   # Build for production  
npm run start   # Production server
```

### Project Structure

```
backend/
├── src/
│   ├── app.module.ts        # Root module
│   ├── main.ts              # Entry point
│   └── file/
│       ├── file.controller.ts  # API routes
│       ├── file.service.ts     # Business logic
│       └── file.module.ts      # Module config
├── uploads/                 # Temp storage
├── public/                  # Static files
└── .env                     # Environment config

frontend/
├── app/
│   ├── page.tsx            # Main page
│   ├── layout.tsx          # App layout
│   └── globals.css         # Global styles
└── public/                 # Static assets
```

## 🔧 Production Deployment

### Backend Deployment

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend Deployment

```bash
cd frontend
npm run build
npm start
```

### Docker Support (Optional)

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Use TypeScript for all new code
- Follow existing code style and formatting
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 🐛 Troubleshooting

### Common Issues

**1. "GEMINI_API_KEY not found"**
```bash
# Solution: Set your API key in .env file
GEMINI_API_KEY=your_actual_api_key_here
```

**2. "Invalid file type"**
- Ensure audio file is in supported format
- Check file is not corrupted
- Verify file extension matches content

**3. "File too large"**
- Compress audio file to under 10MB
- Use audio compression tools

**4. "Cannot connect to API"**
- Ensure backend is running on port 3000
- Check firewall settings
- Verify CORS configuration

**5. "Audio transcription limitations"**
- Current Gemini models have limited audio support
- Consider using Google Speech-to-Text API for production
- See API documentation for alternatives

### Debug Mode

**Backend:**
```bash
npm run start:debug
```

**Frontend:**
```bash
npm run dev
```

## 🔮 Future Enhancements

- [ ] **Google Speech-to-Text Integration** - Production-ready audio transcription
- [ ] **OpenAI Whisper Support** - Alternative transcription service
- [ ] **Real-time Audio Recording** - Direct browser recording
- [ ] **Multiple Language Support** - Transcription in various languages
- [ ] **Batch Processing** - Multiple file uploads
- [ ] **User Authentication** - Personal transcription history
- [ ] **Audio Playback** - In-app audio player
- [ ] **Export Options** - PDF, DOCX, TXT formats
- [ ] **Speaker Identification** - Multiple speaker detection
- [ ] **Timestamps** - Time-coded transcriptions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NestJS** - Progressive Node.js framework
- **Next.js** - React framework for production
- **Google Gemini AI** - AI language model
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Typed JavaScript

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/raihanulislam00/voice_to_text/issues)
- **Discussions**: [GitHub Discussions](https://github.com/raihanulislam00/voice_to_text/discussions)
- **Email**: [raihanulislam00@gmail.com](mailto:raihanulislam00@gmail.com)

---

**Made with ❤️ by [Raihanul Islam](https://github.com/raihanulislam00)**

⭐ **Star this repository if you found it helpful!**