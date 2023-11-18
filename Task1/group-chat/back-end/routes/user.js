const router = require('express').Router();

const userController = require('../controllers/user');

router.post('/signup', userController.addUser);

router.post('/login', userController.letUser);

module.exports = router;