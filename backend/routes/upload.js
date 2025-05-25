const authMiddleware = require('../middleware/authMiddleware');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const util = require('util');
const db = require('../config/db');
const router = express.Router();

const unlink = util.promisify(fs.unlink);
const mkdir = util.promisify(fs.mkdir);
const exists = util.promisify(fs.exists);

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const userId = req.user.id;
    const dir = path.join(__dirname, '../uploads', String(userId));
    const dirExists = await exists(dir);
    if (!dirExists) await mkdir(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, Date.now() + '-' + name + ext);
  }
});

const upload = multer({ storage });

router.post('/files', authMiddleware, upload.single('file'), async (req, res) => {
  const file = req.file;
  const userId = req.user.id;

  if (!file) return res.status(400).json({ message: 'Dosya yok' });

  try {
    await db.query(
      'INSERT INTO files (filename, originalname, mimetype, size, user_id) VALUES (?, ?, ?, ?, ?)',
      [file.filename, file.originalname, file.mimetype, file.size, userId]
    );

    res.status(200).json({ message: 'Dosya başarıyla yüklendi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
  }
});

router.get('/files', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.query(
      'SELECT * FROM files WHERE user_id = ? ORDER BY uploaded_at DESC',
      [userId]
    );

    const files = rows.map(file => ({
      ...file,
      url: `http://localhost:5000/uploads/${userId}/${file.filename}`
    }));

    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Listeleme hatası', error: err.message });
  }
});

router.delete('/files/:id', authMiddleware, async (req, res) => {
  const fileId = req.params.id;
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      'SELECT * FROM files WHERE id = ? AND user_id = ?',
      [fileId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Dosya bulunamadı veya yetkiniz yok' });
    }

    const filePath = path.join(__dirname, '../uploads', String(userId), rows[0].filename);
    await unlink(filePath);

    await db.query('DELETE FROM files WHERE id = ?', [fileId]);
    res.status(200).json({ message: 'Dosya silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Silme hatası', error: err.message });
  }
});



module.exports = router;
