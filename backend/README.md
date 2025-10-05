# Voice to Text Converter

A simple web application that converts voice recordings to text using speech-to-text technology.

## Features

- Record audio directly from your browser
- Convert speech to text (placeholder implementation)
- Simple web interface
- File upload support

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the development server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Click "Start Recording" to begin recording your voice

4. Click "Stop Recording" to finish and process the audio

## Project Structure

- `index.js` - Main server file with Express.js setup
- `package.json` - Project dependencies and scripts
- `uploads/` - Directory for storing uploaded audio files (created automatically)

## Dependencies

- **express** - Web framework
- **multer** - File upload handling
- **speech-to-text** - Speech recognition (placeholder)
- **nodemon** - Development server with auto-reload

## Notes

This is a basic setup. The actual speech-to-text conversion is currently a placeholder. To implement real speech-to-text functionality, you would need to integrate with services like:

- Google Cloud Speech-to-Text API
- Amazon Transcribe
- Microsoft Azure Speech Services
- OpenAI Whisper API

## License

MIT