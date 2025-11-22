require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("Testing model...");
    const result = await model.generateContent("Hello AI");
    console.log("Success! Model is working:", result.response.text());
  } catch (error) {
    console.log("Error details:", error.message);
  }
}

listModels();