const multer = require('multer');

// Memory storage — files available as req.file.buffer
const storage = multer.memoryStorage();

// File filter: accept images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/tiff',
    'application/pdf'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: ${allowedMimes.join(', ')}`), false);
  }
};

// Single file upload (10MB max)
const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }  // 10 MB
}).single('file');

// Multiple files upload (up to 5 files, 10MB each)
const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
}).array('files', 5);

// Named fields upload (for specific document types)
const uploadFields = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
}).fields([
  { name: 'sevenTwelve', maxCount: 1 },
  { name: 'noc', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]);

/**
 * Middleware wrapper that handles multer errors gracefully.
 */
const handleUpload = (uploadFn) => (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ success: false, error: 'File too large. Maximum 10MB.' });
      }
      return res.status(400).json({ success: false, error: err.message });
    }
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
};

module.exports = {
  uploadSingle: handleUpload(uploadSingle),
  uploadMultiple: handleUpload(uploadMultiple),
  uploadFields: handleUpload(uploadFields)
};
