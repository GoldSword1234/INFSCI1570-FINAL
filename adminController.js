const User = require('../models/User');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const Plan = require('../models/Plan');

// GET /admin
exports.dashboard = async (req, res, next) => {
  try {
    const [userCount, workoutCount, exerciseCount, planCount] = await Promise.all([
      User.countDocuments(),
      Workout.countDocuments(),
      Exercise.countDocuments(),
      Plan.countDocuments()
    ]);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10);
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      stats: { userCount, workoutCount, exerciseCount, planCount },
      recentUsers
    });
  } catch (err) { next(err); }
};

// GET /admin/users
exports.users = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('admin/users', { title: 'Manage Users', users });
  } catch (err) { next(err); }
};

// DELETE /admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin/users');
  } catch (err) { next(err); }
};

// GET /admin/exercises
exports.exercises = async (req, res, next) => {
  try {
    const exercises = await Exercise.find().sort({ group: 1, name: 1 });
    res.render('admin/exercises', { title: 'Manage Exercises', exercises });
  } catch (err) { next(err); }
};
