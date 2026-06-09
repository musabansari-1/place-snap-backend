const multer = require('multer');

const cloudinary = require('../util/cloudinary');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const upload = multer({
  limits: { fileSize: 500000 },
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    const error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  }
});

const uploadToCloudinary = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'place-snap',
      resource_type: 'image'
    },
    (error, result) => {
      if (error) {
        return next(error);
      }

      req.file.path = result.secure_url;
      req.file.filename = result.public_id;

      return next();
    }
  );

  uploadStream.end(req.file.buffer);
};

module.exports = {
  single: fieldName => [upload.single(fieldName), uploadToCloudinary]
};
