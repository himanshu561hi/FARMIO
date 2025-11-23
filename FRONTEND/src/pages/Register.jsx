// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { sendOtp, verifyOtp, register } from '../utils/api';
// import bgImage from '../assets/12.jpg'; // Import the background image

// const Register = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState('email'); // 'email', 'otp', 'form'
//   const [formData, setFormData] = useState({
//     email: '',
//     otp: '',
//     name: '',
//     password: '',
//     role: 'consumer',
//     location: '',
//     profileImage: null,
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'profileImage') {
//       setFormData({ ...formData, profileImage: files[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleEmailSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await sendOtp({ email: formData.email });
//       setStep('otp');
//       setError(null);
//     } catch (error) {
//       setError(error.response?.data?.message || 'Failed to send OTP.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await verifyOtp({ email: formData.email, otp: formData.otp });
//       setStep('form');
//       setError(null);
//     } catch (error) {
//       setError(error.response?.data?.message || 'Invalid or expired OTP.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const data = new FormData();
//       data.append('name', formData.name);
//       data.append('email', formData.email);
//       data.append('password', formData.password);
//       data.append('role', formData.role);
//       data.append('location', formData.location);
//       data.append('otp', formData.otp);
//       if (formData.profileImage) {
//         data.append('profileImage', formData.profileImage);
//       }
//       await register(data);
//       alert('Registration successful! Please log in.');
//       navigate('/login');
//     } catch (error) {
//       setError(error.response?.data?.message || 'Registration failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-8"
//       style={{ backgroundImage: `url(${bgImage})` }}
//     >
//       <div className="max-w-md bg-transparent shadow-lg space-y-8 backdrop-blur-md p-12 sm:p-12 md:p-14 rounded-3xl w-full sm:max-w-md md:max-w-lg mx-auto border border-teal-400/30 hover:border-teal-400/50 transition-all duration-500 animate-[wave_0.6s_ease-out] relative z-10">
//         <div className="text-center">
//           <h2 className="text-3xl font-extrabold text-gray-900">Create Your Account</h2>
//           <p className="mt-2 text-sm text-white">
//             Step {step === 'email' ? 1 : step === 'otp' ? 2 : 3} of 3
//           </p>
//         </div>

//         {error && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
//             <p>{error}</p>
//           </div>
//         )}

//         {step === 'email' && (
//           <form onSubmit={handleEmailSubmit} className="space-y-6 relative z-20 pointer-events-auto">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-white">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm pointer-events-auto placeholder:text-white"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed pointer-events-auto"
//               disabled={loading}
//             >
//               {loading ? (
//                 <svg
//                   className="animate-spin h-5 w-5 mr-3 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                   ></path>
//                 </svg>
//               ) : (
//                 'Send OTP'
//               )}
//             </button>
//           </form>
//         )}

//         {step === 'otp' && (
//           <form onSubmit={handleOtpSubmit} className="space-y-6 relative z-20 pointer-events-auto">
//             <div>
//               <label htmlFor="otp" className="block text-sm font-medium text-white">
//                 Enter OTP
//               </label>
//               <input
//                 type="text"
//                 name="otp"
//                 placeholder="Enter the OTP sent to your email"
//                 value={formData.otp}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm pointer-events-auto placeholder:text-white"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed pointer-events-auto"
//               disabled={loading}
//             >
//               {loading ? (
//                 <svg
//                   className="animate-spin h-5 w-5 mr-3 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                   ></path>
//                 </svg>
//               ) : (
//                 'Verify OTP'
//               )}
//             </button>
//             <button
//               type="button"
//               onClick={() => setStep('email')}
//               className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium text-center pointer-events-auto"
//             >
//               Change Email
//             </button>
//           </form>
//         )}

//         {step === 'form' && (
//           <form onSubmit={handleFormSubmit} className="space-y-6 relative z-20 pointer-events-auto">
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-white">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Enter your full name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm pointer-events-auto placeholder:text-white"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-white">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Create a password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm pointer-events-auto placeholder:text-white"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="role" className="block text-sm font-medium text-white">
//                 Role
//               </label>
//               <select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm pointer-events-auto"
//                 required
//               >
//                 <option value="consumer" >Consumer</option>
//                 <option value="farmer">Farmer</option>
//               </select>
//             </div>
//             <div>
//               <label htmlFor="location" className="block text-sm font-medium text-white">
//                 Location
//               </label>
//               <input
//                 type="text"
//                 name="location"
//                 placeholder="Enter your location"
//                 value={formData.location}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm pointer-events-auto placeholder:text-white"
//               />
//             </div>
//             <div>
//               <label htmlFor="profileImage" className="block text-sm font-medium text-white">
//                 Profile Image
//               </label>
//               <input
//                 type="file"
//                 name="profileImage"
//                 accept="image/*"
//                 onChange={handleChange}
//                 className="mt-1 block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 pointer-events-auto"
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed pointer-events-auto"
//               disabled={loading}
//             >
//               {loading ? (
//                 <svg
//                   className="animate-spin h-5 w-5 mr-3 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                   ></path>
//                 </svg>
//               ) : (
//                 'Register'
//               )}
//             </button>
//           </form>
//         )}

//         <p className="mt-6 text-center text-sm text-white">
//           Already registered?{' '}
//           <Link to="/login" className="font-bold text-xl text-cyan-600 hover:text-blue-800 pointer-events-auto">
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;
//Aman ka code



import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendOtp, verifyOtp, register } from '../utils/api';
import { FaEnvelope, FaLock, FaUser, FaTractor, FaMapMarkerAlt, FaImage, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import bgImage from '../assets/12.jpg'; // Import the background image

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email', 'otp', 'form'
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    name: '',
    password: '',
    role: 'consumer',
    location: '',
    profileImage: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Added for password visibility

  // --- LOGIC REMAINS UNCHANGED ---
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendOtp({ email: formData.email });
      setStep('otp');
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp({ email: formData.email, otp: formData.otp });
      setStep('form');
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('role', formData.role);
      data.append('location', formData.location);
      data.append('otp', formData.otp);
      if (formData.profileImage) {
        data.append('profileImage', formData.profileImage);
      }
      await register(data);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };
  // -------------------------------

  // Helper for UI steps
  const renderStepIndicator = () => {
    const steps = ['email', 'otp', 'form'];
    const current = steps.indexOf(step);
    
    return (
      <div className="flex justify-center items-center gap-4 mb-8">
        {steps.map((s, index) => (
          <div key={s} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${index <= current ? 'bg-green-600' : 'bg-gray-700/50 border border-gray-600'}`}>
              {index < current ? <FaCheckCircle className="text-sm" /> : index + 1}
            </div>
            <p className={`text-xs mt-1 transition-colors ${index <= current ? 'text-green-300 font-medium' : 'text-gray-500'}`}>
              {s === 'email' ? 'Email' : s === 'otp' ? 'OTP' : 'Details'}
            </p>
          </div>
        ))}
      </div>
    );
  };
  
  // Custom styles for input autofill issue fix (prevents white background)
  const customStyles = {
    autofillFix: {
      WebkitBoxShadow: '0 0 0 1000px #0f172a inset',
      WebkitTextFillColor: 'white',
      caretColor: 'white'
    }
  };

  return (
    <div
      className="relative mt-15 flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat px-4 sm:px-6 py-16"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark Overlay with Blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px] z-0"></div>

      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/20 rounded-full blur-[100px] animate-pulse z-0" style={{ animationDelay: '0s' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse z-0" style={{ animationDelay: '1s' }}></div>

      {/* --- MAIN CARD --- */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/70 border border-green-500/30 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 transform transition-all">
        
        {/* Header Icon */}
        <div className="text-center mb-8">
            <div className="inline-block w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 mb-3">
                <FaTractor className="text-white text-2xl animate-bounce-slow" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-wide mb-1">Join the Green Revolution</h2>
            <p className="text-sm text-gray-400">Register in 3 easy steps</p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Error Message */}
        {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

        {/* --- STEP 1: EMAIL (SEND OTP) --- */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-6 animate-fade-in-up">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400 group-focus-within:text-green-400 transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                style={customStyles.autofillFix}
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transform transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:scale-100 flex justify-center items-center gap-2"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : 'Send OTP'}
            </button>
          </form>
        )}

        {/* --- STEP 2: OTP VERIFICATION --- */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-6 animate-fade-in-up">
            <div className="text-center text-sm text-green-300">
                OTP sent to {formData.email}. Please check your inbox.
            </div>
            <div className="relative group">
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                style={customStyles.autofillFix}
                className="w-full text-center tracking-widest text-lg font-bold px-4 py-4 bg-slate-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transform transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:scale-100 flex justify-center items-center gap-2"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
            >
              ← Change Email
            </button>
          </form>
        )}

        {/* --- STEP 3: USER DETAILS FORM --- */}
        {step === 'form' && (
          <form onSubmit={handleFormSubmit} className="space-y-5 animate-fade-in-up">
            
            {/* Full Name */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                style={customStyles.autofillFix}
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
                style={customStyles.autofillFix}
                className="w-full pl-12 pr-12 py-4 bg-slate-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Role & Location Group */}
            <div className="grid grid-cols-2 gap-4">
                {/* Role */}
                <div>
                    <label htmlFor="role" className="block text-xs font-medium text-gray-400 mb-1">
                        I am a:
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 bg-slate-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-green-500 transition-all"
                      required
                    >
                      <option value="consumer" className="bg-slate-800">Consumer</option>
                      <option value="farmer" className="bg-slate-800">Farmer</option>
                    </select>
                </div>
                
                {/* Location */}
                <div className="relative">
                    <label htmlFor="location" className="block text-xs font-medium text-gray-400 mb-1">
                        Location (Optional)
                    </label>
                    <div className="absolute inset-y-0 left-0 pl-4 pt-6 flex items-center pointer-events-none">
                       <FaMapMarkerAlt className="text-gray-400 text-sm" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      placeholder="City/State"
                      value={formData.location}
                      onChange={handleChange}
                      style={customStyles.autofillFix}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-green-500 transition-all"
                    />
                </div>
            </div>

            {/* Profile Image */}
            <div className="pt-2">
              <label htmlFor="profileImage" className="block text-xs font-medium text-gray-400 mb-2 flex items-center gap-2">
                <FaImage /> Profile Image (Optional)
              </label>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold 
                  file:bg-green-600/10 file:text-green-400 hover:file:bg-green-600/20 transition-all cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transform transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:scale-100 flex justify-center items-center gap-2"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : 'Create Account'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-400 border-t border-gray-700/50 pt-4">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-green-400 hover:text-green-300 hover:underline transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;