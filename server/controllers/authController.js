const User = require('../models/User');
const path = require('path');
const jwt = require('jsonwebtoken');


const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};


exports.uploadUserPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Фото не завантажено' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    // Зберігаємо ім'я файлу в базу
    user.photo = req.file.filename;
    await user.save();

    res.json({
      message: 'Фото оновлено',
      photo: user.photo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    // Оновлюємо поля, які прийшли в req.body (наприклад: name, phone, bio і т.д.)
    // Захищаємо від оновлення email та пароля через цей метод (окрім окремого роуту)
    const updatableFields = ['name', 'phone', 'bio'];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Якщо є роль зі специфічними даними, можна їх оновити теж, наприклад volunteerInfo.bio
    if (user.role === 'Волонтер' && req.body.volunteerInfo?.bio !== undefined) {
      user.volunteerInfo.bio = req.body.volunteerInfo.bio;
    }

    // Зберігаємо оновленого користувача
    await user.save();

    res.json({
      message: 'Профіль оновлено',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        photo: user.photo,
        volunteerInfo: user.volunteerInfo,
        investorInfo: user.investorInfo,
        organizerInfo: user.organizerInfo,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

   res.json({
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    roles: user.roles,
    phone: user.phone || null,
    photo: user.photo || null,
    volunteerInfo: user.volunteerInfo,
    investorInfo: user.investorInfo,
    organizerInfo: user.organizerInfo,
  }
});
  } catch (error) {
    console.error('❌ Помилка у getMe:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

exports.register = async (req, res) => {
  console.log('👉 [POST /register] Тіло запиту:', req.body);
  console.log('👉 req.file:', req.file);

  const { name, email, password, roles, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });
    console.log('🔍 Перевірка існуючого користувача:', !!userExists);
    if (userExists) {
      console.log('⚠️ Користувач з такою поштою вже існує');
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, roles, phone });
    console.log('✅ Користувача створено:', user._id);

    const token = generateToken(user);
    console.log('🔐 JWT створено:', token);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          photo: user.photo || null,
          phone: user.phone || null,
        },
      });
  } catch (err) {
    console.error('❌ Помилка при реєстрації:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = generateToken(user);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
    user: {
    id: user._id,
    name: user.name,
    email: user.email,
    roles: user.roles,
    phone: user.phone || null,
    photo: user.photo || null,
    volunteerInfo: user.volunteerInfo,
    investorInfo: user.investorInfo,
    organizerInfo: user.organizerInfo,
  }
});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.logout = (req, res) => {
  res
    .cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    })
    .json({ message: 'Вихід виконано' });
};
