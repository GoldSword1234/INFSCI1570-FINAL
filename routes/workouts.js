// routes/workouts.js
const express = require('express');
const router = express.Router();
const wc = require('../controllers/workoutController');
const { requireLogin } = require('../middleware/authMiddleware');

router.use(requireLogin);
router.get('/', wc.index);
router.get('/new', wc.getNew);
router.post('/', wc.create);
router.get('/:id', wc.show);
router.get('/:id/edit', wc.getEdit);
router.post('/:id/update', wc.update);
router.post('/:id/delete', wc.delete);

module.exports = router;
