const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ✅ Зберігає у папку uploads
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`; // ✅ Унікальна назва
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
