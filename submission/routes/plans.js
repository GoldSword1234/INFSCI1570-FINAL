const express = require('express');
const router = express.Router();
const pc = require('../controllers/planController');
const { requireLogin } = require('../middleware/authMiddleware');

router.use(requireLogin);
router.get('/', pc.index);
router.get('/new', pc.getNew);
router.post('/', pc.create);
router.post('/builder', pc.createFromBuilder);
router.get('/:id', pc.show);
router.post('/:id/delete', pc.delete);

module.exports = router;
