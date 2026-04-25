const express = require('express');
const router = express.Router();
const { sendToUser } = require('../controllers/notificationController');

// استخدام الكنترولر الموحد والمحمي بـ Zod
router.post('/send', sendToUser);

module.exports = router;