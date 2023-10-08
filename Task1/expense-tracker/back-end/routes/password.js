const express = require('express');

const route = express();

const controller = require('../controllers/password');

route.post('/forgotpassword', controller.forgot);

module.exports = route;