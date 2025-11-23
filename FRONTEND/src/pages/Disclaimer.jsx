import React from "react";
import Footer from "./Footer.jsx";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-6 py-16 mt-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Disclaimer</h1>
          <p className="text-slate-500">Last Updated: November 2025</p>
        </div>

        <div className="space-y-8 text-slate-600 leading-relaxed text-lg">
          
          {/* 1. General */}
          <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. General Information</h2>
            <p>
              The information provided by <strong>Farmio</strong> ("we," "us," or "our") on this website and mobile application 
              is for general informational purposes only. All information is provided in good faith, however, we make no representation 
              or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, or completeness of any information on the Site.
            </p>
          </section>

          {/* 2. AI Disease Detection (Crucial) */}
          <section className="bg-red-50 p-8 rounded-2xl border border-red-100">
            <h2 className="text-2xl font-bold text-red-700 mb-4">2. AI & Agricultural Advice</h2>
            <p className="mb-3">
              The <strong>"Fasal Jaanch" (AI Plant Doctor)</strong> feature uses Artificial Intelligence to analyze crop images. 
              While we strive for accuracy, AI models can make errors.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The suggestions provided are <strong>not a substitute for professional agricultural advice</strong>.</li>
              <li>Always consult with a certified agronomist or agricultural expert before using chemical pesticides.</li>
              <li>Farmio is not liable for any crop loss or damage resulting from reliance on AI-generated advice.</li>
            </ul>
          </section>

          {/* 3. Land Marketplace */}
          <section className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">3. Land Listings & Transactions</h2>
            <p className="mb-3">
              Farmio acts as a connecting platform between Buyers and Sellers. We do not own or verify the lands listed.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Verification:</strong> Buyers must independently verify land ownership, legal documents, and government records.</li>
              <li><strong>Financial Risks:</strong> Farmio is not responsible for any financial fraud or disputes between parties.</li>
              <li>We do not charge brokerage; all deals are directly between the user and the seller.</li>
            </ul>
          </section>

          {/* 4. Financial Data */}
          <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Mandi Prices & Financial Tools</h2>
            <p>
              <strong>Mandi Prices:</strong> Market rates fluctuate daily. The prices shown on Farmio are indicative and sourced from available data feeds. Actual ground prices may vary.
              <br /><br />
              <strong>Loan Calculator:</strong> The EMI figures are estimates. Actual loan terms depend on the bank's policies and your credit profile.
            </p>
          </section>

          <div className="text-center pt-10 border-t border-slate-200">
            <p className="text-sm text-slate-400">
              By using Farmio, you hereby consent to our disclaimer and agree to its terms.
            </p>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Disclaimer;