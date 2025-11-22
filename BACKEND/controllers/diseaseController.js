// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const fs = require("fs");

// // API Key environment variable se lo
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// exports.detectDiseaseGuest = async (req, res) => {
//   try {
//     // 1. Check Min 3 Photos
//     if (!req.files || req.files.length < 3) {
//       return res.status(400).json({ error: "Kam se kam 3 photos upload karna zaroori hai accurate result ke liye." });
//     }

//     // 2. Prepare Images for Gemini
//     const imageParts = req.files.map(file => ({
//       inlineData: {
//         data: Buffer.from(fs.readFileSync(file.path)).toString("base64"),
//         mimeType: file.mimetype,
//       },
//     }));

//     // 3. AI Prompt
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//     const prompt = `
//       Act as an expert Agricultural Scientist. I am providing 3 images of a plant/crop.
//       Analyze strictly and return a JSON response (No markdown) with these fields:
//       {
//         "diseaseName": "Name of disease (Hindi Name in brackets)",
//         "confidence": "e.g. 95%",
//         "isPlant": boolean,
//         "symptoms": "Explain symptoms in Hinglish (Hindi+English)",
//         "solution": "Step-by-step cure in Hinglish",
//         "medicine": "Name of chemical or organic medicines"
//       }
//       If images are not of a plant, set "isPlant" to false.
//     `;

//     const result = await model.generateContent([prompt, ...imageParts]);
//     const response = await result.response;
//     const text = response.text().replace(/```json|```/g, '').trim(); // Clean JSON
    
//     // 4. Cleanup Uploaded Files (Server storage free karne ke liye)
//     req.files.forEach(file => fs.unlinkSync(file.path));

//     res.json(JSON.parse(text));

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Scan failed. Please try again." });
//   }
// };








const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
// 1. History Model Import karein (Path check kar lena)
const DiseaseHistory = require('../models/DiseaseHistory');

// API Key Config
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- FUNCTION 1: AI Disease Detection (Guest & User) ---
exports.detectDiseaseGuest = async (req, res) => {
  try {
    // A. Check Min 3 Photos
    if (!req.files || req.files.length < 3) {
      return res.status(400).json({ error: "Kam se kam 3 photos upload karna zaroori hai accurate result ke liye." });
    }

    // B. Prepare Images for Gemini
    const imageParts = req.files.map(file => ({
      inlineData: {
        data: Buffer.from(fs.readFileSync(file.path)).toString("base64"),
        mimeType: file.mimetype,
      },
    }));

    // C. AI Prompt
    // Note: Agar 'gemini-2.0-flash' error de, toh 'gemini-1.5-flash-001' use karein
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
      Act as an expert Agricultural Scientist. I am providing 3 images of a plant/crop.
      Analyze strictly and return a JSON response (No markdown) with these fields:
      {
        "diseaseName": "Name of disease (Hindi Name in brackets)",
        "confidence": "e.g. 95%",
        "isPlant": boolean,
        "symptoms": "Explain symptoms in Hinglish (Hindi+English)",
        "solution": "Step-by-step cure in Hinglish",
        "medicine": "Name of chemical or organic medicines"
      }
      If images are not of a plant, set "isPlant" to false.
    `;

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    
    // JSON Cleaning (Thoda aur robust banaya hai)
    let text = response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim(); 
    
    // D. Cleanup Uploaded Files (Server storage free karne ke liye)
    req.files.forEach(file => {
        try { fs.unlinkSync(file.path); } catch (e) { console.error("File delete error:", e); }
    });

    res.json(JSON.parse(text));

  } catch (error) {
    console.error("AI Scan Error:", error);
    res.status(500).json({ error: "Scan failed. Please try again." });
  }
};

// --- FUNCTION 2: Save Report (Logged In User Only) ---
exports.saveScanResult = async (req, res) => {
  try {
    const { diseaseName, confidence, symptoms, solution, medicine } = req.body;

    // Validation
    if (!diseaseName || !solution) {
      return res.status(400).json({ error: "Incomplete data. Cannot save." });
    }

    // req.user.id middleware se aayega (verifyToken)
    const newRecord = new DiseaseHistory({
      user: req.user.id, 
      diseaseName,
      confidence,
      symptoms,
      solution,
      medicine
    });

    await newRecord.save();
    res.status(201).json({ message: "Report Farmbook mein save ho gayi!", record: newRecord });

  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ error: "Failed to save history." });
  }
};

// --- FUNCTION 3: Get User History (Logged In User Only) ---
exports.getScanHistory = async (req, res) => {
  try {
    // User ki history find karein aur nayi pehle dikhayein (sort -1)
    const history = await DiseaseHistory.find({ user: req.user.id })
      .sort({ scannedAt: -1 }); 

    res.json(history);

  } catch (error) {
    console.error("Fetch History Error:", error);
    res.status(500).json({ error: "History load nahi ho payi." });
  }
};