// import React, { useState } from "react";
// import {
//   FaSearchLocation,
//   FaTemperatureHigh,
//   FaCloud,
//   FaTint,
//   FaWind,
//   FaSun,
//   FaRegClock,
//   FaCompressArrowsAlt,
//   FaMapMarkerAlt,
//   FaExclamationTriangle,
// } from "react-icons/fa";
// import axios from "axios";
// import backgroundImage from "../assets/1.jpg"; // Adjust path if needed

// const WeatherApp = () => {
//   const [location, setLocation] = useState("");
//   const [weatherData, setWeatherData] = useState([]);
//   const [currentWeather, setCurrentWeather] = useState(null);
//   const [lang, setLang] = useState("en");
//   const [unit, setUnit] = useState("metric");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const translations = {
//     en: {
//       heading: "🌾 Farmer-Friendly Weather App",
//       placeholder: "Enter Pincode / Village / District",
//       search: "Search",
//       geolocation: "Use My Location",
//       error: "Location not found. Please enter a valid pincode, village, or district name.",
//       networkError: "Network error. Please check your connection and try again.",
//       geolocationError: "Unable to fetch location. Please allow location access or enter a location manually.",
//       currentWeather: "Current Weather",
//       forecast: "5-Day Forecast",
//       date: "Date",
//       description: "Description",
//       temperature: "Temperature",
//       humidity: "Humidity",
//       wind: "Wind Speed",
//       maxMin: "Max/Min Temp",
//       cloudiness: "Cloudiness",
//       pressure: "Pressure",
//       visibility: "Visibility",
//       dewPoint: "Dew Point",
//       feelsLike: "Feels Like",
//       alerts: "Weather Alerts",
//       noAlerts: "No active weather alerts.",
//       farmingTips: "Farming Tips",
//       loading: "Loading...",
//       celsius: "Celsius",
//       fahrenheit: "Fahrenheit",
//       tips: {
//         highTemp: "High temperatures detected. Ensure crops are well-watered and consider shade nets.",
//         lowHumidity: "Low humidity may dry out soil. Increase irrigation frequency.",
//         highWind: "Strong winds expected. Secure loose equipment and check crop supports.",
//         rain: "Rain expected. Delay fertilizer application to avoid runoff.",
//       },
//     },
//     hi: {
//       heading: "🌾 किसान-अनुकूल मौसम ऐप",
//       placeholder: "पिनकोड / गाँव / जिला दर्ज करें",
//       search: "खोजें",
//       geolocation: "मेरी स्थिति का उपयोग करें",
//       error: "स्थान नहीं मिला। कृपया वैध पिनकोड, गाँव या जिला नाम दर्ज करें।",
//       networkError: "नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।",
//       geolocationError: "स्थान प्राप्त करने में असमर्थ। कृपया स्थान पहुंच की अनुमति दें या मैन्युअल रूप से स्थान दर्ज करें।",
//       currentWeather: "वर्तमान मौसम",
//       forecast: "5-दिन का पूर्वानुमान",
//       date: "तारीख",
//       description: "विवरण",
//       temperature: "तापमान",
//       humidity: "नमी",
//       wind: "हवा की गति",
//       maxMin: "अधिकतम/न्यूनतम ताप",
//       cloudiness: "बादल",
//       pressure: "दबाव",
//       visibility: "दृश्यता",
//       dewPoint: "ओस बिंदु",
//       feelsLike: "महसूस होता है",
//       alerts: "मौसम चेतावनियाँ",
//       noAlerts: "कोई सक्रिय मौसम चेतावनी नहीं।",
//       farmingTips: "कृषि सुझाव",
//       loading: "लोड हो रहा है...",
//       celsius: "सेल्सियस",
//       fahrenheit: "फ़ारेनहाइट",
//       tips: {
//         highTemp: "उच्च तापमान का पता चला। सुनिश्चित करें कि फसलें अच्छी तरह से पानी पिलाई गई हैं और छाया जाल का उपयोग करें।",
//         lowHumidity: "कम नमी मिट्टी को सुखा सकती है। सिंचाई की आवृत्ति बढ़ाएँ।",
//         highWind: "तेज़ हवाएँ अपेक्षित। ढीले उपकरणों को सुरक्षित करें और फसल सहारों की जाँच करें।",
//         rain: "बारिश की उम्मीद। रनऑफ से बचने के लिए उर्वरक प्रयोग में देरी करें।",
//       },
//     },
//     bho: {
//       heading: "🌾 किसान के लिये मौसम ऐप",
//       placeholder: "पिनकोड / गाँव / जिला डालs",
//       search: "खोजs",
//       geolocation: "हमार लोकेशन ब्यवहार करs",
//       error: "जगह ना मिलल। कृपया सही पिनकोड, गाँव, या जिला के नाम डालs।",
//       networkError: "नेटवर्क में गड़बड़। कृपया कनेक्शन चेक करs आ पुनः कोशिश करs।",
//       geolocationError: "लोकेशन ना मिल पावे। कृपया लोकेशन के अनुमति दs या मैनुअल जगह डालs।",
//       currentWeather: "अभी के मौसम",
//       forecast: "5-दिन के पूर्वानुमान",
//       date: "तारीख",
//       description: "विवरण",
//       temperature: "तापमान",
//       humidity: "नमी",
//       wind: "हवा के गति",
//       maxMin: "ज्यादा/कम ताप",
//       cloudiness: "बादर",
//       pressure: "दबाव",
//       visibility: "दिखाई",
//       dewPoint: "ओस बिंदु",
//       feelsLike: "लागे लs",
//       alerts: "मौसम चेतावनी",
//       noAlerts: "कोई मौसम चेतावनी नइखे।",
//       farmingTips: "खेती के सुझाव",
//       loading: "लोड हो रहल बा...",
//       celsius: "सेल्सियस",
//       fahrenheit: "फारेनहाइट",
//       tips: {
//         highTemp: "ज्यादा तापमान मिलल। फसलन के अच्छे से पानी दs आ छाया जाल के ब्यवहार करs।",
//         lowHumidity: "कम नमी मिट्टी सुखा देत बा। पानी दे के बार-बार करs।",
//         highWind: "तेज़ हवा आवे वाला बा। ढीला सामान बाँधs आ फसल के सहारा चेक करs।",
//         rain: "बरखा के उम्मीद बा। खाद दे में देरी करs ताकि बह ना जाव।",
//       },
//     },
//     mr: {
//       heading: "🌾 शेतकरी-अनुकूल हवामान अॅप",
//       placeholder: "पिनकोड / गाव / जिल्हा टाका",
//       search: "शोधा",
//       geolocation: "माझे स्थान वापरा",
//       error: "स्थान सापडले नाही. कृपया वैध पिनकोड, गाव किंवा जिल्ह्याचे नाव टाका.",
//       networkError: "नेटवर्क त्रुटी. कृपया तुमचे कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.",
//       geolocationError: "स्थान मिळवण्यात अक्षम. कृपया स्थान प्रवेशास परवानगी द्या किंवा स्थान मॅन्युअली टाका.",
//       currentWeather: "सध्याचे हवामान",
//       forecast: "5-दिवसांचा अंदाज",
//       date: "तारीख",
//       description: "वर्णन",
//       temperature: "तापमान",
//       humidity: "आर्द्रता",
//       wind: "वाऱ्याचा वेग",
//       maxMin: "कमाल/किमान तापमान",
//       cloudiness: "ढग",
//       pressure: "दाब",
//       visibility: "दृश्यमानता",
//       dewPoint: "दवबिंदू",
//       feelsLike: "जाणवते",
//       alerts: "हवामान सूचना",
//       noAlerts: "कोणत्याही सक्रिय हवामान सूचना नाहीत.",
//       farmingTips: "शेती सल्ला",
//       loading: "लोड होत आहे...",
//       celsius: "सेल्सियस",
//       fahrenheit: "फॅरेनहाइट",
//       tips: {
//         highTemp: "उच्च तापमान आढळले. पिकांना पुरेसे पाणी द्या आणि छायाजाळीचा वापर करा.",
//         lowHumidity: "कम आर्द्रता माती कोरडी करू शकते. पाण्याची वारंवारता वाढवा.",
//         highWind: "जोरदार वारे अपेक्षित. सैल उपकरणे सुरक्षित करा आणि पिकांच्या आधाराची तपासणी करा.",
//         rain: "पाऊस अपेक्षित. खते देण्यास विलंब करा जेणेकरून ते वाहून जाऊ नये。",
//       },
//     },
//     bn: {
//       heading: "🌾 কৃষক-বান্ধব আবহাওয়া অ্যাপ",
//       placeholder: "পিনকোড / গ্রাম / জেলা লিখুন",
//       search: "অনুসন্ধান",
//       geolocation: "আমার অবস্থান ব্যবহার করুন",
//       error: "স্থান পাওয়া যায়নি। দয়া করে একটি বৈধ পিনকোড, গ্রাম বা জেলার নাম লিখুন।",
//       networkError: "নেটওয়ার্ক ত্রুটি। দয়া করে আপনার সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।",
//       geolocationError: "অবস্থান পেতে অক্ষম। দয়া করে অবস্থান অ্যাক্সেসের অনুমতি দিন বা ম্যানুয়ালি অবস্থান লিখুন।",
//       currentWeather: "বর্তমান আবহাওয়া",
//       forecast: "৫-দিনের পূর্বাভাস",
//       date: "তারিখ",
//       description: "বিবরণ",
//       temperature: "তাপমাত্রা",
//       humidity: "আর্দ্রতা",
//       wind: "বাতাসের গতি",
//       maxMin: "সর্বোচ্চ/সর্বনিম্ন তাপ",
//       cloudiness: "মেঘলা",
//       pressure: "চাপ",
//       visibility: "দৃশ্যমানতা",
//       dewPoint: "শিশির বিন্দু",
//       feelsLike: "অনুভূতি",
//       alerts: "আবহাওয়ার সতর্কতা",
//       noAlerts: "কোনও সক্রিয় আবহাওয়ার সতর্কতা নেই।",
//       farmingTips: "কৃষি পরামর্শ",
//       loading: "লোড হচ্ছে...",
//       celsius: "সেলসিয়াস",
//       fahrenheit: "ফারেনহাইট",
//       tips: {
//         highTemp: "উচ্চ তাপমাত্রা সনাক্ত হয়েছে। ফসল ভালভাবে জল দেওয়া নিশ্চিত করুন এবং ছায়া জাল ব্যবহার করুন।",
//         lowHumidity: "কম আর্দ্রতা মাটি শুকিয়ে দিতে পারে। সেচের ফ্রিকোয়েন্সি বাড়ান।",
//         highWind: "প্রবল বাতাস প্রত্যাশিত। আলগা সরঞ্জাম সুরক্ষিত করুন এবং ফসলের সমর্থন পরীক্ষা করুন।",
//         rain: "বৃষ্টি প্রত্যাশিত। রানঅফ এড়াতে সার প্রয়োগে বিলম্ব করুন।",
//       },
//     },
//     as: {
//       heading: "🌾 কৃষক-বন্ধুত্বপূৰ্ণ বতৰ এপ",
//       placeholder: "পিনক’ড / গাঁও / জিলা সুমুৱাওক",
//       search: "সন্ধান কৰক",
//       geolocation: "মোৰ অৱস্থান ব্যৱহাৰ কৰক",
//       error: "স্থান বিচাৰি পোৱা নগ’ল। অনুগ্ৰহ কৰি এটা বৈধ পিনক’ড, গাঁও বা জিলাৰ নাম সুমুৱাওক।",
//       networkError: "নেটৱৰ্কত ত্ৰুটি। অনুগ্ৰহ কৰি আপোনাৰ সংযোগ পৰীক্ষা কৰক আৰু পুনৰ চেষ্টা কৰক।",
//       geolocationError: "অৱস্থান লাভ কৰিবলৈ অক্ষম। অনুগ্ৰহ কৰি অৱস্থানৰ প্ৰৱেশৰ অনুমতি দিয়ক বা মেনুৱেলী অৱস্থান সুমুৱাওক।",
//       currentWeather: "বৰ্তমানৰ বতৰ",
//       forecast: "৫-দিনীয়া পূৰ্বাভাস",
//       date: "তাৰিখ",
//       description: "বিৱৰণ",
//       temperature: "তাপমাত্ৰা",
//       humidity: "আৰ্দ্ৰতা",
//       wind: "বতাহৰ গতি",
//       maxMin: "সৰ্বাধিক/সৰ্বনিম্ন তাপ",
//       cloudiness: "মেঘাচ্ছন্নতা",
//       pressure: "চাপ",
//       visibility: "দৃশ্যমানতা",
//       dewPoint: "শিশিৰ বিন্দু",
//       feelsLike: "অনুভৱ হয়",
//       alerts: "বতৰৰ সতৰ্কবাৰ্তা",
//       noAlerts: "কোনো সক্ৰিয় বতৰৰ সতৰ্কবাৰ্তা নাই।",
//       farmingTips: "কৃষি পৰামৰ্শ",
//       loading: "লোড হৈ আছে...",
//       celsius: "চেলছিয়াছ",
//       fahrenheit: "ফাৰেনহাইট",
//       tips: {
//         highTemp: "উচ্চ তাপমাত্ৰা ধৰা পৰিছে। শস্য ভালদৰে পানী দিয়ক আৰু ছাঁৰ জাল ব্যৱহাৰ কৰক।",
//         lowHumidity: "কম আৰ্দ্ৰতাই মাটি শুকুৱাব পাৰে। সিঞ্চনৰ কম্পাঙ্ক বঢ়াওক।",
//         highWind: "প্ৰবল বতাহৰ আশংকা। আলগা সঁজুলি সুৰক্ষিত কৰক আৰু শস্যৰ সমৰ্থন পৰীক্ষা কৰক।",
//         rain: "বৰষুণৰ আশংকা। প্ৰবাহৰ পৰা বাঁচিবলৈ সাৰ প্ৰয়োগত পলম কৰক।",
//       },
//     },
//     sa: {
//       heading: "🌾 कृषक-मैत्रीपूर्ण-वातावरण-संनादति",
//       placeholder: "पिनकोड् / ग्रामः / मण्डलं प्रविष्टु",
//       search: "सन्दीक्षा",
//       geolocation: "मम स्थानं संनादति",
//       error: "स्थानं न संनादति। कृपया वैधं पिनकोड्, ग्रामं वा मण्डलनाम प्रविष्टु।",
//       networkError: "सञ्जालदोषः। कृपया संनादनं परीक्ष्य पुनः प्रयत्नतु।",
//       geolocationError: "स्थानं प्राप्नुं न शक्यति। कृपया स्थानप्रवेशस्य अनुज्ञां ददातु अथवा मैन्युअलरूपेण स्थानं प्रविष्टु।",
//       currentWeather: "वर्तमानवातावरणम्",
//       forecast: "पञ्चदिनीयं पूर्वानुमानम्",
//       date: "दिनाङ्कः",
//       description: "विवरणम्",
//       temperature: "तापमानम्",
//       humidity: "आर्द्रता",
//       wind: "वायोः वेगः",
//       maxMin: "अधिकतम/न्यूनतम तापमानम्",
//       cloudiness: "मेघच्छादनम्",
//       pressure: "दाबः",
//       visibility: "दृश्यमानता",
//       dewPoint: "शीतबिन्दुः",
//       feelsLike: "संनादति",
//       alerts: "वातावरणसूचनाः",
//       noAlerts: "कापि सक्रियं वातावरणसूचना नास्ति।",
//       farmingTips: "कृषिसंनादनम्",
//       loading: "भारति...",
//       celsius: "सेल्सियस्",
//       fahrenheit: "फारेनहाइट्",
//       tips: {
//         highTemp: "उच्चं तापमानं संनादति। सस्यानां सम्यक् सेचनं कुरु च छायाजालं संनादति।",
//         lowHumidity: "न्यूना आर्द्रता भूमिं शुष्कति। सेचनस्य संनादनं वर्धति।",
//         highWind: "प्रबलवायवः संनादति। मुक्तं यन्त्रं संनादति च सस्यसहायं परीक्षति।",
//         rain: "वर्षं संनादति। प्रक्षालनेन संनादति खादस्य संनादने विलम्बं कुरु।",
//       },
//     },
//   };

