// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import Webcam from "react-webcam";
// import { BACKEND_URL } from '../config';
// import Footer from '../pages/Footer'; // <--- FOOTER IMPORTED
// // Note: FormatResult component is defined inside this file's scope or should be imported if external. 
// // Assuming it's defined globally or in the same file as per your previous pattern.

// // --- NEW HELPER COMPONENT: For Beautiful Text Formatting ---
// const FormatResult = ({ text }) => {
//   if (!text) return null;

//   // Check if text contains numbered list patterns like "1." or "1)"
//   const hasNumbers = /\d+[\.\)]\s/.test(text);

//   if (hasNumbers) {
//     // Logic: Split text by numbers to create a bullet list
//     const points = text.split(/\d+[\.\)]\s/).filter((point) => point.trim() !== "");

//     return (
//       <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
//         {points.map((point, index) => {
//           // Highlight first 4 words of each point for better readability
//           const words = point.split(" ");
//           const firstFewWords = words.slice(0, 4).join(" ");
//           const restOfSentence = words.slice(4).join(" ");

//           return (
//             <li key={index} className="leading-relaxed">
//               <span className="font-bold text-green-800">{firstFewWords}</span>{" "}
//               {restOfSentence}
//             </li>
//           );
//         })}
//       </ul>
//     );
//   }

//   // Logic: Highlight specific keywords in paragraphs
//   const keywords = ["Remove", "Apply", "Avoid", "Spray", "Water", "Monitor", "Clean", "Use", "Destroy", "Immediately"];
  
//   return (
//     <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
//       {text.split(" ").map((word, i) => {
//         // Remove punctuation to check the word
//         const cleanWord = word.replace(/[^a-zA-Z]/g, '');
//         // Check if word starts with a Capital letter or is in our keyword list
//         const isKeyword = keywords.includes(cleanWord) || (cleanWord.length > 3 && /^[A-Z]/.test(cleanWord));
        
//         return isKeyword ? (
//           <span key={i} className="font-semibold text-green-800">{word} </span>
//         ) : (
//           <span key={i}>{word} </span>
//         );
//       })}
//     </p>
//   );
// };

// // --- MAIN COMPONENT ---
// const DiseaseScanner = () => {
//   // --- STATE MANAGEMENT ---
//   const [images, setImages] = useState([]);
//   const [previews, setPreviews] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
  
//   // Camera State
//   const [isCameraOpen, setIsCameraOpen] = useState(false);
//   const webcamRef = useRef(null);
//   const isCapturing = useRef(false);
//   const lastCaptureTime = useRef(0);
  
//   const navigate = useNavigate();

//   // --- CLEANUP (Memory Leak Prevention) ---
//   useEffect(() => {
//     return () => {
//       previews.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [previews]);

//   // --- HELPER: Base64 (Webcam) se File Object banana ---
//   const dataURLtoFile = (dataurl, filename) => {
//     let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
//         bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
//     while(n--){
//         u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new File([u8arr], filename, {type:mime});
//   }

//   // --- 1. GALLERY UPLOAD HANDLER ---
//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (images.length + files.length > 5) {
//       toast.warning("Max 5 photos allowed!");
//       return;
//     }
//     const newImages = [...images, ...files];
//     setImages(newImages);
//     setPreviews(newImages.map((file) => URL.createObjectURL(file)));
//   };

//   // --- 2. WEBCAM CAPTURE HANDLER (Continuous) ---
//  const capturePhoto = useCallback((e) => {
//     // 1. Default behavior roko (Double firing prevention)
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }

//     // 2. CHECK LOCK: Agar pehle se capture chal raha hai, to turant ruk jao
//     if (isCapturing.current) {
//       return; 
//     }

//     // 3. LOCK LAGA DO
//     isCapturing.current = true;

//     // 4. Photo Kheecho
//     const imageSrc = webcamRef.current.getScreenshot();
    
//     if (imageSrc) {
//       setImages((prevImages) => {
//         if (prevImages.length >= 5) {
//           toast.warning("Bas! Max 5 photos ho gayi.");
//           return prevImages; // State change mat karo
//         }

