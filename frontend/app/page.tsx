'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  type TranscriptionResult = {
    filename: string;
    size: number;
    text: string;
  };

  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('http://localhost:3000/api/file/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Failed to transcribe audio');
      }
    } catch (err) {
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎤 Voice to Text Converter
          </h1>
          <p className="text-lg text-gray-600">
            Upload audio files and convert them to text using AI
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
            
            {loading ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600">Processing audio...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl">📁</div>
                <h3 className="text-lg font-medium text-gray-900">Upload Audio File</h3>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Choose File
                </button>
                <p className="text-sm text-gray-500">
                  Supports: MP3, WAV, OGG, MP4, M4A, WEBM, FLAC (max 10MB)
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">✅ Transcription Result</h2>
              <button
                onClick={() => {
                  setResult(null);
                  setError(null);
                  if (fileRef.current) fileRef.current.value = '';
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                New Upload
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>File:</strong> {result.filename}</p>
                <p><strong>Size:</strong> {(result.size / 1024).toFixed(2)} KB</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">Transcribed Text</h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result.text);
                      alert('Text copied!');
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Copy
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border max-h-64 overflow-y-auto">
                  <p className="whitespace-pre-wrap">{result.text || 'No text detected'}</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Words: {result.text ? result.text.split(/\s+/).length : 0}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            Powered by Google Gemini AI • Backend: localhost:3000 • Frontend: localhost:3002
          </p>
        </div>
      </div>
    </div>
  );
}
