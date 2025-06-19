const express  = require('express');
const router   = express.Router();
const paymentC = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// POST  /api/payments/:id   (id = eventId)
router.post('/:id', protect, paymentC.donate);
router.get('/my', protect, paymentC.getMyDonations);

module.exports = router;
