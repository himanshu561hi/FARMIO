
import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaLeaf, FaSave } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BACKEND_URL } from '../config';

// --- HELPER: UUID Generation (Required for Guest Saving) ---
const generateUUID = () => {
    // Generates a unique session ID for the guest user
    return 'sess_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(2);
};

// --- SAVE LOGIC (Defined outside to be available in cleanup) ---
const saveSessionToDatabase = async (messagesToSave, currentSessionId) => {
    // Only save if we have a session ID AND some meaningful messages were exchanged
    if (!currentSessionId || messagesToSave.length <= 1) return;

    // Use token if available, otherwise save as guest
    const token = localStorage.getItem('token');
    
    try {
        // Hitting the PUBLIC save endpoint (save-guest)
        const res = await fetch(`${BACKEND_URL}/api/chatbot/save-guest`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                // Pass token only if logged in (for potential backend merging/auth)
                ...(token && { 'Authorization': `Bearer ${token}` }) 
            },
            body: JSON.stringify({ 
                messages: messagesToSave,
                sessionId: currentSessionId,
                userId: token ? JSON.parse(localStorage.getItem('user'))?.id : null 
            }),
        });
        
        if (res.ok) {
            console.log(`Chat session auto-saved successfully. ID: ${currentSessionId}`);
        } else {
            console.error("Failed to auto-save session. Response status:", res.status);
        }
    } catch (error) {
        console.error("Network error during auto-save:", error);
    }
};
// -------------------------------------------------------------------


const Chatbot = () => {
  // 1. SESSION ID STATE: Generate new ID on every mount
  const [sessionId, setSessionId] = useState(() => {
    // Generate new ID every time the component mounts, ensuring a distinct session
    return generateUUID();
  });
  
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      text: "Namaste! 🙏 Main hoon **Farmio Chatbot**. \nNiche diye gaye options mein se chunein ya apna sawal likhein." 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // 2. REF for latest messages (CRITICAL for unmount/cleanup)
  const messagesRef = useRef(messages);
  
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // --- AUTOMATIC SAVE ON EXIT (Saves Guest/User History) ---
  useEffect(() => {
    // Cleanup runs when component unmounts (user navigates away)
    return () => {
        // Trigger the save using the latest state stored in the ref
        saveSessionToDatabase(messagesRef.current, sessionId);
    };
  }, [sessionId]); 
  // ---------------------------------


  // --- REST OF THE LOGIC (UNCHANGED) ---

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    processMessage(input);
  };
  
  // --- QUICK OPTIONS (SUGGESTIONS) ---
  const suggestionOptions = [
    "🧪 Mitti ka pH ghar pe kaise check karein?", 
    "💧 Mitti ki nami (Moisture) bina machine ke dekhein", 
    "🌾 Gehu (Wheat) ki kheti kaise karein?",
    "💰 Aaj ka Mandi Bhav kya hai?",
    "🌱 Beej asali hai ya nakli kaise pehchane?",
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-10 px-4 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-green-200">
        
        {/* --- HEADER --- */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-5 flex items-center justify-between gap-4 shadow-lg z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl border-2 border-white/30">
              <FaRobot />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-wide">Farmio Assistant</h1>
              <p className="text-green-50 text-xs font-medium opacity-90">Session ID: {sessionId.substring(0, 8)}...</p>
            </div>
          </div>
          
          {/* Save Status Indicator */}
          <FaSave className="text-green-300 text-xl" title="Session will automatically save on exit" />
        </div>

        {/* --- CHAT AREA --- */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#f0fdf4]"
             style={{ backgroundImage: 'radial-gradient(#bbf7d0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              <div className={`flex items-end gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shadow-sm flex-shrink-0 
                  ${msg.role === 'user' ? 'bg-stone-700 text-white' : 'bg-emerald-600 text-white'}`}>
                  {msg.role === 'user' ? <FaUser /> : <FaLeaf />}
                </div>

                <div className={`px-5 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed 
                  ${msg.role === 'user' 
                    ? 'bg-gray-900 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-green-100 rounded-bl-none'
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

        {/* --- SUGGESTION CHIPS --- */}
        <div className="bg-white border-t border-gray-100 px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-emerald-200">
                {suggestionOptions.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => processMessage(option)} 
                        disabled={loading}
                        className="whitespace-nowrap px-4 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200 hover:bg-emerald-100 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>

        {/* --- INPUT AREA --- */}
        <form onSubmit={handleFormSubmit} className="p-4 bg-white border-t border-gray-100 pt-2">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-2 py-2 shadow-inner focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crops, fertilizers, or prices..."
              className="flex-1 bg-transparent border-none outline-none px-4 text-gray-700 placeholder-gray-400"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 disabled:bg-gray-300 disabled:scale-100 transition-all transform hover:scale-105 shadow-md"
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