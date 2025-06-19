const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;  // <-- беремо токен з cookie

    if (!token) {
      return res.status(401).json({ message: 'Токен відсутній' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Неавторизований доступ' });
    }

    next();
  } catch (error) {
    console.error(error);
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