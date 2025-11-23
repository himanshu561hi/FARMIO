import React from "react";
import Footer from "./Footer.jsx";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-6 py-16 mt-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-500">Effective Date: November 22, 2025</p>
        </div>

        <div className="space-y-10 text-slate-600 leading-relaxed text-lg">
          
          <p>
            At <strong>Farmio</strong>, accessible from our website/app, one of our main priorities is the privacy of our visitors. 
            This Privacy Policy document contains types of information that is collected and recorded by Farmio and how we use it.
          </p>

          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-3 bg-slate-50 p-6 rounded-xl">
              <li><strong>Personal Data:</strong> Name, Email address, Phone number (for login and connecting with sellers).</li>
              <li><strong>Media:</strong> Photos of crops uploaded for disease detection.</li>
              <li><strong>Location Data:</strong> GPS coordinates to show nearby lands, weather forecasts, and mandi prices.</li>
              <li><strong>Usage Data:</strong> Information on how you use the app (e.g., search history).</li>
            </ul>
          </section>

          {/* 2. How We Use Your Data */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Data</h2>
            <p className="mb-3">We use the collected data to:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-bold text-green-700">Provide Services</h3>
                <p className="text-sm">To calculate distance to lands and show local weather.</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-bold text-green-700">Improve AI</h3>
                <p className="text-sm">Crop images help us train our AI models for better accuracy.</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-bold text-green-700">Communication</h3>
                <p className="text-sm">To connect buyers with sellers and send price alerts.</p>
              </div>
            </div>
          </section>

          {/* 3. Sharing Data */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Third-Party Sharing</h2>
            <p>
              We <strong>do not sell</strong> your personal data. However, we share data with essential third-party services to run the app:
            </p>
            <ul className="list-disc pl-6 mt-3">
              <li><strong>Google Maps / OpenStreetMap:</strong> To render maps and calculate routes.</li>
              <li><strong>Cloudinary:</strong> To securely store uploaded images.</li>
              <li><strong>Authentication Services:</strong> To verify user identity.</li>
            </ul>
          </section>

          {/* 4. Security */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
            <p>
              We use industry-standard security measures (like HTTPS and JWT Encryption) to protect your personal information. 
              However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          {/* 5. Contact Us */}
          <section className="bg-slate-900 text-white p-8 rounded-2xl text-center mt-10">
            <h2 className="text-xl font-bold mb-2">Have Questions?</h2>
            <p className="mb-4 text-slate-300">If you have any questions about our Privacy Policy, please contact us:</p>
            <a href="mailto:ag0567688@gmail.com" className="bg-green-600 px-6 py-2 rounded-full font-bold hover:bg-green-500 transition">
              ag0567688@gmail.com
            </a>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;