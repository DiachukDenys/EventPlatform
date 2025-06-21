const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const cookieParser = require('cookie-parser');

// Імпорти роутів
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/stats');
const eventRoutes = require('./routes/events');
const paymentRoutes = require('./routes/payments');
const volunteersRouter = require('./routes/volunteers');
const usersRouter = require('./routes/users');

// 🔐 Налаштування CORS для клієнта
const CLIENT_URL = 'https://event-platform-nine-kappa.vercel.app';

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 🔧 Обробка preflight‑запитів
app.options('*', cors({
  origin: CLIENT_URL,
  credentials: true
}));

// 🌐 Middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔗 Підключення до БД
connectDB();

// 🔌 Роути
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', usersRouter);
app.use('/api/volunteers', volunteersRouter);

// 🔸 Головна
app.get('/', (req, res) => {
  res.send('API працює 🚀');
});

// ▶️ Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер на порті ${PORT}`));
