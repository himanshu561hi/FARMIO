import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, sendResetOtp, verifyResetOtp, resetPassword } from '../utils/api';
import { FaEnvelope, FaLock, FaLeaf, FaEye, FaEyeSlash } from 'react-icons/fa';
import bgImage from '../assets/12.jpg';
import { toast, Toaster } from 'react-hot-toast'; 

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState('email');
  const [resetData, setResetData] = useState({ email: '', otp: '', newPassword: '' });
  const [showPassword, setShowPassword] = useState(false); 

  // --- LOGIC ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData({ ...resetData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous error
    try {
      const { data } = await login(formData);
      
      // ✅ SUCCESS TOAST: Login successful hone par
      // Ise navigate se pehle call karein
      toast.success(`Welcome, ${data.user.name}! Logged in successfully.`);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser({ id: data.user.id, role: data.user.role, name: data.user.name });
      
      // Navigate ko toast ke theek baad call kiya
      navigate(data.user.role === 'farmer' ? '/farmer' : '/consumer');
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      // ❌ FAIL TOAST: Login fail hone par
      toast.error(errorMessage);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous error
    try {
      if (resetStep === 'email') {
        await sendResetOtp({ email: resetData.email });
        setResetStep('otp');
        toast.success('OTP sent to your email.'); 
      } else if (resetStep === 'otp') {
        await verifyResetOtp({ email: resetData.email, otp: resetData.otp });
        setResetStep('password');
        toast.success('OTP verified. Set your new password.'); 
      } else if (resetStep === 'password') {
        await resetPassword({ email: resetData.email, otp: resetData.otp, newPassword: resetData.newPassword });
        setForgotPassword(false);
        setResetStep('email');
        setResetData({ email: '', otp: '', newPassword: '' });
        toast.success('Password reset successfully. Please log in with your new password.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred during reset process.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // --- CUSTOM STYLES FOR AUTOFILL FIX ---
  const customStyles = {
    autofillFix: {
      WebkitBoxShadow: '0 0 0 1000px #0f172a inset', // Matches bg-slate-900
      WebkitTextFillColor: 'white',
      caretColor: 'white'
    }
  };

  return (
    <div 
      className="relative mt-15 flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat px-4 overflow-hidden" 
      style={{ backgroundImage: `url(${bgImage})` }}
    >

      {/* Dark Overlay with Blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px] z-0"></div>

      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/20 rounded-full blur-[100px] animate-pulse z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse z-0" style={{ animationDelay: '1s' }}></div>

      {/* --- MAIN CARD --- */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 transform transition-all hover:border-green-500/30">
        
        {/* Logo Icon */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40">
          <FaLeaf className="text-white text-3xl animate-bounce-slow" />
        </div>

        <div className="mt-8">
          {!forgotPassword ? (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                <p className="text-gray-400 text-sm mt-2">Sign in to access your dashboard</p>
              </div>

              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 group-focus-within:text-green-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={customStyles.autofillFix}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                    placeholder="Email Address"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-green-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={customStyles.autofillFix}
                    className="w-full pl-12 pr-12 py-4 bg-slate-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                    placeholder="Password"
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

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setForgotPassword(true)}
                    className="text-sm text-green-400 hover:text-green-300 font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transform transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-white font-semibold hover:text-green-400 hover:underline transition-all">
                  Create Account
                </Link>
              </div>
            </div>
          ) : (
            // --- FORGOT PASSWORD SECTION ---
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                <p className="text-gray-400 text-sm mt-2">Follow the steps to recover access</p>
              </div>

              {error && <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm text-center">{error}</div>}

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
                {resetStep === 'email' && (
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={resetData.email}
                      onChange={handleResetChange}
                      style={customStyles.autofillFix}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-gray-600 rounded-xl text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                )}

                {resetStep === 'otp' && (
                  <div className="relative group">
                    <input
                      type="text"
                      name="otp"
                      value={resetData.otp}
                      onChange={handleResetChange}
                      style={customStyles.autofillFix}
                      className="w-full px-4 py-4 bg-slate-900/50 border border-gray-600 rounded-xl text-white text-center tracking-widest text-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                      placeholder="Enter OTP"
                      required
                    />
                  </div>
                )}

                {resetStep === 'password' && (
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      value={resetData.newPassword}
                      onChange={handleResetChange}
                      style={customStyles.autofillFix}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-gray-600 rounded-xl text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                      placeholder="New Password"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                >
                  {resetStep === 'email' ? 'Send OTP' : resetStep === 'otp' ? 'Verify OTP' : 'Set New Password'}
                </button>
              </form>

              <button
                onClick={() => {
                  setForgotPassword(false);
                  setResetStep('email');
                  setError(null);
                }}
                className="mt-6 w-full text-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;