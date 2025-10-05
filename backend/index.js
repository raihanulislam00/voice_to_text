const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Voice to Text Converter</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .container { text-align: center; }
            button { padding: 10px 20px; margin: 10px; font-size: 16px; cursor: pointer; }
            #result { margin-top: 20px; padding: 20px; background: #f5f5f5; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Voice to Text Converter</h1>
            <p>Click the button below to start recording:</p>
            <button onclick="startRecording()">Start Recording</button>
            <button onclick="stopRecording()" disabled>Stop Recording</button>
            <div id="result"></div>
        </div>
        
        <script>
            let mediaRecorder;
            let audioChunks = [];
            
            async function startRecording() {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    mediaRecorder = new MediaRecorder(stream);
                    
                    mediaRecorder.ondataavailable = function(event) {
                        audioChunks.push(event.data);
                    };
                    
                    mediaRecorder.onstop = function() {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        audioChunks = [];
                        
                        // Send audio to server for processing
                        const formData = new FormData();
                        formData.append('audio', audioBlob, 'recording.wav');
                        
                        fetch('/convert', {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.json())
                        .then(data => {
                            document.getElementById('result').innerHTML = '<h3>Transcription:</h3><p>' + (data.text || 'No text detected') + '</p>';
                        })
                        .catch(error => {
                            document.getElementById('result').innerHTML = '<p style="color: red;">Error: ' + error.message + '</p>';
                        });
                    };
                    
                    mediaRecorder.start();
                    document.querySelector('button').disabled = true;
                    document.querySelector('button:nth-child(2)').disabled = false;
                    document.getElementById('result').innerHTML = '<p style="color: green;">Recording...</p>';
                } catch (error) {
                    alert('Error accessing microphone: ' + error.message);
                }
            }
            
            function stopRecording() {
                mediaRecorder.stop();
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
                document.querySelector('button').disabled = false;
                document.querySelector('button:nth-child(2)').disabled = true;
                document.getElementById('result').innerHTML = '<p>Processing...</p>';
            }
        </script>
    </body>
    </html>
  `);
});

app.post('/convert', upload.single('audio'), (req, res) => {
  // This is a placeholder for speech-to-text conversion
  // You would integrate with a speech-to-text service here
  // For now, we'll return a placeholder response
  
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }
  
  // Placeholder response
  res.json({ 
    text: 'Speech-to-text conversion is not yet implemented. This is a placeholder response.',
    filename: req.file.filename,
    size: req.file.size
  });
});

app.listen(PORT, () => {
  console.log(`Voice to Text server running at http://localhost:${PORT}`);
});