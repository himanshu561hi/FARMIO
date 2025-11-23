
import React from "react";
// FIX: FaLandMineOn removed, replaced with FaMapMarkedAlt (valid icon)
import { FaShieldAlt, FaMapMarkedAlt, FaMoneyBillWave, FaExclamationTriangle } from "react-icons/fa"; 
import Footer from "../pages/Footer"; 

const Disclaimer = () => {
  return (
    // Main Flex Wrapper to ensure footer sticks to the bottom
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 font-sans">
      
      {/* Page Content Container (pt-24 for fixed Navbar clearance) */}
      <div className="flex-grow max-w-4xl mx-auto px-6 py-16 pt-24 w-full">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-2">Disclaimer</h1>
          <p className="text-gray-600 font-medium">Last Updated: November 2025</p>
        </div>

        <div className="space-y-8 text-slate-700 leading-relaxed text-base">
          
          {/* 1. General Information (Standard) */}
          <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <FaShieldAlt className="text-gray-500"/> 1. General Information
            </h2>
            <p>
              The information provided by <strong>Farmio</strong> ("we," "us," or "our") on this website and mobile application 
              is for general informational purposes only. All information is provided in good faith, however, we make no representation 
              or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, or completeness of any information on the Site.
            </p>
          </section>

          {/* 2. AI Disease Detection (High Risk/Warning) */}
          <section className="bg-yellow-50 p-8 rounded-2xl border border-yellow-200 border-l-4 border-l-red-500 shadow-lg">
            <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-3">
              <FaExclamationTriangle className="text-red-500"/> 2. AI & Agricultural Advice
            </h2>
            <p className="mb-3 font-medium text-gray-800">
              The <strong>"Fasal Jaanch" (AI Plant Doctor)</strong> feature uses Artificial Intelligence to analyze crop images. 
              While we strive for accuracy, AI models can make errors.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>The suggestions provided are <strong className="text-red-600">not a substitute for professional agricultural advice</strong>.</li>
              <li>Always consult with a certified agronomist or agricultural expert before using chemical pesticides.</li>
              <li>Farmio is not liable for any crop loss or damage resulting from reliance on AI-generated advice.</li>
            </ul>
          </section>

          {/* 3. Land Marketplace (Due Diligence Required) */}
          <section className="bg-blue-50 p-8 rounded-2xl border border-blue-200 border-l-4 border-l-blue-500 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-3">
              <FaMapMarkedAlt className="text-blue-500"/> 3. Land Listings & Transactions
            </h2>
            <p className="mb-3">
              Farmio acts as a connecting platform between Buyers and Sellers. We do not own or verify the lands listed.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Verification:</strong> Buyers must independently verify land ownership, legal documents, and government records.</li>
              <li><strong>Financial Risks:</strong> Farmio is not responsible for any financial fraud or disputes between parties.</li>
              <li>We do not charge brokerage; all deals are directly between the user and the seller.</li>
            </ul>
          </section>

          {/* 4. Financial Data (Mandi/Loan) */}
          <section className="bg-white p-8 rounded-2xl border border-green-300/50 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <FaMoneyBillWave className="text-green-600"/> 4. Mandi Prices & Financial Tools
            </h2>
            <p className="font-medium text-gray-800">
              <strong>Mandi Prices:</strong> Market rates fluctuate daily. The prices shown on Farmio are indicative and sourced from available data feeds. Actual ground prices may vary.
              <br /><br />
              <strong>Loan Calculator:</strong> The EMI figures are estimates. Actual loan terms depend on the bank's policies and your credit profile.
            </p>
          </section>

          <div className="text-center pt-10 border-t border-slate-200">
            <p className="text-base text-green-700 font-medium">
              By using Farmio, you hereby consent to our disclaimer and agree to its terms.
            </p>
          </div>

        </div>
      </div>
      
      {/* 3. FOOTER COMPONENT */}
      <Footer />
    </div>
  );
};

export default Disclaimer;