const Event = require('../models/Event');
const fs = require('fs');
const path = require('path');
const VolunteerApplication = require('../models/VolunteerApplication');
// Створити подію
exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error('Помилка при створенні події:', err);
    res.status(400).json({ error: err.message });
  }
};


// Отримати всі події
exports.getAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 6, search = '', organizer } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (organizer) {
      query.organizer = organizer;
    }

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ startDate: 1 });

    res.json({
      events,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Помилка при отриманні подій:', error);
    res.status(500).json({ message: 'Серверна помилка при отриманні подій' });
  }
};

// Отримати подію за ID
exports.getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;

    /* 1. сама подія */
    const event = await Event
      .findById(eventId)
      .populate('organizer', 'name')   // залишаємо як було
      .lean();                         // .lean() ⇒ plain object

    if (!event) {
      return res.status(404).json({ message: 'Подія не знайдена' });
    }

    /* 2. прийняті (accepted) заявки на цю подію */
    const apps = await VolunteerApplication.find({
      event : eventId,
      status: 'accepted',
    })
      .populate('volunteer', 'name photo')   // тягнемо дані волонтера
      .lean();

    /* 3. додаємо у відповідь масив волонтерів */
    event.approvedVolunteers = apps.map(a => a.volunteer);

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

// Оновити подію
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Подія не знайдена' });

    /* 1. Масив, який залишив користувач (після можливого видалення картинок) */
    let imgs = event.images;  // стартуємо з того, що було

    if (req.body.existingImages) {
      imgs = JSON.parse(req.body.existingImages);     // залишені з фронту
    }

    /* 2. Додаємо нові файли, якщо вони є */
    if (req.files?.length) {
      const add = req.files.map(f => `uploads/${f.filename}`); // обовʼязково зі слешем!
      imgs = [...imgs, ...add];
    }

    /* 3. Оновлюємо поля */
    event.description = req.body.description ?? event.description;
    event.images      = imgs;

    await event.save();
    res.json(event);
  } catch (err) {
    console.error('updateEvent error:', err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};


// Видалити подію
exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Подія не знайдена' });
    res.json({ message: 'Подію видалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
