const express = require('express');
const router = express.Router();
const { chatWithBot, saveGuestSession } = require('../controllers/chatbotController');

// POST /api/chatbot/ask
router.post('/ask', chatWithBot);
router.post('/save-guest', saveGuestSession);

module.exports = router;