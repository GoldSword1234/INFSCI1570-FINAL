const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).render('error', { title: 'Forbidden', message: 'Access denied.' });
  }
  next();
};

module.exports = { requireLogin, requireAdmin };
