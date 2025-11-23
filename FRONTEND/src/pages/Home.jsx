
import React, { useState, useEffect, useRef } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaLeaf, FaHandshake, FaSeedling, FaTractor, FaTruck, FaCloudSun, FaArrowRight } from 'react-icons/fa';
import { SiOpenai } from "react-icons/si";

// --- ASSET IMPORTS ---
import one from '../assets/1.jpg';
import two from '../assets/2.jpg';
import three from '../assets/3.jpg';
import four from '../assets/4.jpg';
import five from '../assets/5.jpg';
import six from '../assets/6.jpg';
import Agri from '../assets/agri.jpg';

// --- COMPONENT: FEATURE CARD ---
const FeatureCard = ({ img, title, description, icon }) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group border-b-4 border-green-600 h-full flex flex-col">
      <div className="relative overflow-hidden h-56">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute top-0 right-0 bg-green-600 text-white p-3 rounded-bl-2xl z-10 text-2xl shadow-lg">
          {icon}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6 bg-gradient-to-b from-white to-green-50 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-green-800 mb-3 group-hover:text-green-600 transition-colors">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

// --- COMPONENT: PRODUCT CARD ---
const ProductCard = ({ img, name, description }) => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100 h-full flex flex-col">
      <div className="relative h-52">
        <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-300" />
        <span className="absolute top-3 left-3 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm tracking-wide">
          ORGANIC
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{description}</p>
        <button className="w-full py-2.5 bg-green-50 text-green-700 text-sm font-bold rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 border border-green-200 flex items-center justify-center gap-2 group/btn">
          View Details 
          <FaArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [showFeatures, setShowFeatures] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const featuresRef = useRef(null);
  const productsRef = useRef(null);

  // --- INTERSECTION OBSERVER FOR ANIMATIONS ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === featuresRef.current && entry.isIntersecting) setShowFeatures(true);
          if (entry.target === productsRef.current && entry.isIntersecting) setShowProducts(true);
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (productsRef.current) observer.observe(productsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="font-sans text-gray-800 mt-20 bg-stone-50">
      
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative w-full h-[90vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Carousel
            autoPlay infiniteLoop showThumbs={false} showStatus={false}
            interval={4000} transitionTime={800} stopOnHover={false}
            showArrows={false} showIndicators={false}
            animationHandler="fade"
          >
            {[one, two, three, four, five, six].map((img, index) => (
              <div key={index} className="relative w-full h-[90vh]">
                <img src={img} alt={`Farm Slide ${index}`} className="w-full h-full object-cover" />
                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
              </div>
            ))}
          </Carousel>
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="bg-black/20 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 max-w-5xl shadow-2xl animate-[fadeIn_1s_ease-out]">
            <span className="text-green-400 font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
              The Future of Indian Agriculture
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
              FARMIO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-300 to-green-400 animate-pulse">
                Empowering Kisan
              </span>
            </h1>
            <p className="text-gray-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed text-shadow-sm">
              Connecting farmers directly to the market with AI-driven crop diagnosis, transparent land listing, and fair pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <button 
                onClick={() => window.location.href='/lands'} 
                className="px-8 py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all shadow-lg hover:shadow-green-500/40 hover:-translate-y-1 flex items-center gap-2"
              >
                <FaTractor /> Explore Lands
              </button>
              <button 
                onClick={() => window.location.href='/product'}
                className="px-8 py-4 bg-white text-green-800 font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-1 flex items-center gap-2"
              >
                <FaLeaf /> Buy Fresh Produce
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section
        ref={featuresRef}
        className={`py-24 relative transition-all duration-1000 ease-out ${showFeatures ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#166534_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-green-900 mb-4">Cultivating Trust</h2>
            <div className="h-1.5 w-24 bg-yellow-500 mx-auto rounded-full mb-6" />
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We blend traditional farming wisdom with cutting-edge technology to provide the tools modern farmers need to succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                img: one,
                title: 'Direct Farmer Access',
                description: 'Eliminating middlemen to ensure farmers get the best price and consumers get the freshest produce straight from the harvest.',
                icon: <FaHandshake />,
              },
              {
                img: two,
                title: 'Fasal Jaanch (AI Doctor)',
                description: 'Our AI-powered tool scans crops to detect diseases early. Upload a photo and get instant cure suggestions to save your harvest.',
                icon: <FaSeedling />,
              },
              {
                img: three,
                title: 'Smart Land Listing',
                description: 'A transparent marketplace to buy, sell, or lease agricultural land with verified data, maps, and location analytics.',
                icon: <FaTractor />,
              },
              {
                img: four,
                title: 'Sustainable Growth',
                description: 'Promoting eco-friendly farming techniques, organic fertilizers, and water conservation for a healthier planet.',
                icon: <FaLeaf />,
              },
              {
                img: five,
                title: 'Fast Logistics',
                description: 'Efficient supply chain network ensuring minimal wastage from farm to fork with real-time tracking.',
                icon: <FaTruck />,
              },
              {
                img: six,
                title: 'Weather Insights',
                description: 'Real-time hyper-local weather forecasting to help you plan your sowing, irrigation, and harvesting schedules.',
                icon: <FaCloudSun />,
              },
            ].map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PRODUCTS SECTION ==================== */}
      <section
        ref={productsRef}
        className={`py-24 bg-[#1a4731] relative transition-all duration-1000 ease-out ${showProducts ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Background Image Overlay */}
        <div className="absolute inset-0 overflow-hidden">
           <img src={Agri} alt="bg" className="w-full h-full object-cover opacity-10 mix-blend-overlay" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-green-700/50 pb-6">
            <div className="text-center md:text-left w-full md:w-auto">
              <h2 className="text-4xl font-bold text-white mb-2">Fresh Harvest</h2>
              <p className="text-green-200 text-lg">Straight from the fields to your doorstep.</p>
            </div>
            <button className="mt-6 md:mt-0 px-8 py-3 border-2 border-white/30 text-white rounded-full hover:bg-white hover:text-green-900 transition-all font-semibold hover:border-white">
              View All Products →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { img: one, name: 'Desi Tomatoes', description: 'Naturally ripened, pesticide-free local tomatoes ideal for curries.' },
              { img: two, name: 'Organic Spinach', description: 'Iron-rich green leaves, harvested at sunrise for maximum crunch.' },
              { img: three, name: 'Farm Carrots', description: 'Sweet and crunchy carrots, perfect for salads and healthy snacking.' },
              { img: four, name: 'Kashmiri Apples', description: 'Premium quality crisp apples directly from the valley orchards.' },
            ].map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PARTNER/CTA SECTION ==================== */}
      <section className="py-24 px-4 bg-stone-100">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-[2.5rem] p-10 md:p-20 flex flex-col lg:flex-row items-center justify-between shadow-2xl relative overflow-hidden group hover:shadow-orange-500/20 transition-shadow duration-500">
            
            {/* Abstract Circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 text-center lg:text-left mb-10 lg:mb-0 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Are you a Farmer?
              </h2>
              <p className="text-white/90 text-lg md:text-xl leading-relaxed font-medium">
                Join the <span className="font-black text-white">FARMIO Revolution</span>. List your products, check crop health using AI, and sell directly to buyers without commissions.
              </p>
            </div>
            
            <div className="relative z-10">
              <a
                href="tel:+919560472926"
                className="inline-flex items-center px-10 py-5 bg-white text-orange-600 text-lg font-bold rounded-full shadow-xl hover:bg-orange-50 hover:scale-105 transition-all duration-300 group/btn"
              >
                <FaHandshake className="mr-3 text-2xl group-hover/btn:rotate-12 transition-transform" />
                Join Partner Program
              </a>
            </div>
          </div>
        </div>
      </section>

{/* chat bot button */}
      <div className="fixed bottom-5 left-8 z-50 animate-bounce-slow">
  <button
    onClick={() => window.location.href = '/chatbot'}
    className="flex items-center gap-3 pl-5 pr-2 py-2 bg-gray-900 text-white rounded-full shadow-2xl border-2 border-green-500 hover:scale-105 hover:bg-gray-800 transition-all group shadow-green-500/30 cursor-pointer"
  >
    <span className="font-bold text-sm tracking-wide">Chatbot</span>
    <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner">
      {/* React Icon for Robot */}
      <SiOpenai className="text-white text-sm" /> 
    </div>
  </button>
</div>

      {/* CSS Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

    </div>
  );
};

export default Home;