//         const file = dataURLtoFile(imageSrc, `camera_capture_${Date.now()}.jpg`);
        
//         // Preview update
//         const newPreviewURL = URL.createObjectURL(file);
//         setPreviews((prevPreviews) => [...prevPreviews, newPreviewURL]);
        
//         toast.success(`Photo ${prevImages.length + 1} Captured! 📸`);
        
//         return [...prevImages, file];
//       });
//     }

//     // 5. UNLOCK AFTER 1 SECOND (Lock kholo)
//     setTimeout(() => {
//       isCapturing.current = false;
//     }, 1000);

//   }, [webcamRef]);

//   // --- 3. REMOVE IMAGE ---
//   const removeImage = (index) => {
//     setImages(images.filter((_, i) => i !== index));
//     setPreviews(previews.filter((_, i) => i !== index));
//   };

//   // --- 4. API CALL (AI CHECK) ---
//   const handleScan = async () => {
//     if (images.length < 3) {
//       toast.error("Kam se kam 3 photos chahiye (Leaf, Stem, Whole Plant)");
//       return;
//     }

//     const formData = new FormData();
//     images.forEach((img) => formData.append('photos', img));

//     setLoading(true);
//     const toastId = toast.loading("Analyzing... Krishi Vaigyanik check kar rahe hain 🌿");

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/disease/guest-scan`, {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();
//       toast.dismiss(toastId);

//       if (res.status === 429) {
//         toast.error("Aaj ki limit khatam! Login karein.");
//       } else if (!res.ok) {
//         toast.error(data.error || "Kuch gadbad hui hai.");
//       } else {
//         setResult(data);
//         setIsCameraOpen(false); // Result aate hi camera band
//         toast.success("Report Taiyaar hai! ✅");
//       }
//     } catch (error) {
//       toast.dismiss(toastId);
//       console.error(error);
//       toast.error("Server connect nahi ho raha.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- 5. SAVE REPORT HANDLER ---
//   const handleSaveReport = async () => {
//     const token = localStorage.getItem('token');
    
//     if (!token) {
//       toast.info("Save karne ke liye Login zaroori hai.");
//       navigate('/login');
//       return;
//     }

//     const reportData = {
//       diseaseName: result.diseaseName,
//       confidence: result.confidence,
//       symptoms: result.symptoms,
//       solution: result.solution,
//       medicine: result.medicine
//     };

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/disease/save`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(reportData)
//       });

//       if (res.ok) {
//         toast.success("History mein save ho gaya! 💾");
//       } else {
//         toast.error("Save nahi ho paya.");
//       }
//     } catch (err) {
//       toast.error("Error saving report.");
//     }
//   };

//   const resetScanner = () => {
//     setImages([]);
//     setPreviews([]);
//     setResult(null);
//   };

//   const isLoggedIn = !!localStorage.getItem('token');

//   return (
//     // 1. Wrapper added to contain both content and footer correctly
//     <div className="flex flex-col min-h-screen"> 
      
//       {/* --- CONTENT SECTION (pt-24 for Navbar Clearance) --- */}
//       <div className="flex-grow py-10 min-h-screen px-4 pt-24 bg-gray-50">
//         <div className="max-w-3xl mx-auto mt-20 bg-white shadow-xl rounded-2xl overflow-hidden">
          
//           {/* Header */}
//           <div className="bg-green-700 p-6 text-center text-white">
//             <h2 className="text-3xl font-bold">🌱 AI Plant Doctor</h2>
//             <p className="mt-2 opacity-90">Apni fasal ki photo dalein aur turant ilaaj payein</p>
//           </div>

//           <div className="p-6">
            
//             {/* --- CONDITION 1: CAMERA UI --- */}
//             {isCameraOpen ? (
//               <div className="bg-black p-4 rounded-lg text-center relative animate-fade-in">
//                   <Webcam
//                       audio={false}
//                       ref={webcamRef}
//                       screenshotFormat="image/jpeg"
//                       className="w-full rounded-lg mb-4 border border-gray-700"
//                       videoConstraints={{ facingMode: "environment" }} // Back Camera Logic
//                   />
                  
