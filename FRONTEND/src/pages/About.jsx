import React from "react";
import Footer from "./Footer.jsx";

const About = () => {
  
  // --- DATA: Developers ---
  const developers = [
    {
      name: "Aman Gupta",
      role: "Founder & Full Stack Developer",
      image: "https://media.licdn.com/dms/image/v2/D5603AQHP4oPVYUgMoQ/profile-displayphoto-scale_400_400/B56ZomDerZJoAg-/0/1761575039524?e=1765411200&v=beta&t=nsEv0Qqg8iqNYQfa7iy7tZhm8Dexp71hbBmaeNeyIzI",
      bio: "Expert in AI integration and scalable architecture. Passionate about bridging the gap between technology and agriculture.",
      theme: "blue",
      links: {
        linkedin: "https://www.linkedin.com/in/amangupta9454/", 
        github: "https://github.com/amangupta9454",
        email: "mailto:ag0567688@gmail.com"
      }
    },
    {
      name: "Himanshu Gupta",
      role: "Co-Founder & Full Stack Developer",
      image: "https://media.licdn.com/dms/image/v2/D5603AQEFGOkd48NZ5Q/profile-displayphoto-shrink_400_400/B56ZcQbCNsHgAg-/0/1748327212830?e=1765411200&v=beta&t=Jj-0U0lRMX_8QxYqiluFosoA5_SGdrz-i8vHRgL3fZo",
      bio: "Building Farmio to empower the Indian agricultural community with modern MERN stack technology and intuitive design.",
      theme: "green",
      links: {
        linkedin: "https://www.linkedin.com/in/himanshu561hi/", 
        github: "https://github.com/himanshu561hi",
        email: "mailto:himanshu561hi@gmail.com"
      }
    }
  ];

  // --- DATA: Features (Updated based on your Screenshots) ---
  const features = [
    {
      title: "Fasal Jaanch (AI Doctor)",
      desc: "Instant crop disease diagnosis. Simply upload a photo of your plant, and our AI identifies the problem and suggests a cure instantly.",
      icon: "🩺",
      color: "green"
    },
    {
      title: "Land Listing",
      desc: "A transparent marketplace to buy, sell, or rent agricultural land. View locations on a map and contact sellers directly.",
      icon: "🏞️",
      color: "blue"
    },
    {
      title: "Agri Products",
      desc: "Buy and sell farming essentials like seeds, fertilizers, and machinery. A dedicated e-commerce hub for farmers.",
      icon: "🚜",
      color: "orange"
    },
    {
      title: "Mandi Prices",
      desc: "Stay updated with real-time market rates (Mandi Bhav) for various crops across different regions to ensure you sell at the best price.",
      icon: "💰",
      color: "yellow"
    },
    {
      title: "Weather Forecast",
      desc: "Accurate weather predictions to help you plan sowing, irrigation, and harvesting activities efficiently.",
      icon: "🌦️",
      color: "sky"
    },
    {
      title: "Loan Calculator & AI",
      desc: "Financial tools to calculate loan EMIs and a smart AI Assistant to answer all your farming queries 24/7.",
      icon: "🤖",
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 selection:bg-green-100 selection:text-green-900">
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 mt-16">
        
        {/* 1. HERO SECTION */}
        <section className="text-center mb-24 max-w-3xl mx-auto animate-fade-in-up">
          <span className="text-green-600 font-bold text-sm uppercase tracking-[0.2em] mb-4 block">
            About Farmio
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Simplifying Agriculture for <span className="text-green-600">Everyone</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed">
            We are building a digital ecosystem to help farmers detect crop diseases instantly, 
            trade land & products transparently, and access smart financial tools.
          </p>
        </section>

        {/* 2. MISSION SECTION */}
        <section className="flex flex-col md:flex-row items-center gap-12 mb-24">
          <div className="w-full md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop" 
              alt="Modern Farming" 
              className="w-full h-auto rounded-2xl shadow-xl border border-slate-100 hover:scale-[1.02] transition-transform duration-500" 
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
              <p>
                Agriculture is the backbone of our economy, yet farmers often struggle with technical challenges like 
                identifying crop diseases, finding fair market prices, and accessing financial planning tools.
              </p>
              <p>
                Farmio solves this by integrating <span className="font-semibold text-green-700">AI Tools, Marketplaces, and Financial Calculators</span> into 
                one simple platform. Our goal is to put technology into every farmer's hand.
              </p>
            </div>
          </div>
        </section>

        {/* 3. WHAT WE OFFER (Updated Features) */}
        <section className="bg-slate-50 rounded-3xl p-8 md:p-16 mb-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Everything You Need</h2>
            <p className="text-slate-500 mt-2 text-lg">Comprehensive solutions for the modern agricultural ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Dynamic Color Classes workaround or inline style for icon bg */}
                <div className={`w-14 h-14 text-3xl flex items-center justify-center rounded-xl mb-6`} 
                     style={{ backgroundColor: `var(--tw-color-${feature.color}-100)`, color: feature.color === 'white' ? 'black' : '' }}>
                     {/* Fallback bg color style if tailwind classes aren't generating dynamically */}
                     <span className="p-3 rounded-xl bg-slate-100">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

         

        {/* CTA */}
        <div className="text-center border-t border-slate-200 pt-12">
          <p className="text-slate-600 mb-4">Ready to start your journey?</p>
          <button 
            onClick={() => window.location.href = '/join-us'}
            className="bg-slate-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 duration-200"
          >
            Join Farmio Today
          </button>
        </div>

      </div>
        {/* Footer Component */}
        <Footer />
    </div>
  );
};

export default About;