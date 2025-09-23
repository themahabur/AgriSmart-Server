const express = require('express');
const { loginUser } = require('../controller/loginController');
const { registerUser } = require('../controller/registerController');

const router = express.Router();

router.post('/register', registerUser); // registration
router.post('/login', loginUser); // login

module.exports = router;
