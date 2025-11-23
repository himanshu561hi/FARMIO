// src/config.js

// Agar website Live hai (hostname localhost nahi hai), toh Live Backend use karo
// Agar local chala rahe ho, toh Localhost use karo.

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// Yahan apna RENDER/VERCEL ka BACKEND URL dalein (bina '/' last mein)
// Example: "https://farmio-backend.onrender.com"
const LIVE_BACKEND_URL = "https://farmio.onrender.com"; 

export const BACKEND_URL = isLocal ? "http://localhost:5001" : LIVE_BACKEND_URL;