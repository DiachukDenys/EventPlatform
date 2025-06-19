const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');


const { register, login, getMe, updateProfile, uploadUserPhoto, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);

router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.post('/upload-photo', protect, upload.single('photo'), uploadUserPhoto);

module.exports = router;
