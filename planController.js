const Plan = require('../models/Plan');
const Exercise = require('../models/Exercise');

// GET /plans
exports.index = async (req, res, next) => {
  try {
    const plans = await Plan.find({ user: req.session.user._id }).sort({ createdAt: -1 });
    res.render('plans/index', { title: 'My Plans', plans });
  } catch (err) { next(err); }
};

// GET /plans/new
exports.getNew = async (req, res, next) => {
  try {
    const exercises = await Exercise.find().sort({ group: 1, name: 1 });
    res.render('plans/new', { title: 'Create Plan', exercises });
  } catch (err) { next(err); }
};

// POST /plans
exports.create = async (req, res, next) => {
  try {
    const { name, goal, level, daysPerWeek, notes } = req.body;
    if (!name) return res.redirect('/plans/new');
    const plan = new Plan({
      user: req.session.user._id,
      name, goal, level,
      daysPerWeek: parseInt(daysPerWeek) || 3,
      notes
    });
    await plan.save();
    res.redirect('/plans');
  } catch (err) { next(err); }
};

// GET /plans/:id
exports.show = async (req, res, next) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, user: req.session.user._id })
      .populate('days.exercises.exercise');
    if (!plan) return res.status(404).render('404', { title: 'Not Found' });
    res.render('plans/show', { title: plan.name, plan });
  } catch (err) { next(err); }
};

// DELETE /plans/:id
exports.delete = async (req, res, next) => {
  try {
    await Plan.findOneAndDelete({ _id: req.params.id, user: req.session.user._id });
    res.redirect('/plans');
  } catch (err) { next(err); }
};
