const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const { buildMongoUri } = require('./db');
const { ensureBootstrapData } = require('./services/bootstrapData');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'fittrack-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: buildMongoUri(),
    ttl: 24 * 60 * 60
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax'
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/workouts', require('./routes/workouts'));
app.use('/plans', require('./routes/plans'));
app.use('/exercises', require('./routes/exercises'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api/index'));

app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { title: 'Server Error', message: err.message });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await mongoose.connect(buildMongoUri());
    console.log('MongoDB connected');

    await ensureBootstrapData();
    console.log('Starter data checked');

    app.listen(PORT, () => console.log(`FitTrack running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('MongoDB startup error:', err);
    process.exit(1);
  }
}

startServer();
