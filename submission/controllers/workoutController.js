const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

// GET /workouts
exports.index = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.session.user._id })
      .populate('exercises.exercise')
      .sort({ date: -1 });
    res.render('workouts/index', { title: 'My Workouts', workouts });
  } catch (err) {
    next(err);
  }
};

// GET /workouts/new
exports.getNew = async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ group: 1, name: 1 });
    res.render('workouts/new', { title: 'Log Workout', exercises });
  } catch (err) {
    next(err);
  }
};

// POST /workouts
exports.create = async (req, res) => {
  try {
    const { name, goal, duration, notes, exercises } = req.body;
    if (!name) return res.redirect('/workouts/new');

    const exArray = Array.isArray(exercises) ? exercises : [exercises].filter(Boolean);
    const workout = new Workout({
      user: req.session.user._id,
      name, goal, duration: parseInt(duration) || 0, notes,
      exercises: exArray.map(e => ({
        exercise: e.id,
        sets: parseInt(e.sets) || 3,
        reps: parseInt(e.reps) || 10,
        weightLbs: parseFloat(e.weight) || 0,
        notes: e.notes || ''
      }))
    });
    await workout.save();
    res.redirect('/workouts');
  } catch (err) {
    next(err);
  }
};

// GET /workouts/:id
exports.show = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.session.user._id })
      .populate('exercises.exercise');
    if (!workout) return res.status(404).render('404', { title: 'Not Found' });
    res.render('workouts/show', { title: workout.name, workout });
  } catch (err) {
    next(err);
  }
};

// GET /workouts/:id/edit
exports.getEdit = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.session.user._id })
      .populate('exercises.exercise');
    if (!workout) return res.status(404).render('404', { title: 'Not Found' });
    const exercises = await Exercise.find().sort({ group: 1, name: 1 });
    res.render('workouts/edit', { title: 'Edit Workout', workout, exercises });
  } catch (err) {
    next(err);
  }
};

// PUT /workouts/:id
exports.update = async (req, res, next) => {
  try {
    const { name, goal, duration, notes } = req.body;
    await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user._id },
      { name, goal, duration: parseInt(duration) || 0, notes },
      { runValidators: true }
    );
    res.redirect(`/workouts/${req.params.id}`);
  } catch (err) {
    next(err);
  }
};

// DELETE /workouts/:id
exports.delete = async (req, res, next) => {
  try {
    await Workout.findOneAndDelete({ _id: req.params.id, user: req.session.user._id });
    res.redirect('/workouts');
  } catch (err) {
    next(err);
  }
};
