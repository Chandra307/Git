const express = require('express');

const route = express();

const controller = require('../controllers/password');

route.post('/forgotpassword', controller.forgot);

route.get('/resetpassword/:id', controller.resetPassword);

route.get('/updatepassword', controller.updatePassword);

module.exports = route;