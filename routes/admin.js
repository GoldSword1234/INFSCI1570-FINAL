const express = require('express');
const router = express.Router();
const ac = require('../controllers/adminController');
const { requireLogin, requireAdmin } = require('../middleware/authMiddleware');

router.use(requireLogin, requireAdmin);
router.get('/', ac.dashboard);
router.get('/users', ac.users);
router.post('/users/:id/delete', ac.deleteUser);
router.get('/exercises', ac.exercises);

module.exports = router;
