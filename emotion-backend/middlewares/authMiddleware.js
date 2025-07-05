const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
console.log('Auth header:', req.headers.authorization);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token payload:', decoded); // ✅ أضف هذا السطر للتحقق من المحتوى

    req.user = { id: decoded.userId }; // ✅ استخدم id فقط
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticate;
