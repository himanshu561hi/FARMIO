import React from "react";
import Footer from "../pages/Footer"; // Assuming Footer is in ../components
import { FaShieldAlt, FaMapMarkedAlt, FaLightbulb, FaCloud, FaDatabase, FaSatelliteDish, FaRegComment, FaEnvelope } from "react-icons/fa"; // Added icons for clarity

const PrivacyPolicy = () => {
  return (
    // Main Flex Wrapper to ensure footer sticks to the bottom
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 font-sans">
      
      {/* Page Content Container (pt-24 for fixed Navbar clearance) */}
      <div className="flex-grow max-w-4xl mx-auto px-6 py-16 pt-24 w-full">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 font-medium">Effective Date: November 22, 2025</p>
        </div>

        <div className="space-y-10 text-slate-700 leading-relaxed text-base">
          
          <p className="text-lg mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            At <strong>Farmio</strong>, accessible from our website/app, one of our main priorities is the privacy of our visitors. 
            This document outlines the types of information we collect and how we use it to provide our services.
          </p>

          {/* 1. Information We Collect */}
          <section className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <FaDatabase className="text-green-600"/> 1. Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li className="text-base"><strong>Personal Data:</strong> Name, Email address, Phone number (for login and connecting with sellers).</li>
              <li className="text-base"><strong>Media:</strong> Photos of crops uploaded for disease detection (used solely for AI analysis).</li>
              <li className="text-base"><strong>Location Data:</strong> GPS coordinates to show nearby lands, weather forecasts, and mandi prices.</li>
              <li className="text-base"><strong>Usage Data:</strong> Information on how you use the app (e.g., search history).</li>
            </ul>
          </section>

          {/* 2. How We Use Your Data */}
          <section className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <FaLightbulb className="text-yellow-600"/> 2. How We Use Your Data
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <UsageCard icon={<FaSatelliteDish />} title="Provide Services" description="To calculate distance to lands and show local weather/mandi prices." theme="blue" />
              <UsageCard icon={<FaRegComment />} title="Communication" description="To connect buyers with sellers and send important price alerts." theme="green" />
              <UsageCard icon="🧠" title="Improve AI" description="Crop images help us train our AI models for better accuracy and agricultural insights." theme="purple" />
              <UsageCard icon="🔒" title="Verify Transactions" description="Ensuring secure connections and verifying user identity and roles." theme="slate" />
            </div>
          </section>

          {/* 3. Sharing Data */}
          <section className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <FaCloud className="text-cyan-600"/> 3. Third-Party Sharing
            </h2>
            <p className="mb-4">
              We <strong className="text-green-700">do not sell</strong> your personal data. However, we share data with essential third-party services to run the app:
            </p>
            <ul className="list-disc pl-6 mt-3 text-sm space-y-2">
              <li><strong>Google Maps / OpenStreetMap:</strong> To render maps and calculate routes.</li>
              <li><strong>Cloudinary:</strong> To securely store uploaded images (e.g., profile pictures, land photos).</li>
              <li><strong>Authentication Services:</strong> To verify user identity.</li>
            </ul>
          </section>

          {/* 4. Security */}
          <section className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <FaShieldAlt className="text-emerald-600"/> 4. Data Security
            </h2>
            <p className="text-base">
              We use industry-standard security measures (like HTTPS and JWT Encryption) to protect your personal information. 
              However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          {/* 5. Contact Us */}
          <section className="bg-slate-900 text-white p-8 rounded-2xl text-center mt-10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Have Questions?</h2>
            <p className="mb-4 text-slate-300">If you have any questions about our Privacy Policy, please contact us:</p>
            <a href="mailto:ag0567688@gmail.com" 
               className="bg-green-600 px-6 py-3 rounded-full font-bold hover:bg-green-500 transition shadow-lg transform hover:scale-[1.02]">
              <FaEnvelope className="inline mr-2" /> ag0567688@gmail.com
            </a>
          </section>

        </div>
      </div>
      
      {/* 5. FOOTER COMPONENT (Positioned outside main content) */}
      <Footer /> 
    </div>
  );
};

// --- HELPER COMPONENT: Usage Card ---
const UsageCard = ({ icon, title, description, theme }) => (
    <div className={`p-4 border border-slate-200 rounded-xl bg-white transition-shadow duration-300 hover:shadow-md`}>
      <h3 className={`font-bold text-${theme}-700 flex items-center gap-2 mb-1`}>
          <span className={`text-${theme}-500 text-xl`}>{icon}</span> {title}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
);

export default PrivacyPolicy;