//                   {/* Photo Counter */}
//                   <div className="absolute top-6 right-6 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-bold border border-white backdrop-blur-sm">
//                     {images.length}/5 Photos
//                   </div>

//                   <div className="flex flex-col items-center gap-6">
//                       {/* Capture Trigger */}
//                       <button 
//                           type="button"
//                           onClick={(e) => capturePhoto(e)}
//                           disabled={images.length >= 5} 
//                           className={`p-1 rounded-full border-4 shadow-lg transition-transform active:scale-95
//                             ${images.length >= 5 ? 'border-gray-500 cursor-not-allowed' : 'border-white hover:border-green-400'}`}
//                       >
//                           <div className={`w-16 h-16 rounded-full ${images.length >= 5 ? 'bg-gray-500' : 'bg-red-600'}`}></div>
//                       </button>

//                       {/* Action Buttons */}
//                       <div className="flex gap-4 w-full justify-center">
//                          <button 
//                             type="button"
//                             onClick={() => setIsCameraOpen(false)} 
//                             className="bg-gray-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-600"
//                          >
//                             Cancel
//                          </button>
//                          <button 
//                             type="button"
//                             onClick={() => setIsCameraOpen(false)} 
//                             className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700"
//                          >
//                             Done ({images.length})
//                          </button>
//                       </div>
//                   </div>

//                   {/* Mini Previews Strip inside Camera */}
//                   {previews.length > 0 && (
//                      <div className="flex gap-2 mt-4 overflow-x-auto justify-center py-2">
//                         {previews.map((src, i) => (
//                           <div key={i} className="relative">
//                               <img src={src} className="w-12 h-12 rounded border-2 border-white object-cover" />
//                               <span className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full border border-white"></span>
//                           </div>
//                         ))}
//                      </div>
//                   )}
//               </div>
//             ) : (
              
//               // --- CONDITION 2: MAIN DASHBOARD ---
//               !result && (
//                 <div className="mb-6 animate-fade-in">
                  
//                   {/* Selection Buttons */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                     {/* Start Camera */}
//                     <button 
//                       onClick={() => setIsCameraOpen(true)}
//                       className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center hover:bg-blue-100 transition text-blue-700 group"
//                     >
//                         <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">📷</span>
//                         <span className="font-bold">Start Camera</span>
//                     </button>

//                     {/* Gallery Upload */}
//                     <div className="relative bg-green-50 border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:bg-green-100 transition cursor-pointer group">
//                       <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
//                       <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">🖼️</span>
//                       <span className="font-bold text-green-700">Gallery Upload</span>
//                     </div>
//                   </div>

//                   {/* Main Previews List */}
//                   {previews.length > 0 && (
//                     <div className="flex gap-4 mt-4 overflow-x-auto pb-4 scrollbar-hide">
//                       {previews.map((src, index) => (
//                         <div key={index} className="relative flex-shrink-0 w-24 h-24 border rounded-lg overflow-hidden shadow-sm group">
//                           <img src={src} alt="preview" className="w-full h-full object-cover" />
//                           <button 
//                             onClick={() => removeImage(index)}
//                             className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-bl-lg text-xs hover:bg-red-600 transition"
//                           >✕</button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
                  
//                   <p className="text-right text-sm text-gray-500 mt-2">
//                     {images.length}/5 photos selected
//                   </p>

//                   <button
//                     onClick={handleScan}
//                     disabled={loading || images.length < 3}
//                     className={`w-full mt-6 py-3 px-4 rounded-lg font-bold text-lg shadow-md transition-all transform active:scale-95
//                       ${loading || images.length < 3 
//                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
//                         : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
//                       }`}
//                   >
//                     {loading ? "Analyzing..." : "Check Disease Now 🔍"}
//                   </button>
//                 </div>
//               )
//             )}

