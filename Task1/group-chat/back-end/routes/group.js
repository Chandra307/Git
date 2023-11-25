const router = require('express').Router();

const { authenticate } = require('../middleware/authenticate');
const groupController = require('../controllers/group');

router.post('/participants', authenticate, groupController.knowParticipants);
router.get('/chats', authenticate, groupController.getChats);
router.post('/newMsg', authenticate, groupController.sendMsg);

module.exports = router;