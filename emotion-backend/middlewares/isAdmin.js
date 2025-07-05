const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {  // camelCase متطابق مع authenticate.js
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = isAdmin;



