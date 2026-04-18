const User = require('../models/User');

// GET /auth/signup
exports.getSignup = (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('auth/signup', { title: 'Sign Up', error: null });
};

// POST /auth/signup
exports.postSignup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password) {
      return res.render('auth/signup', { title: 'Sign Up', error: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
      return res.render('auth/signup', { title: 'Sign Up', error: 'Passwords do not match.' });
    }
    if (password.length < 6) {
      return res.render('auth/signup', { title: 'Sign Up', error: 'Password must be at least 6 characters.' });
    }
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.render('auth/signup', { title: 'Sign Up', error: 'Username or email already in use.' });
    }
    const user = new User({ username, email, passwordHash: password });
    user.generateApiKey();
    await user.save();
    req.session.user = { _id: user._id, username: user.username, role: user.role, apiKey: user.apiKey };
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('auth/signup', { title: 'Sign Up', error: 'Something went wrong. Try again.' });
  }
};

// GET /auth/login
exports.getLogin = (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('auth/login', { title: 'Login', error: null });
};

// POST /auth/login
exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.render('auth/login', { title: 'Login', error: 'All fields are required.' });
    }
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('auth/login', { title: 'Login', error: 'Invalid username or password.' });
    }
    req.session.user = { _id: user._id, username: user.username, role: user.role, apiKey: user.apiKey };
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('auth/login', { title: 'Login', error: 'Something went wrong. Try again.' });
  }
};

// GET /auth/logout
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
