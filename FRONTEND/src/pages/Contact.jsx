import React from 'react';
import { FaEnvelope, FaMobileAlt, FaWhatsapp, FaGlobeAmericas, FaMapMarkerAlt, FaSeedling } from 'react-icons/fa';
// 1. Footer Component Import
import Footer from './Footer'; 


// --- HELPER COMPONENT: Contact Detail Card (Included for completeness) ---
const ContactCard = ({ icon, title, detail, type }) => {
  const href = type === 'mailto' ? `mailto:${detail}` :
               type === 'tel' ? `tel:${detail.replace(/\s/g, '')}` :
               type === 'whatsapp' ? `https://wa.me/${detail.replace(/\s/g, '').replace('+', '')}` : '#';

  return (
    <div className="p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-green-500/30">
      <a href={href} target={type !== 'text' ? "_blank" : "_self"} className="flex items-center gap-4 group">
        <div className="text-xl text-green-400 group-hover:text-green-300 transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">{detail}</p>
        </div>
      </a>
    </div>
  );
};

const Contact = () => {
  // Custom styles for input autofill issue fix (prevents white background)
  const customStyles = {
    inputBg: {
      WebkitBoxShadow: '0 0 0 1000px #f1f5f9 inset', 
      WebkitTextFillColor: '#1e293b', 
    }
  };

  return (
    // 2. MAIN FLEX WRAPPER: Ensures footer is pushed to the bottom
    <div className="flex flex-col min-h-screen w-full"> 
      
      {/* --- PAGE CONTENT SECTION (Adjusted Padding for Fixed Navbar) --- */}
      <div name="contact" className="w-full text-white bg-gray-900 pt-24 pb-12 flex-grow">
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="mb-16 text-center pt-10">
            <p className="text-green-400 font-bold text-lg uppercase tracking-widest mb-3">
              Get in Touch
            </p>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
              Connect With The Farmio Team
            </h1>
            <p className="text-xl mt-6 text-gray-300 max-w-3xl mx-auto">
              We are here to help you revolutionize your agriculture journey.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col-reverse md:flex-row justify-between gap-12">
            
            {/* LEFT COLUMN: Form */}
            <div className="w-full md:w-[45%] lg:w-1/2 flex justify-center">
              <form 
                action="https://getform.io/f/amddkgwb" 
                method="POST"
                className="w-full max-w-lg p-8 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 transition-all duration-300 hover:border-green-500/50"
                style={{ backdropFilter: "blur(10px)" }}
              >
                <h3 className="text-2xl font-bold mb-8 text-green-400 border-b border-green-700/50 pb-3 flex items-center gap-2">
                  <FaSeedling /> Send Us a Message
                </h3>
                
                {/* Input Fields */}
                {[
                  { label: "Name", type: "text", name: "name", placeholder: "Your full name" },
                  { label: "Email", type: "email", name: "email", placeholder: "Your email" },
                  { label: "Mobile Number", type: "tel", name: "mobile", placeholder: "Your mobile number", pattern: "^[7-9][0-9]{9}$", title: "Enter a valid Indian mobile number starting with 7, 8, or 9" }
                ].map(({ label, type, name, placeholder, pattern, title }) => (
                  <div className="mb-6 group" key={name}>
                    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
                      {label}
                    </label>
                    <input 
                      type={type} 
                      name={name} 
                      id={name} 
                      required 
                      placeholder={placeholder} 
                      pattern={pattern}
                      title={title}
                      style={customStyles.inputBg}
                      className="w-full px-4 py-3 mt-1 bg-white text-gray-800 rounded-xl focus:ring-4 focus:ring-green-400 focus:border-green-400 focus:outline-none transition-shadow duration-300 placeholder:text-gray-500"
                    />
                  </div>
                ))}
                
                {/* Gender Dropdown */}
                <div className="mb-6 group">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <select 
                    name="gender" 
                    id="gender" 
                    required 
                    className="w-full px-4 py-3 mt-1 bg-white text-gray-800 rounded-xl focus:ring-4 focus:ring-green-400 focus:outline-none transition-shadow duration-300"
                  >
                    <option value="" className="text-gray-500">Select Gender</option>
                    <option value="male" className="text-gray-800">Male</option>
                    <option value="female" className="text-gray-800">Female</option>
                    <option value="other" className="text-gray-800">Other</option>
                  </select>
                </div>

                {/* Message Textarea */}
                <div className="mb-6 group">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea 
                    name="message" 
                    id="message" 
                    required 
                    placeholder="Enter your message" 
                    rows="4" 
                    className="w-full px-4 py-3 mt-1 bg-white text-gray-800 rounded-xl focus:ring-4 focus:ring-green-400 focus:outline-none transition-shadow duration-300 placeholder:text-gray-500"
                    style={customStyles.inputBg}
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full py-3 mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-green-500/30 hover:scale-[1.01] hover:shadow-green-500/60 transition-transform duration-300"
                >
                  Connect Me
                </button>
              </form>
            </div>
            
            {/* RIGHT COLUMN: Info & Map */}
            <div className="w-full md:w-[55%] lg:w-1/2">
              
              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <ContactCard icon={<FaEnvelope />} title="Email" detail="ag0567688@gmail.com" type="mailto" />
                <ContactCard icon={<FaMobileAlt />} title="Mobile" detail="+91 9560472926" type="tel" />
                <ContactCard icon={<FaWhatsapp />} title="WhatsApp" detail="+91 9560472926" type="whatsapp" />
                <ContactCard icon={<FaMapMarkerAlt />} title="Location" detail="Ghaziabad, UP" type="text" />
              </div>

              {/* Address */}
              <div className="mb-10 text-center md:text-left p-6 bg-white/10 rounded-xl border border-white/10">
                <h2 className="font-bold text-white text-2xl mb-2 flex items-center gap-2 justify-center md:justify-start">
                  <FaGlobeAmericas className="text-green-400"/> Corporate Address
                </h2>
                <p className="font-semibold text-gray-300 text-lg">
                  Plot No. 766, 26th KM Milestone, NH-9, 
                  <br />
                  Ghaziabad, Uttar Pradesh – 201015
                </p>
              </div>
              
              {/* Map */}
              <div className="map-container rounded-xl shadow-2xl shadow-gray-900/50 overflow-hidden border-2 border-green-500/30 hover:shadow-cyan-500/20 transition-shadow duration-300 ease-in-out">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.545251972305!2d77.49128877566565!3d28.673331882226368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf2c4cac27f99%3A0xd9961659aee6d5b2!2sHi-Tech%20Institute%20of%20Engineering%20%26%20Technology!5e0!3m2!1sen!2sin!4v1739723721387!5m2!1sen!2sin" width="100%" height="450" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full h-full"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 3. FOOTER COMPONENT */}
      <Footer /> 
    </div>
  );
};

export default Contact;