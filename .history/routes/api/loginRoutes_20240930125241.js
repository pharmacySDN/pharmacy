const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController'); // Make sure to point to the correct login controller file

// Show login form
router.get('/login', loginController.showLoginForm);

// Handle login form submission
router.post('/login', loginController.login);

// Handle logout
router.get('/logout', loginController.logout);

module.exports = router;