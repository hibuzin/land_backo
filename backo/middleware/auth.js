const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Login required' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    // Only attach user ID
    req.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
