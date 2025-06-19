const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');
const upload = require('../middleware/uploadMiddleware');

// Створення події
router.post('/createEvent', EventController.createEvent);

// Отримання всіх подій
router.get('/', EventController.getAllEvents);

// Отримання однієї події
router.get('/:id', EventController.getEventById);


// Видалення події
router.delete('/:id', EventController.deleteEvent);


router.put('/:id', upload.array('images', 5), EventController.updateEvent);

module.exports = router;
