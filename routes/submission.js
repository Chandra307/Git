const router = require('express').Router();

const controller = require('../controllers/submission');

router.post('/', controller.postSubmission);

router.get('/', controller.getSubmissions);

module.exports = router;