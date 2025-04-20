const jwt = require('jsonwebtoken');

// ✅ Set res.locals.user globally (used in all views)
exports.attachUser = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded;
    } catch (err) {
      console.log('Invalid token:', err);
    }
  }

  next(); // Always move forward
};

// ✅ Middleware to protect routes
exports.isLoggedIn = (req, res, next) => {
  if (res.locals.user) return next();
  return res.redirect('/login');
};

// ✅ Redirect already-logged-in users
exports.redirectIfLoggedIn = (req, res, next) => {
  if (res.locals.user) return res.redirect('/dashboard');
  return next();
};

// ✅ Admin check
exports.isAdmin = (req, res, next) => {
  if (res.locals.user && res.locals.user.is_admin) {
    return next();
  }
  return res.status(403).send('Forbidden: Admins only');
};
