const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');

router.get('/', async (req, res, next) => {
  try {
    const exercises = await Exercise.find().sort({ group: 1, name: 1 }).lean();
    const builderExercises = exercises.map(ex => ({
      id: ex._id.toString(),
      name: ex.name,
      group: ex.group,
      type: ex.type,
      difficulty: ex.difficulty,
      muscles: ex.muscles,
      setsMin: ex.setsMin,
      setsMax: ex.setsMax,
      repsMin: ex.repsMin,
      repsMax: ex.repsMax,
      rir: ex.rir,
      mev: ex.mev,
      mrv: ex.mrv,
      isCompound: ex.isCompound,
      note: ex.note || ''
    }));

    res.render('home', { title: 'FitTrack', exercises: builderExercises });
  } catch (err) {
    next(err);
  }
});

router.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.render('dashboard', { title: 'Dashboard', user: req.session.user });
});

module.exports = router;
