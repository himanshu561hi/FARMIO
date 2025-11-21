import React, { useState } from 'react';
import { FaInstagram, FaLinkedin, FaWhatsapp, FaArrowUp, FaTimes, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
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
    { name: "Sachchidanand Yadav", designation: "Frontend Developer", linkedin: "https://www.linkedin.com/in/784sachchidanandyadav/", github: "https://github.com/sachchidanand-yadav", image: sachchidanand },
    { name: "Anshu", designation: "Frontend Developer", linkedin: "https://www.linkedin.com/in/anshu-302643328/", github: "https://github.com/anshu-dev", image: anshu},
    { name: "Kanishka Pal", designation: "Frontend Developer", linkedin: "https://www.linkedin.com/in/kanishka-pal-288951364/", github: "https://github.com/kanishkapal2005", image: kanishka },
    { name: "Aman Gupta", designation: "Mern & Devops Engineer", linkedin: "https://www.linkedin.com/in/amangupta9454/", github: "https://github.com/amangupta9454", image: aman },
    { name: "Himanshu Gupta", designation: "Mern Stack Developer", linkedin: "https://www.linkedin.com/in/himanshu561hi/", github: "https://github.com/himanshu561hi", image: himanshu },
    { name: "Sanjeev Kumar", designation: "Frontend Developer", linkedin: "https://www.linkedin.com/in/sanjivkumar945080/", github: "https://github.com/sanjeev945080", image: sanjeev },
    
    
  ];

  return (
    <>
      {/* ===== MAIN FOOTER ===== */}
      <footer className="relative bg-black text-gray-300 pt-24 pb-14 px-6 overflow-hidden isolate">
        {/* Glowing Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute w-[600px] h-[600px] top-[-100px] left-[-100px] bg-gradient-to-br from-cyan-500/30 to-purple-600/30 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute w-[500px] h-[500px] bottom-[-100px] right-[-100px] bg-gradient-to-tr from-pink-500/20 to-yellow-300/20 blur-[100px] rounded-full animate-ping" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-[0.04]" />
        </div>

        {/* Main Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-6 lg:px-0 relative z-10">
          {/* Contact Info */}
          <div className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] duration-500">
            <h3 className="text-3xl font-bold text-white mb-4 tracking-widest">FARMIO</h3>
            <p className="text-sm leading-relaxed">Village-Jashara Post Sachui District Mau</p>
            <p className="text-sm mt-2">Email: ag0567688@gmail.com</p>
            <p className="text-sm">Phone: +91 9560472926</p>
          </div>

          {/* Quick Links */}
          <div className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-transform hover:scale-[1.03] duration-500">
            <h4 className="text-xl font-semibold text-cyan-300 mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {["Home", "Products", "Contact", "Login"].map((text) => (
                <li key={text} className="relative group">
                  <Link to={text === "Home" ? "/" : `/${text.toLowerCase()}`} className="hover:text-cyan-400 transition-all duration-300">
                    {text}
                  </Link>
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-500"></span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:scale-[1.03] duration-500">
            <h4 className="text-xl font-semibold text-pink-400 mb-4">Follow Us</h4>
            <div className="flex gap-8 text-3xl">
              {[
                { href: "https://instagram.com/gupta_aman_9161", icon: <FaInstagram />, color: "text-pink-500" },
                { href: "https://www.linkedin.com/in/amangupta9454", icon: <FaLinkedin />, color: "text-blue-400" },
                { href: "https://wa.me/919560472926", icon: <FaWhatsapp />, color: "text-green-400" }
              ].map(({ href, icon, color }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  className={`group relative hover:scale-125 transform transition-all duration-300 ${color}`}>
                  {icon}
                  <span className="absolute -inset-3 bg-current opacity-20 blur-xl rounded-full -z-10 group-hover:opacity-40 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          {/* For Farmers */}
          <div className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-transform hover:scale-[1.03] duration-500">
            <h4 className="text-xl font-semibold text-green-400 mb-4">For Farmers</h4>
            <p className="text-sm mb-6">Join our network to sell your produce directly and get real-time market prices.</p>
            <button onClick={scrollToTop}
              className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300">
              <FaArrowUp className="mr-2 group-hover:animate-bounce" />
              Back to Top
              <span className="absolute -inset-2 rounded-full bg-cyan-400 blur-xl opacity-40 group-hover:opacity-60 transition-all duration-300 -z-10"></span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-16 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} <span className="text-white font-bold">FARMIO</span>. All rights reserved.
        </div>

        {/* Team Trigger Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsTeamModalOpen(true)}
            className="group inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-100 transition-all duration-300 text-sm font-medium"
          >
            Created by
            <span className="font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-[shine_8s_linear_infinite] tracking-wider">
              Code Veda
            </span>
            <FaExternalLinkAlt className="text-xs group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Shine Animation */}
        <style>{`
          @keyframes shine {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
        `}</style>
      </footer>

      {/* ===== MEET OUR TEAM MODAL – ENHANCED WITH CIRCULAR IMAGES ===== */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-3xl px-4 animate-[fadeIn_0.3s_ease-out]">
          <div
            className="relative w-full max-w-7xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-gray-950/98 via-gray-900/95 to-gray-950/98
                       border-2 border-cyan-500/30 rounded-3xl shadow-[0_0_80px_rgba(6,182,212,0.3)]
                       backdrop-blur-3xl scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-gray-800/30
                       pt-20 pb-10 md:pt-24"
          >
            {/* Ambient Background Orbs */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[150px]" />
            </div>

            {/* Fixed Close Button */}
            <button
              onClick={() => setIsTeamModalOpen(false)}
              className="fixed top-5 right-5 z-50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 hover:from-red-600/80 hover:to-red-700/80
                         border-2 border-white/20 hover:border-red-500/60 rounded-full p-4 
                         backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 hover:rotate-90
                         group"
            >
              <FaTimes className="text-2xl text-gray-300 group-hover:text-white transition-colors" />
            </button>

            {/* Title Section */}
            <div className="text-center mb-16 px-6 relative z-10">
              <div className="inline-block mb-4">
                <div className="relative">
                  <h2 className="text-5xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 
                                 bg-clip-text text-transparent leading-tight tracking-tight">
                    Meet The Team
                  </h2>
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10 rounded-full" />
                </div>
              </div>
              <p className="text-cyan-300 text-xl font-bold tracking-widest mt-2">
                CODE VEDA
              </p>
              <p className="text-gray-400 text-sm mt-2 max-w-2xl mx-auto leading-relaxed">
                A passionate team dedicated to empowering Indian farmers with innovative digital solutions
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-12 md:px-16 relative z-10">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60
                             border-2 border-white/10 rounded-3xl overflow-visible
                             backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] 
                             transition-all duration-700 hover:scale-[1.05] 
                             hover:shadow-[0_0_60px_rgba(6,182,212,0.4)] hover:border-cyan-500/60
                             pb-8"
                  style={{ animation: `cardRise 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15}s both` }}
                >
                  {/* Animated Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-3xl overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-82 h-80 bg-gradient-to-br from-cyan-500/40 to-blue-500/40 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-purple-600/30 to-pink-500/30 rounded-full blur-3xl" />
                  </div>

                  {/* Circular Image Container */}
                  <div className="relative pt-12 pb-6 flex justify-center">
                    <div className="relative group/img">
                      {/* Rotating Border Ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md animate-spin-slow" 
                           style={{ padding: '4px' }} />
                      
                      {/* Static Glow Ring */}
                      <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
                      
                      {/* Image Wrapper with Border */}
                      <div className="relative w-48 h-48 md:w-52 md:h-52 rounded-full p-2 
                                      bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500
                                      shadow-[0_0_40px_rgba(6,182,212,0.3)]
                                      group-hover:shadow-[0_0_60px_rgba(6,182,212,0.6)]
                                      transition-all duration-700">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-900 border-4 border-gray-900">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover transition-all duration-1000 
                                       group-hover/img:scale-110 group-hover/img:rotate-3"
                          />
                        </div>
                      </div>

                      {/* Floating Particles Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                        <div className="absolute top-0 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-float" style={{ animationDelay: '0s' }} />
                        <div className="absolute top-1/4 right-0 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float" style={{ animationDelay: '0.3s' }} />
                        <div className="absolute bottom-1/4 left-0 w-2 h-2 bg-pink-400 rounded-full animate-float" style={{ animationDelay: '0.6s' }} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative px-6 text-center">
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2 
                                   group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 
                                   group-hover:bg-clip-text transition-all duration-500">
                      {member.name}
                    </h3>
                    <div className="h-1 w-16 mx-auto mb-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full
                                    transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                    <p className="text-cyan-300 text-sm md:text-base font-semibold mb-6 tracking-wide leading-relaxed min-h-[3rem]">
                      {member.designation}
                    </p>

                    {/* Social Links */}
                    <div className="flex justify-center gap-6 text-3xl">
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                         className="relative text-blue-400 hover:text-blue-300 transform hover:scale-125 hover:-translate-y-3 
                                    transition-all duration-500 group/link">
                        <FaLinkedin />
                        <span className="absolute -inset-3 bg-blue-500/30 rounded-full blur-xl opacity-0 group-hover/link:opacity-100 transition-opacity -z-10" />
                      </a>
                      {member.github && (
                        <a href={member.github} target="_blank" rel="noopener noreferrer"
                           className="relative text-gray-400 hover:text-white transform hover:scale-125 hover:-translate-y-3 
                                      transition-all duration-500 group/link">
                          <FaGithub />
                          <span className="absolute -inset-3 bg-gray-500/30 rounded-full blur-xl opacity-0 group-hover/link:opacity-100 transition-opacity -z-10" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Animated Bottom Accent Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 
                                  scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-b-3xl" />
                </div>
              ))}
            </div>

            {/* Footer Section */}
            <div className="text-center mt-20 px-6 relative z-10">
              <div className="inline-block p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl
                              shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <p className="text-gray-400 text-base md:text-lg mb-2">
                  Built with <span className="text-red-500 text-2xl animate-pulse">♥</span> for Indian Farmers
                </p>
                <p className="text-cyan-300 text-sm font-semibold tracking-widest">
                  TRANSFORMING AGRICULTURE • ONE LINE AT A TIME
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Animations */}
      <style>{`
        @keyframes cardRise {
          from { 
            opacity: 0; 
            transform: translateY(80px) scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-20px) scale(1.2); 
            opacity: 1;
          }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg) scale(1.1); }
          to { transform: rotate(360deg) scale(1.1); }
        }

        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .scrollbar-thin::-webkit-scrollbar { 
          width: 10px; 
        }
        .scrollbar-thin::-webkit-scrollbar-track { 
          background: rgba(31, 41, 55, 0.3); 
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb { 
          background: linear-gradient(180deg, rgba(6, 182, 212, 0.5), rgba(168, 85, 247, 0.5)); 
          border-radius: 10px; 
          border: 2px solid rgba(31, 41, 55, 0.3);
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { 
          background: linear-gradient(180deg, rgba(6, 182, 212, 0.8), rgba(168, 85, 247, 0.8)); 
        }
      `}</style>
    </>
  );
};

export default Footer;
