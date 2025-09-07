const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const farmer = await Farmer.findById(decoded.id).select('-password');
    
    if (!farmer) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    if (!farmer.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    req.farmer = farmer;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      req.farmer = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const farmer = await Farmer.findById(decoded.id).select('-password');
    
    if (farmer && farmer.isActive) {
      req.farmer = farmer;
    } else {
      req.farmer = null;
    }
    
    next();
  } catch (error) {
    req.farmer = null;
    next();
  }
};

module.exports = { auth, optionalAuth };
