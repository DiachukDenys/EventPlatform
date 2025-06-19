const VolunteerApplication = require('../models/VolunteerApplication');
const VolunteerReview = require('../models/VolunteerReview');
const User = require('../models/User');
const Event = require('../models/Event');

// Подати заявку волонтером
exports.createApplication = async (req, res) => {
  try {
    const { eventId, message } = req.body;
    const volunteerId = req.user._id;

    if (!eventId || !message) {
      return res.status(400).json({ message: 'eventId та message обовʼязкові' });
    }

    // Перевірити чи вже є подана заявка на цю подію
    const existing = await VolunteerApplication.findOne({ event: eventId, volunteer: volunteerId });
    if (existing) {
      return res.status(400).json({ message: 'Заявка вже подана' });
    }

    const application = new VolunteerApplication({
      event: eventId,
      volunteer: volunteerId,
      message,
    });
    await application.save();

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};
exports.getAllMyApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Отримуємо події, які створив цей організатор
    const myEvents = await Event.find({ organizer: userId }).select('_id title');

    const eventIds = myEvents.map(e => e._id);

    // 2. Отримуємо заявки на ці події
    const applications = await VolunteerApplication.find({ event: { $in: eventIds } })
      .populate('volunteer', 'name email phone photo')
      .populate('event', 'title dateStart');

    res.json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при завантаженні заявок' });
  }
};
// Список заявок організатору для події
exports.getApplications = async (req, res) => {
  try {
    const { event } = req.query;
    const userId = req.user._id;

    if (!event) {
      return res.status(400).json({ message: 'Потрібен ID події' });
    }

    // Перевірити, що організатор має право бачити заявки (володіє подією)
    const eventDoc = await Event.findById(event);
    if (!eventDoc) return res.status(404).json({ message: 'Подія не знайдена' });
    if (eventDoc.organizer.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Немає доступу' });
    }

    const applications = await VolunteerApplication.find({ event })
      .populate('volunteer', 'name email phone photo')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

// Прийняти / Відхилити заявку
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' | 'rejected'
    const userId = req.user._id;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Невірний статус' });
    }

    const application = await VolunteerApplication.findById(id);
    if (!application) return res.status(404).json({ message: 'Заявка не знайдена' });

    const eventDoc = await Event.findById(application.event);
    if (!eventDoc) return res.status(404).json({ message: 'Подія не знайдена' });

    // Перевірка прав організатора
    if (eventDoc.organizer.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Немає доступу' });
    }

    application.status = status;
    await application.save();

    if (status === 'accepted') {
      // Додати волонтера в масив volunteers події, якщо його там ще нема
      if (!eventDoc.volunteers.includes(application.volunteer)) {
        eventDoc.volunteers.push(application.volunteer);
        await eventDoc.save();
      }
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

// Отримати відгуки про волонтера (публічно)
exports.getReviews = async (req, res) => {
  try {
    const { volunteer } = req.query;
    if (!volunteer) {
      return res.status(400).json({ message: 'Потрібен ID волонтера' });
    }
    const reviews = await VolunteerReview.find({ volunteer })
      .populate('author', 'name photo')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

// Залишити відгук про волонтера (авторизований користувач)
exports.createReview = async (req, res) => {
  try {
    const { volunteerId, text, rating } = req.body;
    const authorId = req.user._id;

    if (!volunteerId || !text || !rating) {
      return res.status(400).json({ message: 'volunteerId, text та rating обовʼязкові' });
    }

    if (volunteerId.toString() === authorId.toString()) {
      return res.status(400).json({ message: 'Ви не можете залишити відгук самому про себе' });
    }

    // Створити новий відгук
    const review = new VolunteerReview({
      volunteer: volunteerId,
      author: authorId,
      text,
      rating,
    });
    await review.save();

    // Оновити avgRating у User
    const agg = await VolunteerReview.aggregate([
      { $match: { volunteer: review.volunteer } },
      { $group: { _id: '$volunteer', avgRating: { $avg: '$rating' } } }
    ]);

    if (agg.length > 0) {
      await User.findByIdAndUpdate(review.volunteer, { avgRating: agg[0].avgRating });
    }

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};
