
import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../utils/api';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

const ProfileSection = ({ user }) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data } = await getUserProfile(localStorage.getItem('token'));
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(t('profile.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, t]);

  // Loading Skeleton
  if (loading) return (
    <div className="w-full h-48 bg-gray-200/50 backdrop-blur-md rounded-2xl animate-pulse border border-gray-300/50"></div>
  );

  // Login Prompt
  if (!user) return (
    <div className="w-full p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center">
      <p className="text-gray-600 font-bold">{t('profile.pleaseLogin')}</p>
    </div>
  );

  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>;

  // --- DYNAMIC THEME LOGIC ---
  const isFarmer = profile?.role === 'farmer'; // Check role

  const theme = {
    // Colors & Gradients
    gradient: isFarmer 
      ? "from-green-800 to-green-600" // Farmer Green
      : "from-blue-700 to-indigo-600", // Consumer Blue
    
    rightBg: isFarmer 
      ? "bg-[#fcfdf5] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" // Earthy
      : "bg-slate-50", // Modern Clean
    
    borderColor: isFarmer ? "border-green-800" : "border-blue-500",
    textColor: isFarmer ? "text-green-800" : "text-blue-800",
    labelColor: isFarmer ? "text-green-700" : "text-blue-600",
    iconBg: isFarmer ? "text-green-600 border-green-100" : "text-blue-500 border-blue-100",
    
    // Content
    defaultAvatar: isFarmer ? "👨‍🌾" : "🛒",
    badgeIcon: isFarmer ? "🚜" : "🛍️",
    badgeText: isFarmer ? "VERIFIED FARMER" : "VERIFIED BUYER",
    cardTitle: isFarmer ? "Farm Card Details" : "Shopper Profile",
    titleIcon: isFarmer ? "🌾" : "💳",
    idPrefix: isFarmer ? "FRM" : "BUY",
  };

  return (
    <div className={`w-full rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border overflow-hidden flex flex-col md:flex-row group transition-all hover:shadow-2xl bg-white ${isFarmer ? 'border-[#e4eacb]' : 'border-blue-100'}`}>
      
      {/* --- LEFT SIDE: IDENTITY CARD (Dynamic Gradient) --- */}
      <div className={`md:w-1/3 bg-gradient-to-br ${theme.gradient} p-6 flex flex-col items-center justify-center relative overflow-hidden`}>
        
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #ffffff 10%, transparent 10%)', backgroundSize: '20px 20px' }}>
        </div>

        {/* Profile Image with Dynamic Ring */}
        <div className="relative z-10 group-hover:scale-105 transition-transform duration-300">
          <div className={`p-1 bg-gradient-to-b ${isFarmer ? 'from-yellow-400 to-yellow-600' : 'from-blue-300 to-purple-300'} rounded-full shadow-lg`}>
            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                className={`w-24 h-24 rounded-full object-cover border-4 ${theme.borderColor}`}
                onError={(e) => { e.target.src = isFarmer ? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' : 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png'; }} 
              />
            ) : (
              <div className={`w-24 h-24 rounded-full bg-white/90 flex items-center justify-center text-5xl border-4 ${theme.borderColor}`}>
                {theme.defaultAvatar}
              </div>
            )}
          </div>
          {/* Active Status Dot */}
          <div className="absolute bottom-1 right-1 bg-green-400 w-5 h-5 rounded-full border-2 border-white shadow-md animate-pulse" title="Online"></div>
        </div>

        <div className="text-center mt-4 z-10">
          <h3 className="text-xl font-bold text-white tracking-wide uppercase drop-shadow-md">
            {profile?.name || "User"}
          </h3>
          <span className={`inline-block mt-2 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full border border-white/20 text-white text-[10px] font-bold tracking-widest shadow-sm`}>
             {theme.badgeIcon} {profile?.role ? profile.role.toUpperCase() : theme.badgeText}
          </span>
        </div>
      </div>

      {/* --- RIGHT SIDE: DETAILS (Dynamic Theme) --- */}
      <div className={`md:w-2/3 p-6 ${theme.rightBg} flex flex-col justify-center`}>
        
        {/* Decorative Header */}
        <div className={`flex items-center gap-2 mb-6 border-b-2 pb-2 ${isFarmer ? 'border-green-100' : 'border-blue-100'}`}>
            <span className="text-2xl">{theme.titleIcon}</span>
            <h4 className={`${theme.textColor} font-bold text-lg`}>{theme.cardTitle}</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
            
            {/* Email Section */}
            <div className="flex items-start gap-3">
                <div className={`bg-white p-2.5 rounded-lg shadow-sm border ${theme.iconBg}`}>
                    📧
                </div>
                <div className="overflow-hidden">
                    <p className={`text-xs ${theme.labelColor} font-bold uppercase tracking-wider opacity-70`}>{t('profile.email')}</p>
                    <p className="text-sm font-semibold text-gray-700 truncate max-w-[160px]" title={profile?.email}>
                        {profile?.email || "N/A"}
                    </p>
                </div>
            </div>

            {/* Location Section */}
            <div className="flex items-start gap-3">
                <div className={`bg-white p-2.5 rounded-lg shadow-sm border ${theme.iconBg}`}>
                    📍
                </div>
                <div>
                    <p className={`text-xs ${theme.labelColor} font-bold uppercase tracking-wider opacity-70`}>{t('profile.location')}</p>
                    <p className="text-sm font-semibold text-gray-700">
                        {profile?.location || "India"}
                    </p>
                </div>
            </div>

            {/* Joined Date */}
            <div className="flex items-start gap-3">
                <div className={`bg-white p-2.5 rounded-lg shadow-sm border ${theme.iconBg}`}>
                    📅
                </div>
                <div>
                    <p className={`text-xs ${theme.labelColor} font-bold uppercase tracking-wider opacity-70`}>{t('profile.joined')}</p>
                    <p className="text-sm font-semibold text-gray-700">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-GB') : "N/A"}
                    </p>
                </div>
            </div>

            {/* Member ID */}
            <div className="flex items-start gap-3">
                <div className={`bg-white p-2.5 rounded-lg shadow-sm border ${theme.iconBg}`}>
                    🆔
                </div>
                <div>
                    <p className={`text-xs ${theme.labelColor} font-bold uppercase tracking-wider opacity-70`}>Member ID</p>
                    <p className="text-sm font-mono font-bold text-gray-600">
                        {theme.idPrefix}-{user.id ? user.id.slice(-6).toUpperCase() : "0000"}
                    </p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileSection;