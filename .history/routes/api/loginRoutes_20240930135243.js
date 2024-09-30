const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/loginController');
const { isAuthenticated } = require('../../middleware/auth');

// Login routes
router.get('/login', (req, res) => {
  res.render('users/login', { error: null });
});

router.post('/login', loginController.login);
router.get('/logout', loginController.logout);

// Export the router
module.exports = router;
