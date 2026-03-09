const express = require('express');
const router = express.Router();
const { getNearbyCabs } = require('../controllers/cabController');
const { protect } = require('../middleware/authMiddleware');

router.get('/nearby', protect, getNearbyCabs);

module.exports = router;