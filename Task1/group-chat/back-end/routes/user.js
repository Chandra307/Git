const router = require('express').Router();

const userController = require('../controllers/user');

router.post('/signup', userController.postUser);

module.exports = router;