//   const getWeather = async (query) => {
//     setLoading(true);
//     setError("");
//     try {
//       const apiKey = import.meta.env.VITE_APP_WEATHER_API_KEY;
//       const currentResponse = await axios.get(
//         `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}&lang=${lang}`
//       );
//       setCurrentWeather(currentResponse.data);
//       const forecastResponse = await axios.get(
//         `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=${unit}&lang=${lang}`
//       );
//       const filteredData = forecastResponse.data.list.filter(
//         (reading, index) => index % 8 === 0
//       );
//       setWeatherData(filteredData);
//     } catch (error) {
//       console.error("Error fetching weather data:", error);
//       setError(
//         error.response?.status === 404
//           ? translations[lang].error
//           : translations[lang].networkError
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getWeatherByGeolocation = () => {
//     setLoading(true);
//     setError("");
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
//           try {
//             const apiKey = import.meta.env.VITE_APP_WEATHER_API_KEY;
//             const currentResponse = await axios.get(
//               `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}&lang=${lang}`
//             );
//             setCurrentWeather(currentResponse.data);
//             const forecastResponse = await axios.get(
//               `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}&lang=${lang}`
//             );
//             const filteredData = forecastResponse.data.list.filter(
//               (reading, index) => index % 8 === 0
//             );
//             setWeatherData(filteredData);
//             setLocation(currentResponse.data.name);
//           } catch (error) {
//             console.error("Error fetching geolocation weather:", error);
//             setError(translations[lang].networkError);
//           } finally {
//             setLoading(false);
//           }
//         },
//         () => {
//           setError(translations[lang].geolocationError);
//           setLoading(false);
//         }
//       );
//     } else {
//       setError(translations[lang].geolocationError);
//       setLoading(false);
//     }
//   };

//   const getFarmingTips = (weather) => {
//     const tips = [];
//     if (weather.main.temp > (unit === "metric" ? 30 : 86)) {
//       tips.push(translations[lang].tips.highTemp);
//     }
//     if (weather.main.humidity < 40) {
//       tips.push(translations[lang].tips.lowHumidity);
//     }
//     if (weather.wind.speed > (unit === "metric" ? 10 : 22)) {
//       tips.push(translations[lang].tips.highWind);
//     }
//     if (weather.weather[0].main.toLowerCase().includes("rain")) {
//       tips.push(translations[lang].tips.rain);
//     }
//     return tips.length > 0 ? tips : [translations[lang].tips.noTips];
//   };

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center pt-16 sm:pt-20 font-poppins"
//       style={{ backgroundImage: `url(${backgroundImage})` }}
//     >
//       {/* नेवबार के पीछे हेडिंग छिपने की समस्या को ठीक करने के लिए टॉप पैडिंग जोड़ा गया */}
//       <div className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-5xl border border-white/20">
//         <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent animate-fade-in">
//           {translations[lang].heading}
//         </h1>
//         <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
//           <input
//             type="text"
//             placeholder={translations[lang].placeholder}
//             className="p-3 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-green-300 shadow-sm transition-all duration-300 w-full sm:w-60 bg-white/80"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />
//           <select
//             className="p-3 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-green-300 shadow-sm transition-all duration-300 w-full sm:w-36 bg-white/80"
//             value={lang}
//             onChange={(e) => setLang(e.target.value)}
//           >
//             <option value="en">English</option>
//             <option value="hi">हिन्दी</option>
//             <option value="bho">भोजपुरी</option>
//             <option value="mr">मराठी</option>
//             <option value="bn">বাংলা</option>
//             <option value="as">অসমীয়া</option>
//             <option value="sa">संस्कृतम्</option>
//           </select>
//           <select
//             className="p-3 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-green-300 shadow-sm transition-all duration-300 w-full sm:w-36 bg-white/80"
//             value={unit}
//             onChange={(e) => {
//               setUnit(e.target.value);
//               if (location) getWeather(location);
//             }}
//           >
//             <option value="metric">{translations[lang].celsius}</option>
//             <option value="imperial">{translations[lang].fahrenheit}</option>
//           </select>
//           <button
//             className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-3 rounded-full font-medium hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-md flex items-center justify-center disabled:opacity-50"
//             onClick={() => getWeather(location)}
//             disabled={loading || !location}
//           >
//             <FaSearchLocation className="mr-2" /> {translations[lang].search}
//           </button>
//           <button
//             className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-3 rounded-full font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md flex items-center justify-center disabled:opacity-50"
//             onClick={getWeatherByGeolocation}
//             disabled={loading}
//           >
//             <FaMapMarkerAlt className="mr-2" /> {translations[lang].geolocation}
//           </button>
//         </div>

//         {error && (
//           <div className="bg-red-500/90 p-3 rounded-lg mb-6 text-center flex items-center justify-center text-sm">
//             <FaExclamationTriangle className="mr-2" /> {error}
//           </div>
//         )}

//         {loading && (
//           <div className="text-center text-xl text-white animate-pulse flex items-center justify-center">
//             <svg
//               className="animate-spin h-6 w-6 mr-2 text-green-400"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               ></path>
//             </svg>
//             {translations[lang].loading}
//           </div>
//         )}

//         {currentWeather && !loading && (
//           <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-6 animate-fade-in">
//             <h2 className="text-2xl font-semibold mb-4 text-center text-green-100">
//               {translations[lang].currentWeather}
//             </h2>
//             <p className="text-center mb-4 capitalize text-lg font-medium text-white">
//               {currentWeather.weather[0].description}
//             </p>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-4">
//               <div className="flex flex-col items-center">
//                 <FaTemperatureHigh className="text-3xl mb-2 text-yellow-300" />
//                 <p className="text-lg text-white">
//                   {currentWeather.main.temp}°{unit === "metric" ? "C" : "F"}
//                 </p>
//                 <p className="text-xs text-green-200">{translations[lang].temperature}</p>
//               </div>
//               <div className="flex flex-col items-center">
//                 <FaTint className="text-3xl mb-2 text-blue-300" />
//                 <p className="text-lg text-white">{currentWeather.main.humidity}%</p>
//                 <p className="text-xs text-green-200">{translations[lang].humidity}</p>
//               </div>
//               <div className="flex flex-col items-center">
//                 <FaWind className="text-3xl mb-2 text-gray-300" />
//                 <p className="text-lg text-white">
//                   {currentWeather.wind.speed} {unit === "metric" ? "m/s" : "mph"}
//                 </p>
//                 <p className="text-xs text-green-200">{translations[lang].wind}</p>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-center text-white">
//               <p className="flex items-center justify-center">
//                 <FaSun className="mr-2 text-yellow-300" /> {translations[lang].maxMin}:{" "}
//                 {currentWeather.main.temp_max}°{unit === "metric" ? "C" : "F"} /{" "}
//                 {currentWeather.main.temp_min}°{unit === "metric" ? "C" : "F"}
//               </p>
//               <p className="flex items-center justify-center">
//                 <FaCloud className="mr-2 text-gray-300" /> {translations[lang].cloudiness}:{" "}
//                 {currentWeather.clouds.all}%
//               </p>
//               <p className="flex items-center justify-center">
//                 <FaCompressArrowsAlt className="mr-2 text-blue-300" />{" "}
//                 {translations[lang].pressure}: {currentWeather.main.pressure} hPa
//               </p>
//               <p>
//                 {translations[lang].visibility}:{" "}
//                 {(currentWeather.visibility / 1000).toFixed(1)} km
//               </p>
//               <p>
//                 {translations[lang].feelsLike}:{" "}
//                 {currentWeather.main.feels_like}°{unit === "metric" ? "C" : "F"}
//               </p>
//             </div>
//             <div className="mt-6">
//               <h3 className="text-lg font-semibold mb-2 text-green-100">
//                 {translations[lang].farmingTips}
//               </h3>
//               <ul className="list-disc list-inside text-sm text-white">
//                 {getFarmingTips(currentWeather).map((tip, idx) => (
//                   <li key={idx}>{tip}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}

//         {weatherData.length > 0 && !loading && (
//           <div className="mt-6">
//             <h2 className="text-2xl font-semibold mb-4 text-center text-green-100">
//               {translations[lang].forecast}
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {weatherData.map((day, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-white/20 backdrop-blur-md p-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in"
//                 >
//                   <h3 className="text-lg font-semibold mb-3 text-center flex items-center justify-center text-white">
//                     <FaRegClock className="mr-2 text-green-300" />
//                     {new Date(day.dt_txt).toLocaleDateString(lang, {
//                       weekday: "long",
//                       month: "short",
//                       day: "numeric",
//                     })}
//                   </h3>
//                   <p className="text-center mb-3 capitalize text-base font-medium text-white">
//                     {day.weather[0].description}
//                   </p>
//                   <div className="grid grid-cols-3 gap-2 text-center mb-3">
//                     <div className="flex flex-col items-center">
//                       <FaTemperatureHigh className="text-2xl mb-1 text-yellow-300" />
//                       <p className="text-base text-white">
//                         {day.main.temp}°{unit === "metric" ? "C" : "F"}
//                       </p>
//                       <p className="text-xs text-green-200">{translations[lang].temperature}</p>
//                     </div>
//                     <div className="flex flex-col items-center">
//                       <FaTint className="text-2xl mb-1 text-blue-300" />
//                       <p className="text-base text-white">{day.main.humidity}%</p>
//                       <p className="text-xs text-green-200">{translations[lang].humidity}</p>
//                     </div>
//                     <div className="flex flex-col items-center">
//                       <FaWind className="text-2xl mb-1 text-gray-300" />
//                       <p className="text-base text-white">
//                         {day.wind.speed} {unit === "metric" ? "m/s" : "mph"}
//                       </p>
//                       <p className="text-xs text-green-200">{translations[lang].wind}</p>
//                     </div>
//                   </div>
//                   <div className="text-xs text-center space-y-1 text-white">
//                     <p className="flex items-center justify-center">
//                       <FaSun className="mr-1 text-yellow-300" /> {translations[lang].maxMin}:{" "}
//                       {day.main.temp_max}°{unit === "metric" ? "C" : "F"} /{" "}
//                       {day.main.temp_min}°{unit === "metric" ? "C" : "F"}
//                     </p>
//                     <p className="flex items-center justify-center">
//                       <FaCloud className="mr-1 text-gray-300" /> {translations[lang].cloudiness}:{" "}
//                       {day.clouds.all}%
//                     </p>
//                     <p className="flex items-center justify-center">
//                       <FaCompressArrowsAlt className="mr-1 text-blue-300" />{" "}
//                       {translations[lang].pressure}: {day.main.pressure} hPa
//                     </p>
//                     <p>
//                       {translations[lang].visibility}:{" "}
//                       {(day.visibility / 1000).toFixed(1)} km
//                     </p>
//                     <p>
//                       {translations[lang].dewPoint}:{" "}
//                       {(day.main.temp - (100 - day.main.humidity) / 5).toFixed(2)}°
//                       {unit === "metric" ? "C" : "F"}
//                     </p>
//                     <p>
//                       {translations[lang].feelsLike}: {day.main.feels_like}°
//                       {unit === "metric" ? "C" : "F"}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//       <style>
//         {`
//           @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
//           .font-poppins {
//             font-family: 'Poppins', sans-serif;
//           }
//           .animate-fade-in {
//             animation: fadeIn 0.5s ease-in;
//           }
//           @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(10px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default WeatherApp;








import React, { useState, useEffect } from 'react';
import {
  FaSearchLocation,
  FaTemperatureHigh,
  FaCloud,
  FaTint,
  FaWind,
  FaSun,
  FaRegClock,
  FaCompressArrowsAlt,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaLeaf, 
  FaCalendarAlt, 
  FaClock, 
  FaArrowUp, FaArrowDown // Added for Sunrise/Sunset
} from 'react-icons/fa';
import axios from 'axios';
import backgroundImage from '../assets/1.jpg';

// --- HELPER: Time Conversion ---
const convertUnixToTime = (unixTimestamp, timezoneOffset) => {
    if (!unixTimestamp) return 'N/A';
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    // Convert to local time string (e.g., 6:30 AM)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
};

// --- HELPER: Icon Mapping ---
const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
        case '01d': case '01n': return '☀️'; // Clear Sky
        case '02d': case '02n': return '🌤️'; // Few Clouds
        case '03d': case '03n': return '☁️'; // Scattered Clouds
        case '04d': case '04n': return '☁️'; // Broken Clouds
        case '09d': case '09n': return '🌧️'; // Shower Rain
        case '10d': case '10n': return '🌦️'; // Rain
        case '11d': case '11n': return '⛈️'; // Thunderstorm
        case '13d': case '13n': return '🌨️'; // Snow
        case '50d': case '50n': return '🌫️'; // Mist/Fog
        default: return '❓';
    }
};

const WeatherApp = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [lang, setLang] = useState("en");
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const translations = {
    // ... (Translations object remains identical) ...
    en: {
        heading: "🌾 Farmer-Friendly Weather App",
        placeholder: "Enter Pincode / Village / District",
        search: "Search",
        geolocation: "Use My Location",
        error: "Location not found. Please enter a valid pincode, village, or district name.",
        networkError: "Network error. Please check your connection and try again.",
        geolocationError: "Unable to fetch location. Please allow location access or enter a location manually.",
        currentWeather: "Current Weather",
        forecast: "5-Day Forecast",
        date: "Date",
        description: "Description",
        temperature: "Temperature",
        humidity: "Humidity",
        wind: "Wind Speed",
        maxMin: "Max/Min Temp",
        cloudiness: "Cloudiness",
        pressure: "Pressure",
        visibility: "Visibility",
        dewPoint: "Dew Point",
        feelsLike: "Feels Like",
        alerts: "Weather Alerts",
        noAlerts: "No active weather alerts.",
        farmingTips: "Farming Tips",
        loading: "Loading...",
        celsius: "Celsius",
        fahrenheit: "Fahrenheit",
        sunrise: "Sunrise", // NEW
        sunset: "Sunset",   // NEW
        tips: {
            highTemp: "High temperatures detected. Ensure crops are well-watered and consider shade nets.",
            lowHumidity: "Low humidity may dry out soil. Increase irrigation frequency.",
            highWind: "Strong winds expected. Secure loose equipment and check crop supports.",
            rain: "Rain expected. Delay fertilizer application to avoid runoff.",
        },
    },
    hi: {
        heading: "🌾 किसान-अनुकूल मौसम ऐप",
        placeholder: "पिनकोड / गाँव / जिला दर्ज करें",
        search: "खोजें",
        geolocation: "मेरी स्थिति का उपयोग करें",
        error: "स्थान नहीं मिला। कृपया वैध पिनकोड, गाँव या जिला नाम दर्ज करें।",
        networkError: "नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।",
        geolocationError: "स्थान प्राप्त करने में असमर्थ। कृपया स्थान पहुंच की अनुमति दें या मैन्युअल रूप से स्थान दर्ज करें।",
        currentWeather: "वर्तमान मौसम",
        forecast: "5-दिन का पूर्वानुमान",
        date: "तारीख",
        description: "विवरण",
        temperature: "तापमान",
        humidity: "नमी",
        wind: "हवा की गति",
        maxMin: "अधिकतम/न्यूनतम ताप",
        cloudiness: "बादल",
        pressure: "दबाव",
        visibility: "दृश्यता",
        dewPoint: "ओस बिंदु",
        feelsLike: "महसूस होता है",
        alerts: "मौसम चेतावनियाँ",
        noAlerts: "कोई सक्रिय मौसम चेतावनी नहीं।",
        farmingTips: "कृषि सुझाव",
        loading: "लोड हो रहा है...",
        celsius: "सेल्सियस",
        fahrenheit: "फ़ारेनहाइट",
        sunrise: "सूर्य उदय", // NEW
        sunset: "सूर्य अस्त",   // NEW
        tips: {
            highTemp: "उच्च तापमान का पता चला। सुनिश्चित करें कि फसलें अच्छी तरह से पानी पिलाई गई हैं और छाया जाल का उपयोग करें।",
            lowHumidity: "कम नमी मिट्टी को सुखा सकती है। सिंचाई की आवृत्ति बढ़ाएँ।",
            highWind: "तेज़ हवाएँ अपेक्षित। ढीले उपकरणों को सुरक्षित करें और फसल सहारों की जाँच करें।",
            rain: "बारिश की उम्मीद। रनऑफ से बचने के लिए उर्वरक प्रयोग में देरी करें।",
        },
    },
    bho: {
        heading: "🌾 किसान के लिये मौसम ऐप",
        placeholder: "पिनकोड / गाँव / जिला डालs",
        search: "खोजs",
        geolocation: "हमार लोकेशन ब्यवहार करs",
        error: "जगह ना मिलल। कृपया सही पिनकोड, गाँव, या जिला के नाम डालs।",
        networkError: "नेटवर्क में गड़बड़। कृपया कनेक्शन चेक करs आ पुनः कोशिश करs।",
        geolocationError: "लोकेशन ना मिल पावे। कृपया लोकेशन के अनुमति दs या मैनुअल जगह डालs।",
        currentWeather: "अभी के मौसम",
        forecast: "5-दिन के पूर्वानुमान",
        date: "तारीख",
        description: "विवरण",
        temperature: "तापमान",
        humidity: "नमी",
        wind: "हवा के गति",
        maxMin: "ज्यादा/कम ताप",
        cloudiness: "बादर",
        pressure: "दबाव",
        visibility: "दिखाई",
        dewPoint: "ओस बिंदु",
        feelsLike: "लागे लs",
        alerts: "मौसम चेतावनी",
        noAlerts: "कोई मौसम चेतावनी नइखे।",
        farmingTips: "खेती के सुझाव",
        loading: "लोड हो रहल बा...",
        celsius: "सेल्सियस",
        fahrenheit: "फारेनहाइट",
        sunrise: "सूरज उदय", // NEW
        sunset: "सूरज अस्त",   // NEW
        tips: {
            highTemp: "ज्यादा तापमान मिलल। फसलन के अच्छे से पानी दs आ छाया जाल के ब्यवहार करs।",
            lowHumidity: "कम नमी मिट्टी सुखा देत बा। पानी दे के बार-बार करs।",
            highWind: "तेज़ हवा आवे वाला बा। ढीला सामान बाँधs आ फसल के सहारा चेक करs।",
            rain: "बरखा के उम्मीद बा। खाद दे में देरी करs ताकि बह ना जाव।",
        },
    },
    mr: {
        heading: "🌾 शेतकरी-अनुकूल हवामान अॅप",
        placeholder: "पिनकोड / गाव / जिल्हा टाका",
        search: "शोधा",
        geolocation: "माझे स्थान वापरा",
        error: "स्थान सापडले नाही। कृपया वैध पिनकोड, गाव किंवा जिल्ह्याचे नाव टाका。",
        networkError: "नेटवर्क त्रुटी। कृपया तुमचे कनेक्शन तपासा आणि पुन्हा प्रयत्न करा。",
        geolocationError: "स्थान मिळवण्यात अक्षम। कृपया स्थान प्रवेशास परवानगी द्या किंवा स्थान मॅन्युअली टाका。",
        currentWeather: "सध्याचे हवामान",
        forecast: "5-दिवसांचा अंदाज",
        date: "तारीख",
        description: "वर्णन",
        temperature: "तापमान",
        humidity: "आर्द्रता",
        wind: "वाऱ्याचा वेग",
        maxMin: "कमाल/किमान तापमान",
        cloudiness: "ढग",
        pressure: "दाब",
        visibility: "दृश्यमानता",
        dewPoint: "दवबिंदू",
        feelsLike: "जाणवते",
        alerts: "हवामान सूचना",
        noAlerts: "कोणत्याही सक्रिय हवामान सूचना नाहीत。",
        farmingTips: "शेती सल्ला",
        loading: "लोड होत आहे...",
        celsius: "सेल्सियस",
        fahrenheit: "फॅरेनहाइट",
        sunrise: "सूर्य उदय", // NEW
        sunset: "सूर्य अस्त",   // NEW
        tips: {
            highTemp: "उच्च तापमान आढळले। पिकांना पुरेसे पाणी द्या आणि छायाजाळीचा वापर करा。",
            lowHumidity: "कम आर्द्रता माती कोरडी करू शकते। पाण्याची वारंवारता वाढवा。",
            highWind: "जोरदार वारे अपेक्षित। सैल उपकरणे सुरक्षित करा आणि पिकांच्या आधाराची तपासणी करा。",
            rain: "पाऊस अपेक्षित। खते देण्यास विलंब करा जेणेकरून ते वाहून जाऊ नये。",
        },
    },
    bn: {
        heading: "🌾 কৃষক-বান্ধব আবহাওয়া অ্যাপ",
        placeholder: "পিনকোড / গ্রাম / জেলা লিখুন",
        search: "অনুসন্ধান",
        geolocation: "আমার অবস্থান ব্যবহার করুন",
        error: "স্থান পাওয়া যায়নি। দয়া করে একটি বৈধ পিনকোড, গ্রাম বা জেলার নাম লিখুন।",
        networkError: "নেটওয়ার্ক ত্রুটি। দয়া করে আপনার সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।",
        geolocationError: "অবস্থান পেতে অক্ষম। দয়া করে অবস্থান অ্যাক্সেসের অনুমতি দিন বা ম্যানুয়ালি অবস্থান লিখুন।",
        currentWeather: "বর্তমান আবহাওয়া",
        forecast: "৫-দিনের পূর্বাভাস",
        date: "তারিখ",
        description: "বিবরণ",
        temperature: "তাপমাত্রা",
        humidity: "আর্দ্রতা",
        wind: "বাতাসের গতি",
        maxMin: "সর্বোচ্চ/সর্বনিম্ন তাপ",
        cloudiness: "মেঘলা",
        pressure: "চাপ",
        visibility: "দৃশ্যমানতা",
        dewPoint: "শিশির বিন্দু",
        feelsLike: "অনুভূতি",
        alerts: "আবহাওয়ার সতর্কতা",
        noAlerts: "কোনও সক্রিয় আবহাওয়ার সতর্কতা নেই।",
        farmingTips: "কৃষি পরামর্শ",
        loading: "লোড হচ্ছে...",
        celsius: "সেলসিয়াস",
        fahrenheit: "ফারেনহাইট",
        sunrise: "সূর্যোদয়", // NEW
        sunset: "সূর্যাস্ত",   // NEW
        tips: {
            highTemp: "উচ্চ তাপমাত্রা সনাক্ত হয়েছে। ফসল ভালভাবে জল দেওয়া নিশ্চিত করুন এবং ছায়া জাল ব্যবহার করুন।",
            lowHumidity: "কম আর্দ্রতা মাটি শুকিয়ে দিতে পারে। সেচের ফ্রিকোয়েন্সি বাড়ান।",
            highWind: "প্রবল বাতাস প্রত্যাশিত। আলগা সরঞ্জাম সুরক্ষিত করুন এবং ফসলের সমর্থন পরীক্ষা করুন।",
            rain: "বৃষ্টি প্রত্যাশিত। রানঅফ এড়াতে সার প্রয়োগে বিলম্ব করুন।",
        },
    },
    as: {
        heading: "🌾 কৃষক-বন্ধুত্বপূৰ্ণ বতৰ এপ",
        placeholder: "পিনক’ড / গাঁও / জিলা সুমুৱাওক",
        search: "সন্ধান কৰক",
        geolocation: "মোৰ অৱস্থান ব্যৱহাৰ কৰক",
        error: "স্থান বিচাৰি পোৱা নগ’ল। অনুগ্ৰহ কৰি এটা বৈধ পিনক’ড, গাঁও বা জিলাৰ নাম সুমুৱাওক।",
        networkError: "নেটৱৰ্কত ত্ৰুটি। অনুগ্ৰহ কৰি আপোনাৰ সংযোগ পৰীক্ষা কৰক আৰু পুনৰ চেষ্টা কৰক।",
        geolocationError: "অৱস্থান লাভ কৰিবলৈ অক্ষম। অনুগ্ৰহ কৰি অৱস্থানৰ প্ৰৱেশৰ অনুমতি দিয়ক বা মেনুৱেলী অৱস্থান সুমুৱাওক।",
        currentWeather: "বৰ্তমানৰ বতৰ",
        forecast: "৫-দিনীয়া পূৰ্বাভাস",
        date: "তাৰিখ",
        description: "বিৱৰণ",
        temperature: "তাপমাত্ৰা",
        humidity: "আৰ্দ্ৰতা",
        wind: "বতাহৰ গতি",
        maxMin: "সৰ্বাধিক/সৰ্বনিম্ন তাপ",
        cloudiness: "মেঘাচ্ছন্নতা",
        pressure: "চাপ",
        visibility: "দৃশ্যমানতা",
        dewPoint: "শিশিৰ বিন্দু",
        feelsLike: "অনুভৱ হয়",
        alerts: "বতৰৰ সতৰ্কবাৰ্তা",
        noAlerts: "কোনো সক্ৰিয় বতৰৰ সতৰ্কবাৰ্তা নাই।",
        farmingTips: "কৃষি পৰামৰ্শ",
        loading: "লোড হৈ আছে...",
        celsius: "চেলছিয়াছ",
        fahrenheit: "ফাৰেনহাইট",
        sunrise: "সূৰ্য উদয়", // NEW
        sunset: "সূৰ্য অস্ত",   // NEW
        tips: {
            highTemp: "উচ্চ তাপমাত্ৰা ধৰা পৰিছে। শস্য ভালদৰে পানী দিয়ক আৰু ছাঁৰ জাল ব্যৱহাৰ কৰক।",
            lowHumidity: "কম আৰ্দ্ৰতাই মাটি শুকুৱাব পাৰে। সিঞ্চনৰ কম্পাঙ্ক বঢ়াওক।",
            highWind: "প্ৰবল বতাহৰ আশংকা। আলগা সঁজুলি সুৰক্ষিত কৰক আৰু শস্যৰ সমৰ্থন পৰীক্ষা কৰক।",
            rain: "বৰষুণৰ আশংকা। প্ৰবাহৰ পৰা বাঁচিবলৈ সাৰ প্ৰয়োগত পলম কৰক।",
        },
    },
    sa: {
        heading: "🌾 कृषक-मैत्रीपूर्ण-वातावरण-संनादति",
        placeholder: "पिनकोड् / ग्रामः / मण्डलं प्रविष्टु",
        search: "सन्दीक्षा",
        geolocation: "मम स्थानं संनादति",
        error: "स्थानं न संनादति। कृपया वैधं पिनकोड्, ग्रामं वा मण्डलनाम प्रविष्टु।",
        networkError: "सञ्जालदोषः। कृपया संनादनं परीक्ष्य पुनः प्रयत्नतु।",
        geolocationError: "स्थानं प्राप्नुं न शक्यति। कृपया स्थानप्रवेशस्य अनुज्ञां ददातु अथवा मैन्युअलरूपेण स्थानं प्रविष्टु।",
        currentWeather: "वर्तमानवातावरणम्",
        forecast: "पञ्चदिनीयं पूर्वानुमानम्",
        date: "दिनाङ्कः",
        description: "विवरणम्",
        temperature: "तापमानम्",
        humidity: "आर्द्रता",
        wind: "वायोः वेगः",
        maxMin: "अधिकतम/न्यूनतम तापमानम्",
        cloudiness: "मेघच्छादनम्",
        pressure: "दाबः",
        visibility: "दृश्यमानता",
        dewPoint: "शीतबिन्दुः",
        feelsLike: "संनादति",
        alerts: "वातावरणसूचनाः",
        noAlerts: "कापि सक्रियं वातावरणसूचना नास्ति।",
        farmingTips: "कृषिसंनादनम्",
        loading: "भारति...",
        celsius: "सेल्सियस्",
        fahrenheit: "फारेनहाइट्",
        sunrise: "सूर्योदयः", // NEW
        sunset: "सूर्यास्तः",   // NEW
        tips: {
          highTemp: "उच्चं तापमानं संनादति। सस्यानां सम्यक् सेचनं कुरु च छायाजालं संनादति।",
          lowHumidity: "न्यूना आर्द्रता भूमिं शुष्कति। सेचनस्य संनादनं वर्धति।",
          highWind: "प्रबलवायवः संनादति। मुक्तं यन्त्रं संनादति च सस्यसहायं परीक्षति।",
          rain: "वर्षं संनादति। प्रक्षालनेन संनादति खादस्य संनादने विलम्बं कुरु।",
        },
    },
  };

  const getWeather = async (query) => {
    setLoading(true);
    setError("");
    try {
      const apiKey = import.meta.env.VITE_APP_WEATHER_API_KEY;
      const currentResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}&lang=${lang}`
      );
      setCurrentWeather(currentResponse.data);
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=${unit}&lang=${lang}`
      );
      const filteredData = forecastResponse.data.list.filter(
        (reading, index) => index % 8 === 0
      );
      setWeatherData(filteredData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(
        error.response?.status === 404
          ? translations[lang].error
          : translations[lang].networkError
      );
    } finally {
      setLoading(false);
    }
  };

  const getWeatherByGeolocation = () => {
    setLoading(true);
    setError("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const apiKey = import.meta.env.VITE_APP_WEATHER_API_KEY;
            const currentResponse = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}&lang=${lang}`
            );
            setCurrentWeather(currentResponse.data);
            const forecastResponse = await axios.get(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}&lang=${lang}`
            );
            const filteredData = forecastResponse.data.list.filter(
              (reading, index) => index % 8 === 0
            );
            setWeatherData(filteredData);
            setLocation(currentResponse.data.name);
          } catch (error) {
            console.error("Error fetching geolocation weather:", error);
            setError(translations[lang].networkError);
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError(translations[lang].geolocationError);
          setLoading(false);
        }
      );
    } else {
      setError(translations[lang].geolocationError);
      setLoading(false);
    }
  };

  const getFarmingTips = (weather) => {
    const tips = [];
    if (weather.main.temp > (unit === "metric" ? 30 : 86)) {
      tips.push(translations[lang].tips.highTemp);
    }
    if (weather.main.humidity < 40) {
      tips.push(translations[lang].tips.lowHumidity);
    }
    if (weather.wind.speed > (unit === "metric" ? 10 : 22)) {
      tips.push(translations[lang].tips.highWind);
    }
    if (weather.weather[0].main.toLowerCase().includes("rain")) {
      tips.push(translations[lang].tips.rain);
    }
    return tips.length > 0 ? tips : [translations[lang].tips.noTips];
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center pt-16 sm:pt-20 font-poppins"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-5xl border border-white/20 mt-10 mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-yellow-400 drop-shadow-lg">
          {translations[lang].heading}
        </h1>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6 flex-wrap">
          <input
            type="text"
            placeholder={translations[lang].placeholder}
            className="p-3 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-green-400 focus:border-green-400 shadow-md transition-all duration-300 w-full sm:flex-1 min-w-[200px] bg-white/95 border border-gray-300"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <select
            className="p-3 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-green-400 shadow-md transition-all duration-300 w-full sm:w-36 bg-white/95 border border-gray-300"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="bho">भोजपुरी</option>
            <option value="mr">मराठी</option>
            <option value="bn">বাংলা</option>
            <option value="as">অসমীয়া</option>
            <option value="sa">संस्कृतम्</option>
          </select>
          <select
            className="p-3 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-green-400 shadow-md transition-all duration-300 w-full sm:w-36 bg-white/95 border border-gray-300"
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value);
              if (location) getWeather(location);
            }}
          >
            <option value="metric">{translations[lang].celsius}</option>
            <option value="imperial">{translations[lang].fahrenheit}</option>
          </select>
          <button
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-5 py-3 rounded-xl font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-lg flex items-center justify-center disabled:opacity-70 w-full sm:w-36"
            onClick={() => getWeather(location)}
            disabled={loading || !location}
          >
            <FaSearchLocation className="mr-2" /> {translations[lang].search}
          </button>
          <button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg flex items-center justify-center disabled:opacity-70 w-full sm:w-36"
            onClick={getWeatherByGeolocation}
            disabled={loading}
          >
            <FaMapMarkerAlt className="mr-2" /> {translations[lang].geolocation}
          </button>
        </div>

        {error && (
          <div className="bg-red-700/90 p-4 rounded-xl mb-6 text-center text-white text-sm flex items-center justify-center font-medium">
            <FaExclamationTriangle className="mr-2" /> {error}
          </div>
        )}

        {loading && (
          <div className="text-center text-2xl text-white animate-pulse flex flex-col items-center justify-center p-10">
            <svg
              className="animate-spin h-8 w-8 mb-3 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {translations[lang].loading}
          </div>
        )}

        {/* --- CURRENT WEATHER DISPLAY --- */}
        {currentWeather && !loading && (
          <div className="mt-8 bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/30 animate-fade-in">
            <h2 className="text-3xl font-bold mb-6 text-center text-white border-b border-green-400/50 pb-3">
              {translations[lang].currentWeather} for {currentWeather.name}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1: Main Stats (Temperature, Description) - ICON & TEMP */}
              <div className="lg:col-span-1 bg-black/30 p-5 rounded-2xl flex flex-col items-center justify-center border border-green-400/50 shadow-lg">
                <p className="text-6xl mb-2">{getWeatherIcon(currentWeather.weather[0].icon)}</p> {/* Dynamic Icon */}
                <p className="text-5xl font-extrabold text-yellow-300">
                  {currentWeather.main.temp}°{unit === "metric" ? "C" : "F"}
                </p>
                <p className="mt-1 capitalize text-xl font-medium text-white">
                  {currentWeather.weather[0].description}
                </p>
              </div>

              {/* Column 2: Secondary Metrics */}
              <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                <WeatherMetric icon={<FaTint />} label={translations[lang].humidity} value={`${currentWeather.main.humidity}%`} color="text-blue-300" />
                <WeatherMetric icon={<FaWind />} label={translations[lang].wind} value={`${currentWeather.wind.speed} ${unit === "metric" ? "m/s" : "mph"}`} color="text-gray-300" />
                <WeatherMetric icon={<FaCompressArrowsAlt />} label={translations[lang].pressure} value={`${currentWeather.main.pressure} hPa`} color="text-yellow-400" />
                <WeatherMetric icon={<FaClock />} label={translations[lang].feelsLike} value={`${currentWeather.main.feels_like}°${unit === "metric" ? "C" : "F"}`} color="text-red-300" />
                
                {/* Sunrise / Sunset */}
                <WeatherMetric icon={<FaArrowUp />} label={translations[lang].sunrise} value={convertUnixToTime(currentWeather.sys.sunrise, currentWeather.timezone)} color="text-orange-400" />
                <WeatherMetric icon={<FaArrowDown />} label={translations[lang].sunset} value={convertUnixToTime(currentWeather.sys.sunset, currentWeather.timezone)} color="text-pink-300" />
                
                <WeatherMetric icon={<FaTemperatureHigh />} label={translations[lang].maxMin} value={`${currentWeather.main.temp_max}°/${currentWeather.main.temp_min}°`} color="text-orange-300" />
                <WeatherMetric icon={<FaCloud />} label={translations[lang].cloudiness} value={`${currentWeather.clouds.all}%`} color="text-gray-300" />
                
              </div>
            </div>
            
            {/* Farming Tips Section */}
            <div className="mt-6 p-4 bg-green-900/40 rounded-xl border border-green-500/50 shadow-inner">
              <h3 className="text-lg font-semibold mb-3 text-green-200 flex items-center">
                <FaLeaf className="mr-2 text-green-300" />
                {translations[lang].farmingTips}
              </h3>
              <ul className="list-disc list-inside text-sm text-white space-y-2 pl-2">
                {getFarmingTips(currentWeather).map((tip, idx) => (
                  <li key={idx} className="hover:text-yellow-300 transition-colors">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* --- 5-DAY FORECAST DISPLAY --- */}
        {weatherData.length > 0 && !loading && (
          <div className="mt-8 mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">
              {translations[lang].forecast}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {weatherData.map((day, idx) => (
                <ForecastCard key={idx} day={day} unit={unit} translations={translations} lang={lang} />
              ))}
            </div>
          </div>
        )}
      </div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          .font-poppins {
            font-family: 'Poppins', sans-serif;
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}
      </style>
    </div>
  );
};

// --- HELPER COMPONENT: Metric Display ---
const WeatherMetric = ({ icon, label, value, color }) => (
  <div className="flex flex-col items-center bg-black/30 p-3 rounded-xl border border-white/10 shadow-inner">
    <div className={`text-2xl mb-1 ${color}`}>{icon}</div>
    <p className="text-lg text-white font-semibold">{value}</p>
    <p className="text-xs text-green-300 mt-1 uppercase">{label}</p>
  </div>
);

// --- HELPER COMPONENT: Forecast Card ---
const ForecastCard = ({ day, unit, translations, lang }) => (
  <div
    className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 animate-fade-in border border-white/20"
  >
    <h3 className="text-base font-semibold mb-2 text-center text-yellow-300 flex items-center justify-center">
      <FaCalendarAlt className="mr-2" />
      {new Date(day.dt_txt).toLocaleDateString(lang, { weekday: "short", month: "short", day: "numeric" })}
    </h3>
    <p className="text-center mb-3 capitalize text-2xl">
      {getWeatherIcon(day.weather[0].icon)}
    </p>
    <div className="space-y-1 text-xs text-center text-gray-200 border-t border-white/10 pt-2">
      <p className="flex items-center justify-between">
        <FaTemperatureHigh className="mr-1 text-orange-300" /> {translations[lang].temperature}: 
        <span className="font-semibold text-white">{day.main.temp}°{unit === "metric" ? "C" : "F"}</span>
      </p>
      <p className="flex items-center justify-between">
        <FaTint className="mr-1 text-blue-300" /> {translations[lang].humidity}: 
        <span className="font-semibold text-white">{day.main.humidity}%</span>
      </p>
      <p className="flex items-center justify-between">
        <FaWind className="mr-1 text-gray-300" /> {translations[lang].wind}: 
        <span className="font-semibold text-white">{day.wind.speed} {unit === "metric" ? "m/s" : "mph"}</span>
      </p>
    </div>
  </div>
);



export default WeatherApp;