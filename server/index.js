const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');
const statsRoutes = require('./routes/stats');
const eventRoutes = require('./routes/events');
const path = require('path');
const paymentRoutes = require('./routes/payments');
const volunteersRouter = require('./routes/volunteers');
const allowed = [
  'https://event-platform-nine-kappa.vercel.app',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);          // дозволити Postman / curl
      cb(null, allowed.includes(origin));
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.options('*', cors());

 // Завантаження змінних оточення
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
connectDB(); // Підключення до бази даних
app.use('/api/stats', statsRoutes);


app.use('/api/auth', authRoutes); // Підключення маршруту авторизації та реєстрації

app.get('/', (req, res) => {
  res.send('API працює 🚀');
});
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/volunteers', volunteersRouter);

const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log(`🚀 Сервер на порті ${PORT}`));
