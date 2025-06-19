const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Event   = require('../models/Event');
const Auth = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');


// GET /api/users/:id/public
router.get('/:id/public', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name photo roles');
    if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

    const events = await Event.find({ organizer: req.params.id })
                              .select('title startDate endDate images collectedAmount targetAmount');

    res.json({ user, events });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});
router.patch('/:id', protect, Auth.updateProfile);


module.exports = router;
