import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${safeName}`);
  }
});

// Up to 250MB for HD video & camera photos
const upload = multer({
  storage,
  limits: { fileSize: 250 * 1024 * 1024 }
});

// 1. Direct Multipart Form-Data upload: supports ANY photo and ANY video format
router.post('/', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const host = req.get('host') || 'localhost:4000';
  const protocol = req.protocol || 'http';
  const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

  return res.json({
    success: true,
    url: fileUrl,
    filename: req.file.originalname,
    storedFilename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// 2. Base64 fallback upload (for browser canvas / webcam recordings)
router.post('/base64', (req: Request, res: Response) => {
  try {
    const { data, filename } = req.body;
    if (!data) return res.status(400).json({ error: 'No data provided' });

    let buffer: Buffer;
    let ext = '.jpg';

    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mime = matches[1];
      buffer = Buffer.from(matches[2], 'base64');
      if (mime.includes('jpeg') || mime.includes('jpg')) ext = '.jpg';
      else if (mime.includes('png')) ext = '.png';
      else if (mime.includes('webp')) ext = '.webp';
      else if (mime.includes('gif')) ext = '.gif';
      else if (mime.includes('mp4')) ext = '.mp4';
      else if (mime.includes('webm')) ext = '.webm';
      else if (mime.includes('quicktime')) ext = '.mov';
    } else {
      buffer = Buffer.from(data, 'base64');
      if (filename) ext = path.extname(filename) || '.jpg';
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const savedName = `upload-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadsDir, savedName);
    fs.writeFileSync(filePath, buffer);

    const host = req.get('host') || 'localhost:4000';
    const protocol = req.protocol || 'http';
    const fileUrl = `${protocol}://${host}/uploads/${savedName}`;

    return res.json({
      success: true,
      url: fileUrl,
      size: buffer.length
    });
  } catch (err: any) {
    console.error('Base64 upload error:', err);
    return res.status(500).json({ error: 'Failed to process base64 upload' });
  }
});

export default router;
