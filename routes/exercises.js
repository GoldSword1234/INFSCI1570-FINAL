const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const { requireLogin } = require('../middleware/authMiddleware');

router.use(requireLogin);

// GET /exercises — list all
router.get('/', async (req, res, next) => {
  try {
    const exercises = await Exercise.find().sort({ group: 1, name: 1 });
    res.render('exercises/index', { title: 'Exercise Library', exercises });
  } catch (err) { next(err); }
});

module.exports = router;
