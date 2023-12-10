const router = require('express').Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, 'back-end/Images')
        },
        filename: (req, files, cb) => {
            console.log(files, 'once see the file');
            // req.file = file;
            cb(null, Date.now() + path.extname(files.originalname))
        }
    }
);
const upload = multer({ storage });
const { authenticate } = require('../middleware/authenticate');
const groupController = require('../controllers/group');

router.post('/participants', authenticate, groupController.knowParticipants);
router.get('/chats', authenticate, groupController.getChats);
router.post('/newMsg', upload.array("files"), authenticate, groupController.sendMsg);
router.post('/addParticipants', authenticate, groupController.addParticipants);
router.put('/addAdmin/:id', authenticate, groupController.addAdmin);
router.delete('/removeParticipant/:id', authenticate, groupController.removeParticipant);

module.exports = router;