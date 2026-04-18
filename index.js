const express = require('express');
const router = express.Router();
const Exercise = require('../../models/Exercise');
const Workout = require('../../models/Workout');
const Plan = require('../../models/Plan');
const { requireApiKey } = require('../../middleware/apiKeyMiddleware');

// All API routes require API key header: x-api-key
router.use(requireApiKey);

// ─── EXERCISES ────────────────────────────────────────────────────────────────

// GET /api/exercises
router.get('/exercises', async (req, res) => {
  try {
    const { group, type, difficulty } = req.query;
    const filter = {};
    if (group) filter.group = group;
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    const exercises = await Exercise.find(filter).sort({ group: 1, name: 1 });
    res.json({ success: true, count: exercises.length, data: exercises });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/exercises/:id
router.get('/exercises/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ success: false, error: 'Exercise not found' });
    res.json({ success: true, data: exercise });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/exercises
router.post('/exercises', async (req, res) => {
  try {
    const exercise = new Exercise(req.body);
    await exercise.save();
    res.status(201).json({ success: true, data: exercise });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/exercises/:id
router.put('/exercises/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exercise) return res.status(404).json({ success: false, error: 'Exercise not found' });
    res.json({ success: true, data: exercise });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/exercises/:id
router.delete('/exercises/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) return res.status(404).json({ success: false, error: 'Exercise not found' });
    res.json({ success: true, message: 'Exercise deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── WORKOUTS ─────────────────────────────────────────────────────────────────

// GET /api/workouts
router.get('/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.apiUser._id })
      .populate('exercises.exercise')
      .sort({ date: -1 });
    res.json({ success: true, count: workouts.length, data: workouts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/workouts/:id
router.get('/workouts/:id', async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.apiUser._id })
      .populate('exercises.exercise');
    if (!workout) return res.status(404).json({ success: false, error: 'Workout not found' });
    res.json({ success: true, data: workout });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/workouts
router.post('/workouts', async (req, res) => {
  try {
    const workout = new Workout({ ...req.body, user: req.apiUser._id });
    await workout.save();
    res.status(201).json({ success: true, data: workout });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/workouts/:id
router.put('/workouts/:id', async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.apiUser._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!workout) return res.status(404).json({ success: false, error: 'Workout not found' });
    res.json({ success: true, data: workout });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/workouts/:id
router.delete('/workouts/:id', async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.apiUser._id });
    if (!workout) return res.status(404).json({ success: false, error: 'Workout not found' });
    res.json({ success: true, message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── PLANS ────────────────────────────────────────────────────────────────────

// GET /api/plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.apiUser._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: plans.length, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/plans/:id
router.get('/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, user: req.apiUser._id });
    if (!plan) return res.status(404).json({ success: false, error: 'Plan not found' });
    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/plans
router.post('/plans', async (req, res) => {
  try {
    const plan = new Plan({ ...req.body, user: req.apiUser._id });
    await plan.save();
    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/plans/:id
router.put('/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findOneAndUpdate(
      { _id: req.params.id, user: req.apiUser._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ success: false, error: 'Plan not found' });
    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/plans/:id
router.delete('/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findOneAndDelete({ _id: req.params.id, user: req.apiUser._id });
    if (!plan) return res.status(404).json({ success: false, error: 'Plan not found' });
    res.json({ success: true, message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
