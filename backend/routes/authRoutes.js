const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/users', protect, getAllUsers);
router.delete('/account', protect, deleteAccount);

module.exports = router;
