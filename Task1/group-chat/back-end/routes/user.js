const router = require('express').Router();

const middleware = require('../middleware/authenticate');
const userController = require('../controllers/user');

router.post('/signup', userController.addUser);

router.post('/login', userController.letUser);

router.post('/chat', middleware.authenticate, userController.saveChat);

router.get('/chats', userController.getChats);

module.exports = router;