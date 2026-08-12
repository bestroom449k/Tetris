const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
        if (allowed.test(file.originalname)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Middleware
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Upload endpoint
app.post('/upload', upload.single('blockImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
        success: true,
        imageUrl: imageUrl,
        filename: req.file.filename
    });
});

// Get all uploaded images
app.get('/api/images', (req, res) => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Could not read uploads directory' });
        }

        const images = files.map(file => ({
            filename: file,
            url: `/uploads/${file}`
        }));

        res.json(images);
    });
});

// Delete image
app.delete('/api/images/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);

    fs.unlink(filepath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not delete file' });
        }
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Tetris server running on http://localhost:${PORT}`);
});
