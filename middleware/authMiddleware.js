const jwt = require('jsonwebtoken');

// Middleware to check if the user is logged in
exports.isLoggedIn = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = decoded;  // Store decoded user data in res.locals for access in views
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    console.log('JWT error:', err);
    return res.redirect('/login');
  }
};

// Middleware to redirect if the user is already logged in
exports.redirectIfLoggedIn = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) return next();  // No token, continue

  try {
    // If token is valid, redirect to dashboard
    jwt.verify(token, process.env.JWT_SECRET);
    return res.redirect('/dashboard');
  } catch (err) {
    return next();  // Token is invalid, continue
  }
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
  if (res.locals.user && res.locals.user.is_admin) {
    return next();  // Proceed if the user is an admin
  }
  return res.status(403).send('Forbidden: Admins only');  // Return a 403 error if the user is not an admin
};