//             {/* --- CONDITION 3: RESULT DISPLAY (UPDATED UI) --- */}
//             {result && (
//               <div className="animate-fade-in bg-white">
//                 {result.isPlant === false ? (
//                   <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
//                       <h3 className="text-xl font-bold text-red-700">⚠️ Error</h3>
//                       <p>Ye plant nahi lag raha.</p>
//                       <button onClick={resetScanner} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">Retry</button>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="flex justify-between items-start border-b pb-4 mb-4">
//                       <div>
//                         <h2 className="text-2xl font-bold text-gray-800">{result.diseaseName}</h2>
//                         <span className="inline-block mt-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold border border-green-200">
//                           Confidence: {result.confidence}
//                         </span>
//                       </div>
//                       <button onClick={resetScanner} className="text-sm text-blue-600 hover:underline hover:text-blue-800 font-medium">
//                         New Scan ↺
//                       </button>
//                     </div>

//                     <div className="space-y-4">
//                       {/* Symptoms - Using FormatResult */}
//                       <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                           <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
//                             🔍 Lakshan (Symptoms)
//                           </h3>
//                           <FormatResult text={result.symptoms} />
//                       </div>

//                       {/* Organic Solution - Using FormatResult */}
//                       <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//                           <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
//                             🌿 Jaivik Upay (Organic)
//                           </h3>
//                           <FormatResult text={result.solution} />
//                       </div>

//                       {/* Medicine - Using FormatResult */}
//                       <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                           <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
//                             🧪 Dawai (Medicine)
//                           </h3>
//                           <FormatResult text={result.medicine} />
//                       </div>
//                     </div>

//                     <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-yellow-50 p-4 rounded-lg gap-4 shadow-sm">
//                       <div>
//                         <p className="font-bold text-yellow-800">{isLoggedIn ? "Record Save Karein" : "Save Report?"}</p>
//                         <p className="text-xs text-yellow-700">{isLoggedIn ? "Save to Farm History" : "Login to save history"}</p>
//                       </div>
//                       <button 
//                           onClick={handleSaveReport} 
//                           className={`px-6 py-2 rounded text-white font-bold shadow transition-colors w-full sm:w-auto
//                             ${isLoggedIn ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}
//                       >
//                         {isLoggedIn ? "Save History 💾" : "Login & Save 🔐"}
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}

//           </div>
//         </div>
        
//       </div>
      
//       {/* 2. FOOTER COMPONENT */}
//       <Footer />
//     </div>
//   );
// };

// export default DiseaseScanner;


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Webcam from "react-webcam";
import { BACKEND_URL } from '../config';
import Footer from '../pages/Footer'; 

// --- HELPER COMPONENT: For Beautiful Text Formatting ---
const FormatResult = ({ text }) => {
  if (!text) return null;

  const hasNumbers = /\d+[\.\)]\s/.test(text);

  if (hasNumbers) {
    const points = text.split(/\d+[\.\)]\s/).filter((point) => point.trim() !== "");
    return (
      <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
        {points.map((point, index) => {
          const words = point.split(" ");
          const firstFewWords = words.slice(0, 4).join(" ");
          const restOfSentence = words.slice(4).join(" ");
          return (
            <li key={index} className="leading-relaxed">
              <span className="font-bold text-green-800">{firstFewWords}</span>{" "}
              {restOfSentence}
            </li>
          );
        })}
      </ul>
    );
  }

  const keywords = ["Remove", "Apply", "Avoid", "Spray", "Water", "Monitor", "Clean", "Use", "Destroy", "Immediately"];
  return (
    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
      {text.split(" ").map((word, i) => {
        const cleanWord = word.replace(/[^a-zA-Z]/g, '');
        const isKeyword = keywords.includes(cleanWord) || (cleanWord.length > 3 && /^[A-Z]/.test(cleanWord));
        return isKeyword ? (
          <span key={i} className="font-semibold text-green-800">{word} </span>
        ) : (
          <span key={i}>{word} </span>
        );
      })}
    </p>
  );
};

