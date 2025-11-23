const { GoogleGenerativeAI } = require("@google/generative-ai");
const { v4: uuidv4 } = require('uuid');

// API Key Config
const ChatbotSession = require('../models/ChatbotSession');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
exports.saveGuestSession = async (req, res) => {
    try {
        const { messages, sessionId, userId } = req.body; // userId will be null for guests
        
        if (messages.length < 2) {
            return res.status(400).json({ message: "Session too short to save." });
        }
        
        // Find if an existing session exists for this ID
        const existingSession = await ChatbotSession.findOne({ sessionId: sessionId });

        if (existingSession) {
            // Update existing session
            existingSession.messages = messages;
            await existingSession.save();
        } else {
            // Create new session
            const newSession = new ChatbotSession({
                user: userId || null, // Will be null for guests
                sessionId: sessionId || uuidv4(), // Use provided ID or generate new one
                messages: messages,
            });
            await newSession.save();
        }

        res.status(201).json({ 
            message: "Session data updated successfully.", 
            sessionId: sessionId 
        });

    } catch (error) {
        console.error("Error saving guest session:", error);
        res.status(500).json({ message: "Failed to save session.", error: error.message });
    }
};


exports.chatWithBot = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // --- FIX START: History Validation ---
    // Gemini requires history to start with 'user'.
    // Agar frontend se pehla message 'model' (Welcome msg) aaya hai, toh use hata do.
    let validHistory = history || [];
    
    if (validHistory.length > 0 && validHistory[0].role === 'model') {
      validHistory.shift(); // Pehla element remove karo
    }
    // --- FIX END ---

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Chat Session Start
    const chat = model.startChat({
      history: validHistory, // Corrected history use karein
      generationConfig: { maxOutputTokens: 500 },
    });

    const prompt = `
      You are 'Farmio Chatbot', an expert AI Agriculture Consultant.
      Your goal is to help Indian farmers with crops, diseases, weather, and market prices.
      Reply in Hinglish (Hindi + English mix) or English based on the user's language.
      Keep answers short, practical, and friendly.
      
      User Query: ${message}
    `;

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "AI abhi busy hai, thodi der baad try karein." });
  }
};