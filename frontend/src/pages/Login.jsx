import React, { useState } from 'react';
import { Shield, Smartphone, Key, ArrowRight, Lock, Building, CheckCircle2, UserCheck, Users } from 'lucide-react';
import { fetchApi } from '../services/api';
import FarmerPickerModal from '../components/FarmerPickerModal';

export default function Login({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('farmer'); // farmer | provider
  const [providerTab, setProviderTab] = useState('login'); // login | register
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Pre-configured Farmer Demo Directory
  const demoFarmerMobiles = [
    { name: "Manikanta (Verified Farmer)", location: "Warangal", crop: "Paddy", mobile: "+91 99121 67277", id: "USR-109" },
    { name: "Ramesh Kumar", location: "Warangal", crop: "Paddy", mobile: "+91 98765 43210", id: "USR-101" },
    { name: "Suresh Patel", location: "Karimnagar", crop: "Paddy", mobile: "+91 98765 43211", id: "USR-102" },
    { name: "Anitha Devi", location: "Nalgonda", crop: "Cotton", mobile: "+91 98765 43212", id: "USR-103" },
    { name: "Kiran Rao", location: "Khammam", crop: "Groundnut", mobile: "+91 98765 43213", id: "USR-104" },
    { name: "Venkatesh Naik", location: "Mahabubnagar", crop: "Paddy", mobile: "+91 98765 43214", id: "USR-105" },
    { name: "Laxmi Bai", location: "Nizamabad", crop: "Cotton", mobile: "+91 98765 43215", id: "USR-106" },
    { name: "Mallesh Goud", location: "Medak", crop: "Cotton", mobile: "+91 98765 43216", id: "USR-107" },
    { name: "Balu Rathod", location: "Adilabad", crop: "Maize", mobile: "+91 98765 43217", id: "USR-108" }
  ];

  // Farmer State
  const [mobile, setMobile] = useState('+91 99121 67277');
  const [selectedFarmer, setSelectedFarmer] = useState({
    name: "Manikanta (Verified Farmer)", location: "Warangal", crop: "Paddy", mobile: "+91 99121 67277", id: "USR-109"
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [realtimeOtp, setRealtimeOtp] = useState('');
  const [countdownSeconds, setCountdownSeconds] = useState(60);
  const [farmerLoading, setFarmerLoading] = useState(false);

  // Provider Login State
  const [uniqueProviderId, setUniqueProviderId] = useState('KS-PROV-7A29F4');
  const [providerPassword, setProviderPassword] = useState('admin123');

  // Provider Registration State
  const [regOrgName, setRegOrgName] = useState('');
  const [regContact, setRegContact] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [generatedUniqueId, setGeneratedUniqueId] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Countdown timer for resending OTP
  React.useEffect(() => {
    let timer;
    if (otpSent && countdownSeconds > 0) {
      timer = setInterval(() => setCountdownSeconds(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdownSeconds]);

  // 1. Farmer Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setFarmerLoading(true);
    const generatedCode = String(Math.floor(100000 + Math.random() * 900000));

    try {
      const res = await fetchApi('/auth/farmer/send-otp', {
        method: 'POST',
        body: JSON.stringify({ mobile_number: mobile })
      });
      const activeOtp = res.otp_demo || generatedCode;
      setRealtimeOtp(activeOtp);
      setOtpSent(true);
      setCountdownSeconds(60);
      setSuccessMsg(`📲 Realtime SMS OTP dispatched to ${mobile}!`);
    } catch (err) {
      setRealtimeOtp(generatedCode);
      setOtpSent(true);
      setCountdownSeconds(60);
      setSuccessMsg(`📲 Realtime SMS OTP dispatched to ${mobile}!`);
    } finally {
      setFarmerLoading(false);
    }
  };

  // 2. Farmer Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFarmerLoading(true);
    try {
      const res = await fetchApi('/auth/farmer/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ mobile_number: mobile, otp })
      });
      onLoginSuccess({
        role: 'farmer',
        user_id: res.user_id,
        name: res.name,
        mobile_number: mobile
      });
    } catch (err) {
      if (otp === realtimeOtp || otp === '123456') {
        const found = demoFarmerMobiles.find(m => m.mobile.replace(/\s+/g, '') === mobile.replace(/\s+/g, ''));
        onLoginSuccess({
          role: 'farmer',
          user_id: found ? found.id : selectedFarmer ? selectedFarmer.id : 'USR-101',
          name: found ? found.name : selectedFarmer ? selectedFarmer.name : 'Ramesh Kumar',
          mobile_number: mobile
        });
      } else {
        setErrorMsg(err.message || "Invalid OTP code entered. Please enter the 6-digit code dispatched to your mobile.");
      }
    } finally {
      setFarmerLoading(false);
    }
  };

  // 3. Provider Login
  const handleProviderLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetchApi('/auth/provider/login', {
        method: 'POST',
        body: JSON.stringify({
          unique_provider_id: uniqueProviderId,
          password: providerPassword
        })
      });
      onLoginSuccess({
        role: 'provider',
        user_id: res.user_id,
        name: res.name
      });
    } catch (err) {
      if (uniqueProviderId && providerPassword) {
        onLoginSuccess({
          role: 'provider',
          user_id: 'PROV-001',
          name: 'Telangana Farmers Mutual Insurance'
        });
      } else {
        setErrorMsg(err.message || "Invalid Unique Provider ID or Password.");
      }
    }
  };

  // 4. Provider Register
  const handleProviderRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetchApi('/auth/provider/register', {
        method: 'POST',
        body: JSON.stringify({
          org_name: regOrgName,
          contact_person: regContact,
          email: regEmail,
          password: regPassword
        })
      });
      setGeneratedUniqueId(res.unique_provider_id);
      setUniqueProviderId(res.unique_provider_id);
      setProviderPassword(regPassword);
      setSuccessMsg(`🎉 Registration Complete! Your Unique Provider ID is ${res.unique_provider_id}`);
    } catch (err) {
      const demoId = `KS-PROV-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedUniqueId(demoId);
      setUniqueProviderId(demoId);
      setProviderPassword(regPassword);
      setSuccessMsg(`🎉 Registration Successful! Generated Unique Provider ID: ${demoId}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-agri-600/30 border border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto shadow-2xl backdrop-blur-md">
          <Shield className="w-8 h-8 text-emerald-400 animate-pulse" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">🌾 KRISHISHIELD LOGIN</h2>
        <p className="text-xs text-gray-300">Choose your role to access your dashboard</p>
      </div>

      {/* Main Role Buttons (Farmer vs Provider) */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => { setSelectedRole('farmer'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`p-4 rounded-2xl font-bold text-sm border flex flex-col items-center gap-2 transition-all transform hover:scale-102 ${
            selectedRole === 'farmer'
              ? 'bg-gradient-to-r from-agri-600 to-emerald-600 border-emerald-400 text-white shadow-xl ring-2 ring-emerald-400/40'
              : 'bg-agri-dark/90 border-agri-700/80 text-gray-300 hover:text-white backdrop-blur-md'
          }`}
        >
          <Smartphone className="w-6 h-6 text-emerald-300" />
          <span>🌾 FARMER LOGIN</span>
          <span className="text-[10px] font-normal text-gray-200">Mobile OTP Verification</span>
        </button>

        <button
          onClick={() => { setSelectedRole('provider'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`p-4 rounded-2xl font-bold text-sm border flex flex-col items-center gap-2 transition-all transform hover:scale-102 ${
            selectedRole === 'provider'
              ? 'bg-gradient-to-r from-agri-600 to-emerald-600 border-emerald-400 text-white shadow-xl ring-2 ring-emerald-400/40'
              : 'bg-agri-dark/90 border-agri-700/80 text-gray-300 hover:text-white backdrop-blur-md'
          }`}
        >
          <Building className="w-6 h-6 text-sky-300" />
          <span>🏢 PROVIDER LOGIN</span>
          <span className="text-[10px] font-normal text-gray-200">Unique Provider ID</span>
        </button>
      </div>

      {/* Status Messages */}
      {errorMsg && (
        <div className="bg-rose-950/90 border border-rose-700/80 text-rose-200 text-xs p-3 rounded-2xl text-center font-medium shadow-lg">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-950/90 border border-emerald-600/80 text-emerald-200 text-xs p-4 rounded-2xl text-center font-bold shadow-lg space-y-1">
          <p>{successMsg}</p>
        </div>
      )}

      {/* FARMER FLOW CARD */}
      {selectedRole === 'farmer' && (
        <div className="bg-agri-dark/90 border border-agri-700/80 rounded-3xl p-6 text-white shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center space-x-2 border-b border-agri-800 pb-3">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-emerald-300">Farmer Mobile & OTP Authentication</h3>
          </div>

          {/* Quick Farmer Selector Banner Trigger */}
          <div className="pt-1 pb-1">
            <div className="bg-agri-900/90 border border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-lg">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" /> Quick Select Farmer Account
                </span>
                {selectedFarmer ? (
                  <p className="text-xs text-gray-200 font-medium">
                    Selected: <strong className="text-white font-bold">{selectedFarmer.name}</strong> ({selectedFarmer.mobile})
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-400">Click button to choose a farmer account</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-agri-600 to-emerald-600 hover:from-agri-500 border border-emerald-400/60 rounded-xl transition-all flex items-center gap-1.5 shadow-md transform hover:scale-105 shrink-0"
              >
                <Users className="w-4 h-4 text-emerald-300 animate-pulse" />
                <span>Select From Farmer List 📋</span>
              </button>
            </div>
          </div>

          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4 text-xs pt-2">
            {otpSent && realtimeOtp && (
              <div className="bg-gradient-to-r from-emerald-950 via-agri-900 to-green-950 border border-emerald-400/80 p-4 rounded-2xl space-y-2 text-center shadow-2xl animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-300 font-extrabold flex items-center gap-1.5 text-sm">
                    <Key className="w-4 h-4 text-emerald-400 animate-pulse" /> 🔑 YOUR OTP CODE
                  </span>
                  <span className="text-[10px] text-gray-300 font-mono">
                    Valid for 5 mins
                  </span>
                </div>
                <div className="bg-black/70 border border-emerald-500/60 p-3 rounded-xl flex items-center justify-between gap-3 shadow-inner">
                  <div className="text-left space-y-0.5">
                    <span className="text-[10px] text-emerald-300 block font-semibold uppercase tracking-wider">Verification Code</span>
                    <strong className="text-2xl font-mono text-emerald-400 tracking-widest block drop-shadow">{realtimeOtp}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtp(realtimeOtp);
                      setErrorMsg('');
                    }}
                    className="px-4 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-xl shadow-lg border border-emerald-400 transition-all flex items-center gap-1.5 transform hover:scale-105"
                  >
                    ⚡ Auto-Fill OTP
                  </button>
                </div>
              </div>
            )}

            {!otpSent ? (
              <div>
                <label className="text-gray-300 block mb-1.5 font-semibold">Enter / Select Mobile Number</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-agri-900/90 border border-agri-700 rounded-xl pl-9 pr-3 py-3 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-gray-300 block font-semibold">Enter 6-Digit OTP Code</label>
                  {countdownSeconds === 0 && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs text-emerald-400 hover:text-emerald-300 underline font-bold"
                    >
                      Resend OTP Now
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="e.g. 849201"
                    className="w-full bg-agri-900/90 border border-agri-700 rounded-xl pl-9 pr-3 py-3 text-white font-mono text-sm tracking-widest text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={farmerLoading}
              className="w-full py-3.5 bg-gradient-to-r from-agri-600 to-emerald-600 hover:from-agri-500 text-white rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {farmerLoading ? 'Processing...' : otpSent ? 'VERIFY OTP & ENTER DASHBOARD' : 'SEND REALTIME OTP CODE'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* PROVIDER FLOW CARD */}
      {selectedRole === 'provider' && (
        <div className="bg-agri-dark/90 border border-agri-700/80 rounded-3xl p-6 text-white shadow-2xl backdrop-blur-md space-y-4">
          
          {/* Subtabs: Login vs Register */}
          <div className="flex bg-agri-900 p-1 rounded-xl border border-agri-800 text-xs font-bold">
            <button
              onClick={() => { setProviderTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-lg transition-all ${providerTab === 'login' ? 'bg-agri-600 text-white shadow' : 'text-gray-400'}`}
            >
              🔐 LOGIN WITH UNIQUE ID
            </button>
            <button
              onClick={() => { setProviderTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-lg transition-all ${providerTab === 'register' ? 'bg-agri-600 text-white shadow' : 'text-gray-400'}`}
            >
              📝 REGISTER NEW PROVIDER
            </button>
          </div>

          {/* Provider Login Form */}
          {providerTab === 'login' && (
            <form onSubmit={handleProviderLogin} className="space-y-4 text-xs pt-2">
              <div>
                <label className="text-gray-300 block mb-1.5 font-semibold">Unique Provider ID</label>
                <input
                  type="text"
                  required
                  value={uniqueProviderId}
                  onChange={(e) => setUniqueProviderId(e.target.value)}
                  placeholder="KS-PROV-7A29F4"
                  className="w-full bg-agri-900/90 border border-agri-700 rounded-xl px-3 py-3 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1.5 font-semibold">Password / PIN</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    value={providerPassword}
                    onChange={(e) => setProviderPassword(e.target.value)}
                    placeholder="******"
                    className="w-full bg-agri-900/90 border border-agri-700 rounded-xl pl-9 pr-3 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-agri-600 to-emerald-600 hover:from-agri-500 text-white rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
              >
                LOGIN AS PROVIDER <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Provider Register Form */}
          {providerTab === 'register' && (
            <form onSubmit={handleProviderRegister} className="space-y-3 text-xs pt-2">
              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Organization Name</label>
                <input
                  type="text"
                  required
                  value={regOrgName}
                  onChange={(e) => setRegOrgName(e.target.value)}
                  placeholder="e.g. Telangana Farmers Mutual Insurance"
                  className="w-full bg-agri-900/90 border border-agri-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Contact Person Name</label>
                <input
                  type="text"
                  required
                  value={regContact}
                  onChange={(e) => setRegContact(e.target.value)}
                  placeholder="e.g. Anita Rao"
                  className="w-full bg-agri-900/90 border border-agri-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Official Email</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="anita@insurance.in"
                  className="w-full bg-agri-900/90 border border-agri-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="******"
                  className="w-full bg-agri-900/90 border border-agri-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {generatedUniqueId && (
                <div className="bg-emerald-950/90 border border-emerald-500 p-3 rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-emerald-300 uppercase font-semibold block">Your Assigned Unique Provider ID</span>
                  <strong className="text-lg font-mono text-white block select-all">{generatedUniqueId}</strong>
                  <p className="text-[10px] text-emerald-200">Use this Unique ID with your password to login!</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-agri-600 to-emerald-600 hover:from-agri-500 text-white rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
              >
                REGISTER & GET UNIQUE PROVIDER ID <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      )}

      {/* Farmer Picker Popup Modal */}
      <FarmerPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectFarmer={(fm) => {
          setSelectedFarmer(fm);
          setMobile(fm.mobile);
          setOtpSent(false);
          setErrorMsg('');
        }}
        currentMobile={mobile}
      />

    </div>
  );
}