// --- MAIN COMPONENT ---
const DiseaseScanner = () => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef(null);
  const isCapturing = useRef(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.warning("Max 5 photos allowed!");
      return;
    }
    const newImages = [...images, ...files];
    setImages(newImages);
    setPreviews(newImages.map((file) => URL.createObjectURL(file)));
  };

 const capturePhoto = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isCapturing.current) return; 

    isCapturing.current = true;
    const imageSrc = webcamRef.current.getScreenshot();
    
    if (imageSrc) {
      setImages((prevImages) => {
        if (prevImages.length >= 5) {
          toast.warning("Bas! Max 5 photos ho gayi.");
          return prevImages; 
        }
        const file = dataURLtoFile(imageSrc, `camera_capture_${Date.now()}.jpg`);
        const newPreviewURL = URL.createObjectURL(file);
        setPreviews((prevPreviews) => [...prevPreviews, newPreviewURL]);
        toast.success(`Photo ${prevImages.length + 1} Captured! 📸`);
        return [...prevImages, file];
      });
    }
    setTimeout(() => { isCapturing.current = false; }, 1000);
  }, [webcamRef]);

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleScan = async () => {
    if (images.length < 3) {
      toast.error("Kam se kam 3 photos chahiye (Leaf, Stem, Whole Plant)");
      return;
    }

    const formData = new FormData();
    images.forEach((img) => formData.append('photos', img));

    setLoading(true);
    const toastId = toast.loading("Analyzing... Krishi Vaigyanik check kar rahe hain 🌿");

    try {
      const res = await fetch(`${BACKEND_URL}/api/disease/guest-scan`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (res.status === 429) {
        toast.error("Aaj ki limit khatam! Login karein.");
      } else if (!res.ok) {
        toast.error(data.error || "Kuch gadbad hui hai.");
      } else {
        setResult(data);
        setIsCameraOpen(false); 
        toast.success("Report Taiyaar hai! ✅");
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error(error);
      toast.error("Server connect nahi ho raha.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.info("Save karne ke liye Login zaroori hai.");
      navigate('/login');
      return;
    }

    const reportData = {
      diseaseName: result.diseaseName,
      confidence: result.confidence,
      symptoms: result.symptoms,
      solution: result.solution,
      medicine: result.medicine
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/disease/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reportData)
      });

      if (res.ok) {
        toast.success("History mein save ho gaya! 💾");
      } else {
        toast.error("Save nahi ho paya.");
      }
    } catch (err) {
      toast.error("Error saving report.");
    }
  };

  const resetScanner = () => {
    setImages([]);
    setPreviews([]);
    setResult(null);
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="flex flex-col min-h-screen"> 
      
      {/* --- CONTENT SECTION --- */}
      <div className="flex-grow py-10 min-h-screen px-4 pt-24 bg-gray-50">
        
        {/* Main Scanner Card */}
        <div className="max-w-3xl mx-auto mt-20 bg-white shadow-xl rounded-2xl overflow-hidden relative z-10">
          
          <div className="bg-green-700 p-6 text-center text-white">
            <h2 className="text-3xl font-bold">🌱 AI Plant Doctor</h2>
            <p className="mt-2 opacity-90">Apni fasal ki photo dalein aur turant ilaaj payein</p>
          </div>

          <div className="p-6">
            {/* CAMERA UI */}
            {isCameraOpen ? (
              <div className="bg-black p-4 rounded-lg text-center relative animate-fade-in">
                  <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full rounded-lg mb-4 border border-gray-700"
                      videoConstraints={{ facingMode: "environment" }} 
                  />
                  <div className="absolute top-6 right-6 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-bold border border-white backdrop-blur-sm">
                    {images.length}/5 Photos
                  </div>
                  <div className="flex flex-col items-center gap-6">
                      <button 
                          type="button"
                          onClick={(e) => capturePhoto(e)}
                          disabled={images.length >= 5} 
                          className={`p-1 rounded-full border-4 shadow-lg transition-transform active:scale-95
                            ${images.length >= 5 ? 'border-gray-500 cursor-not-allowed' : 'border-white hover:border-green-400'}`}
                      >
                          <div className={`w-16 h-16 rounded-full ${images.length >= 5 ? 'bg-gray-500' : 'bg-red-600'}`}></div>
                      </button>
                      <div className="flex gap-4 w-full justify-center">
                         <button type="button" onClick={() => setIsCameraOpen(false)} className="bg-gray-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-600">Cancel</button>
                         <button type="button" onClick={() => setIsCameraOpen(false)} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">Done ({images.length})</button>
                      </div>
                  </div>
                  {previews.length > 0 && (
                     <div className="flex gap-2 mt-4 overflow-x-auto justify-center py-2">
                        {previews.map((src, i) => (
                          <div key={i} className="relative">
                              <img src={src} className="w-12 h-12 rounded border-2 border-white object-cover" alt="cam-preview" />
                              <span className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full border border-white"></span>
                          </div>
                        ))}
                     </div>
                  )}
              </div>
            ) : (
              // MAIN DASHBOARD
              !result && (
                <div className="mb-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button onClick={() => setIsCameraOpen(true)} className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center hover:bg-blue-100 transition text-blue-700 group">
                        <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">📷</span>
                        <span className="font-bold">Start Camera</span>
                    </button>
                    <div className="relative bg-green-50 border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:bg-green-100 transition cursor-pointer group">
                      <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">🖼️</span>
                      <span className="font-bold text-green-700">Gallery Upload</span>
                    </div>
                  </div>
                  {previews.length > 0 && (
                    <div className="flex gap-4 mt-4 overflow-x-auto pb-4 scrollbar-hide">
                      {previews.map((src, index) => (
                        <div key={index} className="relative flex-shrink-0 w-24 h-24 border rounded-lg overflow-hidden shadow-sm group">
                          <img src={src} alt="preview" className="w-full h-full object-cover" />
                          <button onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-bl-lg text-xs hover:bg-red-600 transition">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-right text-sm text-gray-500 mt-2">{images.length}/5 photos selected</p>
                  <button onClick={handleScan} disabled={loading || images.length < 3} className={`w-full mt-6 py-3 px-4 rounded-lg font-bold text-lg shadow-md transition-all transform active:scale-95 ${loading || images.length < 3 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'}`}>
                    {loading ? "Analyzing..." : "Check Disease Now 🔍"}
                  </button>
                </div>
              )
            )}

            {/* RESULT DISPLAY */}
            {result && (
              <div className="animate-fade-in bg-white">
                {result.isPlant === false ? (
                  <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="text-xl font-bold text-red-700">⚠️ Error</h3>
                      <p>Ye plant nahi lag raha.</p>
                      <button onClick={resetScanner} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">Retry</button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start border-b pb-4 mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">{result.diseaseName}</h2>
                        <span className="inline-block mt-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold border border-green-200">Confidence: {result.confidence}</span>
                      </div>
                      <button onClick={resetScanner} className="text-sm text-blue-600 hover:underline hover:text-blue-800 font-medium">New Scan ↺</button>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">🔍 Lakshan (Symptoms)</h3>
                          <FormatResult text={result.symptoms} />
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">🌿 Jaivik Upay (Organic)</h3>
                          <FormatResult text={result.solution} />
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-2">🧪 Dawai (Medicine)</h3>
                          <FormatResult text={result.medicine} />
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-yellow-50 p-4 rounded-lg gap-4 shadow-sm">
                      <div>
                        <p className="font-bold text-yellow-800">{isLoggedIn ? "Record Save Karein" : "Save Report?"}</p>
                        <p className="text-xs text-yellow-700">{isLoggedIn ? "Save to Farm History" : "Login to save history"}</p>
                      </div>
                      <button onClick={handleSaveReport} className={`px-6 py-2 rounded text-white font-bold shadow transition-colors w-full sm:w-auto ${isLoggedIn ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}>
                        {isLoggedIn ? "Save History 💾" : "Login & Save 🔐"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ✅ NEW SECTION: HISTORY BUTTON (Only for Logged In Users) */}
        {isLoggedIn && (
    <div className="max-w-3xl mx-auto mt-8 flex justify-center animate-fade-in-up">
        <button 
            type="button" // <--- YE ADD KAREIN (Page Refresh Rokega)
            onClick={() => navigate('/my-reports')} 
            className="flex items-center gap-3 px-8 py-3 bg-white border-2 border-green-600 text-green-700 rounded-full font-bold shadow-md hover:bg-green-50 hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
            <span className="text-xl">📜</span>
            View My Scan History (Purani Reports)
        </button>
    </div>
)}
        
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DiseaseScanner;