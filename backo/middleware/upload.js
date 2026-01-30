const multer = require('multer');
const path = require('path');

/* ================= STORAGE ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

/* ================= FILE FILTER (optional) ================= */

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only image files allowed'), false);
  }
};

/* ================= MULTER ================= */

const upload = multer({
  storage,
  fileFilter,
  // ❌ NO limits for count → unlimited images
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB per image (optional)
  }
});

module.exports = upload;
