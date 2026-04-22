const express = require('express');
const router = express.Router();
const Exercise = require('../../models/Exercise');
const Workout = require('../../models/Workout');
const Plan = require('../../models/Plan');
const { requireApiKey } = require('../../middleware/apiKeyMiddleware');

// All API routes require API key header: x-api-key
router.use(requireApiKey);

function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

function notFound(res, resource) {
  return res.status(404).json({ success: false, error: `${resource} not found` });
}

function badObjectId(res, resource) {
  return res.status(400).json({ success: false, error: `Invalid ${resource} id` });
}

function handleServerError(res, err) {
  return res.status(500).json({ success: false, error: err.message });
}

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      resources: {
        exercises: '/api/exercises',
        workouts: '/api/workouts',
        plans: '/api/plans'
      }
    }
  });
});

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
  if (!isValidObjectId(req.params.id)) {
    return badObjectId(res, 'exercise');
  }

  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return notFound(res, 'Exercise');
    res.json({ success: true, data: exercise });
  } catch (err) {
    handleServerError(res, err);
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
  if (!isValidObjectId(req.params.id)) {
    return badObjectId(res, 'exercise');
  }

  try {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exercise) return notFound(res, 'Exercise');
    res.json({ success: true, data: exercise });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/exercises/:id
router.delete('/exercises/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return badObjectId(res, 'exercise');
  }

  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) return notFound(res, 'Exercise');
    res.json({ success: true, message: 'Exercise deleted' });
  } catch (err) {
    handleServerError(res, err);
  }
});

// ─── WORKOUTS ─────────────────────────────────────────────────────────────────

// GET /api/workouts
router.get('/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).populate('exercises.exercise').sort({ date: -1 });
    res.json({ success: true, count: workouts.length, data: workouts });
  } catch (err) {
    handleServerError(res, err);
  }
});

// GET /api/workouts/:id
router.get('/workouts/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return badObjectId(res, 'workout');
  }

  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id }).populate('exercises.exercise');
    if (!workout) return notFound(res, 'Workout');
    res.json({ success: true, data: workout });
  } catch (err) {
    handleServerError(res, err);
  }
});

// POST /api/workouts
router.post('/workouts', async (req, res) => {
  try {
    const workout = new Workout({ ...req.body, user: req.user._id });
    await workout.save();
    const populatedWorkout = await workout.populate('exercises.exercise');
    res.status(201).json({ success: true, data: populatedWorkout });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/workouts/:id
router.put('/workouts/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return badObjectId(res, 'workout');
  }

  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('exercises.exercise');

    if (!workout) return notFound(res, 'Workout');
    res.json({ success: true, data: workout });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/workouts/:id
router.delete('/workouts/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return badObjectId(res, 'workout');
  }

  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!workout) return notFound(res, 'Workout');
    res.json({ success: true, message: 'Workout deleted' });
  } catch (err) {
    handleServerError(res, err);
  }
});

// ─── PLANS ────────────────────────────────────────────────────────────────────

// GET /api/plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: plans.length, data: plans });
  } catch (err) {
    handleServerError(res, err);
  }
});

// GET /api/plans/:id
router.get('/plans/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return badObjectId(res, 'plan');
  }

  try {
    const plan = await Plan.findOne({ _id: req.params.id, user: req.user._id }).populate('days.exercises.exercise');
    if (!plan) return notFound(res, 'Plan');
    res.json({ success: true, data: plan });
  } catch (err) {
    handleServerError(res, err);
  }
});

// POST /api/plans
router.post('/plans', async (req, res) => {
  try {
    const plan = new Plan({ ...req.body, user: req.user._id });
    await plan.save();
    const populatedPlan = await plan.populate('days.exercises.exercise');
    res.status(201).json({ success: true, data: populatedPlan });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/plans/:id
router.put('/plans/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return badObjectId(res, 'plan');
  }

  try {
    const plan = await Plan.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('days.exercises.exercise');

    if (!plan) return notFound(res, 'Plan');
    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/plans/:id
router.delete('/plans/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return badObjectId(res, 'plan');
  }

  try {
    const plan = await Plan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!plan) return notFound(res, 'Plan');
    res.json({ success: true, message: 'Plan deleted' });
  } catch (err) {
    handleServerError(res, err);
  }
});

module.exports = router;
