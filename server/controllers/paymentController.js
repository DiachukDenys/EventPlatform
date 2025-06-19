// controllers/paymentController.js
const Event = require('../models/Event');
const User  = require('../models/User');



exports.getMyDonations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path:   'donations.event',
        select: 'title organizer images',   
        populate: { path: 'organizer', select: 'name' },
      });

    res.json(user.donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};


exports.donate = async (req, res) => {
  try {
    const { amount } = req.body;           // очікуємо { amount: 100 }
    const { id } = req.params;             // id події
    const userId = req.user._id;           // взяли з protect middleware

    if (!amount || amount <= 0)
      return res.status(400).json({ message: 'Некоректна сума' });

    // 1️⃣ шукаємо подію
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Подія не знайдена' });

    // 2️⃣ оновлюємо суму
    event.collectedAmount += Number(amount);
    await event.save();

    // 3️⃣ зберігаємо донат у користувача
    await User.findByIdAndUpdate(
      userId,
      { $push: { donations: { event: id, amount } } },
      { new: true }
    );

    res.json({
      message: 'Оплата успішна',
      raisedAmount: event.raisedAmount,
      targetAmount: event.targetAmount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};
