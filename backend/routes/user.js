// Import mongoose
const mongoose = require('mongoose');
// Import express
const express = require('express');
// Creation of the router
const router = express.Router();
// Route to the controller's user
const userController = require('../controllers/user');
// Router that create a new user's account and that login this user to his account
router.post('/auth/signup', userController.signup);
router.post('/auth/login', userController.login);

module.exports = router;
