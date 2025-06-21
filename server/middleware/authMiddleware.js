const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  try {
    // 1) з cookie
    let token = req.cookies?.token;

    // 2) або з Authorization: Bearer <token>
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Токен відсутній' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Неавторизований доступ' });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Неавторизований доступ' });
  }
};

const authorizeRoles = (...allowed) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Неавторизований доступ' });
    }

    // roles у твоїй схемі – масив рядків
    const userRoles = req.user.roles || [];

    const hasRole = userRoles.some(r => allowed.includes(r));
    if (!hasRole) {
      return res.status(403).json({ message: 'Недостатньо прав' });
    }

    next();
  };
};

module.exports = { protect, authorizeRoles };