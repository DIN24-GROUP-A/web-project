const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = decoded;  // This is passed to all views
    next();
  } catch (err) {
    console.log('JWT error:', err);
    return res.redirect('/login');
  }
};
