
// import React, { useState, useRef, useEffect } from 'react';
// import { FaPaperPlane, FaRobot, FaUser, FaLeaf } from 'react-icons/fa';
// import ReactMarkdown from 'react-markdown'; // <-- Import for Bold/Lists
// import remarkGfm from 'remark-gfm';
// import { BACKEND_URL } from '../config';

// const Chatbot = () => {
//   const [messages, setMessages] = useState([
//     { 
//       role: 'model', 
//       text: "Namaste! 🙏 Main hoon **Farmio Chatbot**. \nKheti, fasal, ya mausam ke baare mein kuch bhi puchein." 
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = { role: 'user', text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/chatbot/ask`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//             message: input,
//             history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })).slice(-5) 
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
//       } else {
//         setMessages((prev) => [...prev, { role: 'model', text: "⚠️ AI connect nahi ho paya." }]);
//       }
//     } catch (error) {
//       console.error(error);
//       setMessages((prev) => [...prev, { role: 'model', text: "🌐 Server Error. Internet check karein." }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4 flex justify-center items-center">
//       <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-gray-100 relative">
        
//         {/* --- 1. MODERN HEADER --- */}
//         <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-5 flex items-center gap-4 shadow-lg z-10">
//           <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl border-2 border-white/30">
//             <FaRobot />
//           </div>
//           <div>
//             <h1 className="text-white font-bold text-xl tracking-wide">Farmio Assistant</h1>
//             <div className="flex items-center gap-2">
//               <span className="relative flex h-3 w-3">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
//               </span>
//               <p className="text-green-50 text-xs font-medium opacity-90">Always Online</p>
//             </div>
//           </div>
//         </div>

//         {/* --- 2. CHAT AREA (Textured Background) --- */}
//         <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#f0fdf4]"
//              style={{ backgroundImage: 'radial-gradient(#bbf7d0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          
//           {messages.map((msg, index) => (
//             <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
//               <div className={`flex items-end gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
//                 {/* Avatar */}
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-sm flex-shrink-0 
//                   ${msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-emerald-600 text-white'}`}>
//                   {msg.role === 'user' ? <FaUser /> : <FaLeaf />}
//                 </div>

//                 {/* Message Bubble with Markdown */}
//                 <div className={`px-5 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed 
//                   ${msg.role === 'user' 
//                     ? 'bg-gray-900 text-white rounded-br-none' 
//                     : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
//                   }`}>
                  
//                   {/* React Markdown Component handles Bold, Lists, etc. */}
//                   <ReactMarkdown 
//                     remarkPlugins={[remarkGfm]}
//                     components={{
//                       strong: ({node, ...props}) => <span className="font-bold text-emerald-700" {...props} />,
//                       ul: ({node, ...props}) => <ul className="list-disc pl-4 mt-2 space-y-1" {...props} />,
//                       li: ({node, ...props}) => <li className="mb-1" {...props} />,
//                       p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
//                     }}
//                   >
//                     {msg.text}
//                   </ReactMarkdown>

//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {/* Thinking Indicator */}
//           {loading && (
//             <div className="flex justify-start">
//               <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1.5 items-center w-fit">
//                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
//                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
//                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* --- 3. INPUT AREA --- */}
//         <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
//           <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-2 py-2 shadow-inner focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500 transition-all">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Ask about crops, fertilizers, or prices..."
//               className="flex-1 bg-transparent border-none outline-none px-4 text-gray-700 placeholder-gray-400"
//               disabled={loading}
//             />
//             <button 
//               type="submit" 
//               disabled={loading || !input.trim()}
//               className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 disabled:bg-gray-300 disabled:scale-100 transition-all transform hover:scale-110 shadow-md"
//             >
//               <FaPaperPlane className="text-sm translate-x-[-1px] translate-y-[1px]" />
//             </button>
//           </div>
//           <div className="text-center mt-2">
//              <p className="text-[10px] text-gray-400">AI can make mistakes. Verify important agricultural decisions.</p>
//           </div>
//         </form>

//       </div>
//     </div>
//   );
// };

// export default Chatbot;



import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaLeaf } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BACKEND_URL } from '../config';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      text: "Namaste! 🙏 Main hoon **Farmio Chatbot**. \nNiche diye gaye options mein se chunein ya apna sawal likhein." 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- QUICK OPTIONS (SUGGESTIONS) ---
  const suggestionOptions = [
    "🧪 Mitti ka pH ghar pe kaise check karein?", // <--- NEW
    "💧 Mitti ki nami (Moisture) bina machine ke dekhein", // <--- NEW
    "🌾 Gehu (Wheat) ki kheti kaise karein?",
    "💰 Aaj ka Mandi Bhav kya hai?",
    "🌱 Beej asali hai ya nakli kaise pehchane?", // <--- NEW
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- MAIN SEND LOGIC (Reusable) ---
  const processMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // 1. User Message Add karein
    const userMessage = { role: 'user', text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput(''); // Input clear karein
    setLoading(true);

    try {
      // 2. Backend API Call
      const res = await fetch(`${BACKEND_URL}/api/chatbot/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: messageText,
            history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })).slice(-5) 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'model', text: "⚠️ AI connect nahi ho paya." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'model', text: "🌐 Server Error. Internet check karein." }]);
    } finally {
      setLoading(false);
    }
  };

  // Form Submit Handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    processMessage(input);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-gray-100 relative">
        
        {/* --- 1. HEADER --- */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-5 flex items-center gap-4 shadow-lg z-10">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl border-2 border-white/30">
            <FaRobot />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-wide">Farmio Assistant</h1>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
              </span>
              <p className="text-green-50 text-xs font-medium opacity-90">Always Online</p>
            </div>
          </div>
        </div>

        {/* --- 2. CHAT AREA --- */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#f0fdf4]"
             style={{ backgroundImage: 'radial-gradient(#bbf7d0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              <div className={`flex items-end gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-sm flex-shrink-0 
                  ${msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-emerald-600 text-white'}`}>
                  {msg.role === 'user' ? <FaUser /> : <FaLeaf />}
                </div>

                <div className={`px-5 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed 
                  ${msg.role === 'user' 
                    ? 'bg-gray-900 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      strong: ({node, ...props}) => <span className="font-bold text-emerald-700" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-4 mt-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1.5 items-center w-fit">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- 3. SUGGESTION CHIPS (NEW FEATURE) --- */}
        <div className="bg-white border-t border-gray-100 px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-emerald-200">
                {suggestionOptions.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => processMessage(option)} // Direct click se send hoga
                        disabled={loading}
                        className="whitespace-nowrap px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-medium rounded-full border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>

        {/* --- 4. INPUT AREA --- */}
        <form onSubmit={handleFormSubmit} className="p-4 bg-white border-t border-gray-100 pt-2">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-2 py-2 shadow-inner focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Apna sawal yahan likhein..."
              className="flex-1 bg-transparent border-none outline-none px-4 text-gray-700 placeholder-gray-400"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 disabled:bg-gray-300 disabled:scale-100 transition-all transform hover:scale-110 shadow-md"
            >
              <FaPaperPlane className="text-sm translate-x-[-1px] translate-y-[1px]" />
            </button>
          </div>
          <div className="text-center mt-2">
             <p className="text-[10px] text-gray-400">AI can make mistakes. Always verify crop medicines.</p>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Chatbot;