const express = require('express');
const router = express.Router();
const { chatWithBot } = require('../controllers/chatbotController');

// POST /api/chatbot/ask
router.post('/ask', chatWithBot);

module.exports = router;