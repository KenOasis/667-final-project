const multer = require('multer');
const path = require('path');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const fileUpload = multer({
  limits: 500000,
  
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      next(null, path.join(__dirname, "..", "public", "images", "profile"));
    },
    filename: (req, file, next) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      next(null, Buffer.from(req.session.userName).toString('base64') + "." + ext);
    }
  }),

  fileFilter: (req, file, next) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid MIME type!');
    next(error, isValid);
  }
});

module.exports = fileUpload;