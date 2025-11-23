
import React, { useState } from 'react';
import { FaInstagram, FaLinkedin, FaWhatsapp, FaArrowUp, FaTimes, FaGithub, FaExternalLinkAlt, FaCode } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Image Imports (Ensure paths are correct)
import aman from "../assets/heroImage.png";
import himanshu from "../assets/him.jpg";
import sanjeev from "../assets/sanjiv.jpg";
import sachchidanand from "../assets/sac.jpg";
import kanishka from "../assets/ka.jpg";
import anshu from "../assets/anshu.jpg";

const Footer = () => {
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const teamMembers = [
    { 
      name: "Aman Gupta", 
      designation: "MERN & DevOps Lead", 
      role: "MERN & DevOps Lead",
      linkedin: "https://www.linkedin.com/in/amangupta9454/", 
      github: "https://github.com/amangupta9454", 
      image: aman,
      color: "from-blue-400 to-cyan-400"
    },
    { 
      name: "Himanshu Gupta", 
      designation: "MERN Stack Developer", 
      role: "Full Stack Developer",
      linkedin: "https://www.linkedin.com/in/himanshu561hi/", 
      github: "https://github.com/himanshu561hi", 
      image: himanshu,
      color: "from-green-400 to-emerald-500"
    },
    { 
      name: "Sachchidanand Yadav", 
      designation: "Frontend Developer", 
      role: "UI/UX Engineer",
      linkedin: "https://www.linkedin.com/in/784sachchidanandyadav/", 
      github: "https://github.com/sachchidanand-yadav", 
      image: sachchidanand,
      color: "from-purple-400 to-pink-400"
    },
    { 
      name: "Anshu", 
      designation: "Frontend Developer", 
      role: "Frontend Developer",
      linkedin: "https://www.linkedin.com/in/anshu-302643328/", 
      github: "https://github.com/anshu-dev", 
      image: anshu,
      color: "from-yellow-400 to-orange-500"
    },
    { 
      name: "Kanishka Pal", 
      designation: "Frontend Developer", 
      role: "UI/UX Designer",
      linkedin: "https://www.linkedin.com/in/kanishka-pal-288951364/", 
      github: "https://github.com/kanishkapal2005", 
      image: kanishka,
      color: "from-red-400 to-rose-500"
    },
    { 
      name: "Sanjeev Kumar", 
      designation: "Frontend Developer", 
      role: "Interface Developer",
      linkedin: "https://www.linkedin.com/in/sanjivkumar945080/", 
      github: "https://github.com/sanjeev945080", 
      image: sanjeev,
      color: "from-indigo-400 to-violet-500"
    },
  ];

  return (
    <>
      {/* ===== MAIN FOOTER ===== */}
      <footer className="relative bg-black text-gray-300 pt-24 pb-0 px-0 overflow-hidden isolate font-sans">
        
        {/* Glowing Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute w-[600px] h-[600px] top-[-100px] left-[-100px] bg-gradient-to-br from-cyan-500/20 to-purple-600/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute w-[500px] h-[500px] bottom-[-100px] right-[-100px] bg-gradient-to-tr from-pink-500/20 to-yellow-300/20 blur-[100px] rounded-full animate-ping" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-[0.04]" />
        </div>

        {/* Main Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-6 relative z-10 mb-16">
          
          {/* Column 1: Contact Info */}
          <div className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:scale-[1.02] hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] duration-500">
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4 tracking-widest">FARMIO</h3>
            <p className="text-sm leading-relaxed text-gray-400">Village-Jashara Post Sachui District Mau</p>
            <p className="text-sm mt-2 text-gray-400">Email: ag0567688@gmail.com</p>
            <p className="text-sm text-gray-400">Phone: +91 9560472926</p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-transform hover:scale-[1.02] duration-500">
            <h4 className="text-xl font-semibold text-cyan-300 mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {["Home", "Product", "Contact", "Privacy Policy", "Disclaimer"].map((text) => (
                <li key={text} className="relative group">
                  <Link to={text === "Home" ? "/" : `/${text.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-cyan-400 transition-all duration-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-cyan-400 transition-colors"></span>
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social Links */}
          <div className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:scale-[1.02] duration-500">
            <h4 className="text-xl font-semibold text-pink-400 mb-4">Follow Us</h4>
            <div className="flex gap-6 text-2xl">
              {[
                { href: "https://instagram.com/gupta_aman_9161", icon: <FaInstagram />, color: "hover:text-pink-500", bg: "group-hover:bg-pink-500/10" },
                { href: "https://www.linkedin.com/in/amangupta9454", icon: <FaLinkedin />, color: "hover:text-blue-400", bg: "group-hover:bg-blue-400/10" },
                { href: "https://wa.me/919560472926", icon: <FaWhatsapp />, color: "hover:text-green-400", bg: "group-hover:bg-green-400/10" }
              ].map(({ href, icon, color, bg }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  className={`group relative p-3 rounded-xl border border-white/10 bg-white/5 transition-all duration-300 ${color} ${bg} hover:border-white/20 hover:-translate-y-1`}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: For Farmers */}
          <div className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-transform hover:scale-[1.02] duration-500">
            <h4 className="text-xl font-semibold text-green-400 mb-4">For Farmers</h4>
            <p className="text-sm mb-6 text-gray-400">Join our network to sell your produce directly and get real-time market prices.</p>
            <button onClick={scrollToTop}
              className="group w-full relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:from-cyan-500 hover:to-blue-600">
              <FaArrowUp className="mr-2 group-hover:-translate-y-1 transition-transform" />
              Back to Top
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom Section: Copyright & Team Button */}
        <div className="bg-black py-8 px-6 relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} <span className="text-white font-bold tracking-wide">FARMIO</span>. All rights reserved.
            </div>

            {/* Team Button */}
            <button
                onClick={() => setIsTeamModalOpen(true)}
                className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300"
            >
                <span className="text-gray-400 text-sm group-hover:text-white transition-colors">Created by</span>
                <span className="font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide group-hover:brightness-125 transition-all">
                  CODE VEDA
                </span>
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center group-hover:rotate-12 transition-transform">
                   <FaCode className="text-white text-xs" />
                </div>
            </button>
          </div>
        </div>

        {/* BLACK LEGAL STRIP */}
        <div className="w-full bg-[#050505] border-t border-white/10 py-3 relative z-20">
            <div className="max-w-7xl mx-auto px-6 flex justify-center md:justify-end gap-8 text-[11px] tracking-widest uppercase font-medium text-gray-500">
                <Link to="/disclaimer" className="hover:text-white transition-colors duration-300">
                    Disclaimer
                </Link>
                <span className="text-gray-800">|</span>
                <Link to="/privacy-policy" className="hover:text-white transition-colors duration-300">
                    Privacy Policy
                </Link>
            </div>
        </div>

      </footer>

      {/* ===== ENHANCED "MEET OUR TEAM" MODAL ===== */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl px-4 animate-[fadeIn_0.3s_ease-out]">
          
          {/* Modal Container */}
          <div
            className="relative w-full max-w-7xl h-[90vh] overflow-y-auto bg-[#0a0a0a]
                       border border-white/10 rounded-3xl shadow-2xl
                       scrollbar-thin scrollbar-thumb-cyan-600/50 scrollbar-track-gray-900"
          >
            {/* Decorative Grid Background (Pointer events none to prevent blocking) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            
            {/* Glow Orbs in Modal (Pointer events none) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setIsTeamModalOpen(false)}
              className="fixed top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-500 text-gray-400 hover:text-red-500 transition-all duration-300 backdrop-blur-md group"
            >
              <FaTimes className="text-lg group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Content Wrapper */}
            <div className="relative z-10 px-6 py-16 md:px-12">
              
              {/* Header */}
              <div className="text-center mb-16">
                <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">
                  The Architects
                </span>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                  Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Code Veda</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
                  A collective of passionate developers empowering Indian agriculture through innovation.
                </p>
              </div>

              {/* Team Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="group relative h-full"
                    style={{ animation: `cardRise 0.6s ease-out ${index * 0.1}s both` }}
                  >
                    {/* Card Body */}
                    <div className="relative h-full bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl p-1 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(0,255,255,0.1)] group-hover:border-cyan-500/30">
                      
                      {/* Inner Content */}
                      <div className="relative h-full bg-gray-950/50 rounded-xl p-6 flex flex-col items-center text-center overflow-hidden">
                        
                        {/* Hover Gradient Flash (Added pointer-events-none to fix click issue) */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />

                        {/* Image Wrapper with Spinning Border */}
                        <div className="relative mb-6">
                          {/* Spinning Ring */}
                          <div className={`absolute -inset-[3px] rounded-full bg-gradient-to-r ${member.color} opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 animate-spin-slow`} />
                          
                          {/* Static Image Container */}
                          <div className="relative w-32 h-32 rounded-full p-[3px] bg-gray-900 overflow-hidden ring-2 ring-white/10 group-hover:ring-transparent transition-all">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover rounded-full filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110"
                            />
                          </div>
                          
                          {/* Role Badge */}
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-900 border border-white/10 px-3 py-1 rounded-full shadow-xl whitespace-nowrap z-10 pointer-events-none">
                             <span className={`text-[10px] font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${member.color}`}>
                               {member.role}
                             </span>
                          </div>
                        </div>

                        {/* Info */}
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-200 transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium mb-6 border-b border-white/5 pb-4 w-full">
                          {member.designation}
                        </p>

                        {/* Social Actions (Added z-index to ensure clickability) */}
                        <div className="flex gap-3 mt-auto relative z-10">
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                             className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#0077b5] text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer shadow-md">
                            <FaLinkedin />
                          </a>
                          {member.github && (
                            <a href={member.github} target="_blank" rel="noopener noreferrer"
                               className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer shadow-md">
                              <FaGithub />
                            </a>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Note in Modal */}
              <div className="text-center mt-16">
                <p className="text-gray-600 text-sm">
                  Want to collaborate? <a href="mailto:ag0567688@gmail.com" className="text-cyan-400 hover:underline">Contact Us</a>
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes cardRise {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* Custom Scrollbar */
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>
    </>
  );
};

export default Footer;
