const express = require('express');
const router = express.Router();
const volunteersController = require('../controllers/volunteersController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // приклад middleware авторизації

// Волонтер подає заявку (треба бути залогіненим і мати роль 'Волонтер')
router.post('/applications', protect, authorizeRoles('Волонтер'), volunteersController.createApplication);

// Організатор дивиться заявки на подію (ролі перевіряються в контролері)
router.get('/applications', protect, volunteersController.getApplications);

router.get(
  '/applications/all',
  protect,
  authorizeRoles('Організатор'),
  volunteersController.getAllMyApplications
);

// Організатор приймає/відхиляє заявку
router.patch('/applications/:id', protect, authorizeRoles('Організатор'), volunteersController.updateApplicationStatus);

// Публічний перегляд відгуків про волонтера
router.get('/reviews', volunteersController.getReviews);

// Залишити відгук (залогінені користувачі)
router.post('/reviews', protect, volunteersController.createReview);

module.exports = router;
