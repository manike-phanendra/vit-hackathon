import React, { useState, useEffect } from 'react';
import { ShieldCheck, CloudRain, Award, AlertCircle, Volume2, CheckCircle2, Lock, UserCheck, Sprout, MapPin } from 'lucide-react';
import VoiceButton from '../components/VoiceButton';
import VoiceDisclosureModal from '../components/VoiceDisclosureModal';
import AIExplanationLog from '../components/AIExplanationLog';
import { getCropTheme } from '../services/cropThemes';

const FARMER_DATA_MAP = {
  "USR-109": {
    user_id: "USR-109",
    name: "Manikanta (Verified Farmer)",
    mobile_number: "+91 99121 67277",
    location: "Warangal",
    station_id: "ST-001 (Warangal Central)",
    crop: "Paddy",
    policy_id: "POL-10490",
    coverage: 20000,
    premium: 499,
    status: "TRIGGERED",
    start_date: "2026-06-01",
    end_date: "2026-09-30",
    current_rainfall_mm: 27.5,
    threshold_mm: 40.0,
    diff_percent: 31.2,
    trigger_detected: true,
    payout_id: "PAY-88215",
    event_id: "EVT-90889",
    payout_amount: 20000,
    payout_status: "PAID",
    payout_badge: "STATUS: PAID (EVT-90889)",
    protection_title: "⚡ TRIGGER DETECTED",
    protection_match: "REALTIME MOBILE VERIFIED RULE MATCH",
    protection_desc: "Rainfall 27.5 mm < 40.0 mm threshold rule satisfied.",
    consensus_text: "3/3 Sources Healthy"
  },
  "USR-101": {
    user_id: "USR-101",
    name: "Ramesh Kumar",
    mobile_number: "+91 98765 43210",
    location: "Warangal",
    station_id: "ST-001 (Warangal Central)",
    crop: "Paddy",
    policy_id: "POL-10482",
    coverage: 20000,
    premium: 499,
    status: "TRIGGERED",
    start_date: "2026-06-01",
    end_date: "2026-09-30",
    current_rainfall_mm: 28.0,
    threshold_mm: 40.0,
    diff_percent: 30.0,
    trigger_detected: true,
    payout_id: "PAY-88210",
    event_id: "EVT-90881",
    payout_amount: 20000,
    payout_status: "PAID",
    payout_badge: "STATUS: PAID (EVT-90881)",
    protection_title: "⚡ TRIGGER DETECTED",
    protection_match: "AUTOMATIC RULE MATCH",
    protection_desc: "Rainfall 28.0 mm < 40.0 mm threshold rule satisfied.",
    consensus_text: "3/3 Sources Healthy"
  },
  "USR-102": {
    user_id: "USR-102",
    name: "Suresh Patel",
    mobile_number: "+91 98765 43211",
    location: "Karimnagar",
    station_id: "ST-002 (Karimnagar North)",
    crop: "Paddy",
    policy_id: "POL-10483",
    coverage: 20000,
    premium: 499,
    status: "ACTIVE",
    start_date: "2026-06-01",
    end_date: "2026-09-30",
    current_rainfall_mm: 45.5,
    threshold_mm: 40.0,
    diff_percent: 0,
    trigger_detected: false,
    payout_id: "N/A",
    event_id: "N/A",
    payout_amount: 0,
    payout_status: "NO_TRIGGER",
    payout_badge: "STATUS: NO TRIGGER (CONDITIONS MET)",
    protection_title: "🟢 POLICY ACTIVE (NO TRIGGER)",
    protection_match: "HEALTHY MONSOON CONDITIONS",
    protection_desc: "Rainfall 45.5 mm is above 40.0 mm threshold (+13.8% rain recorded).",
    consensus_text: "3/3 Sources Healthy"
  },
  "USR-103": {
    user_id: "USR-103",
    name: "Anitha Devi",
    mobile_number: "+91 98765 43212",
    location: "Nalgonda",
    station_id: "ST-003 (Nalgonda South)",
    crop: "Cotton",
    policy_id: "POL-10484",
    coverage: 15000,
    premium: 399,
    status: "TRIGGERED",
    start_date: "2026-06-01",
    end_date: "2026-09-30",
    current_rainfall_mm: 22.0,
    threshold_mm: 35.0,
    diff_percent: 37.1,
    trigger_detected: true,
    payout_id: "PAY-88211",
    event_id: "EVT-90882",
    payout_amount: 15000,
    payout_status: "PAID",
    payout_badge: "STATUS: PAID (EVT-90882)",
    protection_title: "⚡ TRIGGER DETECTED",
    protection_match: "COTTON DROUGHT RULE MATCH",
    protection_desc: "Rainfall 22.0 mm < 35.0 mm threshold rule satisfied.",
    consensus_text: "3/3 Sources Healthy"
  },
  "USR-104": {
    user_id: "USR-104",
    name: "Kiran Rao",
    mobile_number: "+91 98765 43213",
    location: "Khammam",
    station_id: "ST-004 (Khammam East)",
    crop: "Groundnut",
    policy_id: "POL-10485",
    coverage: 18000,
    premium: 349,
    status: "ACTIVE",
    start_date: "2026-06-01",
    end_date: "2026-09-30",
    current_rainfall_mm: 48.0,
    threshold_mm: 30.0,
    diff_percent: 0,
    trigger_detected: false,
    payout_id: "N/A",
    event_id: "N/A",
    payout_amount: 0,
    payout_status: "NO_TRIGGER",
    payout_badge: "STATUS: NO TRIGGER (OPTIMAL GROWTH)",
    protection_title: "🟢 POLICY ACTIVE (NO TRIGGER)",
    protection_match: "OPTIMAL WEATHER CONDITIONS",
    protection_desc: "Rainfall 48.0 mm is above 30.0 mm threshold (+60% rain recorded).",
    consensus_text: "3/3 Sources Healthy"
  },
  "USR-105": {
    user_id: "USR-105",
    name: "Venkatesh Naik",
    mobile_number: "+91 98765 43214",
    location: "Mahabubnagar",
    station_id: "ST-005 (Mahabubnagar West)",
    crop: "Paddy",
    policy_id: "POL-10486",
    coverage: 20000,
    premium: 499,
    status: "TRIGGERED",
    start_date: "2026-06-01",
    end_date: "2026-09-30",
    current_rainfall_mm: 26.5,
    threshold_mm: 40.0,
    diff_percent: 33.7,
    trigger_detected: true,
    payout_id: "PAY-88212",
    event_id: "EVT-90883",
    payout_amount: 20000,
    payout_status: "PAID",
    payout_badge: "STATUS: PAID (EVT-90883)",
    protection_title: "⚡ TRIGGER DETECTED",
    protection_match: "AUTOMATIC RULE MATCH",
    protection_desc: "Rainfall 26.5 mm < 40.0 mm threshold rule satisfied.",
    consensus_text: "3/3 Sources Healthy"
  },
  "USR-106": {
    user_id: "USR-106",
    name: "Laxmi Bai",
    mobile_number: "+91 98765 43215",
    location: "Nizamabad",
    station_id: "ST-006 (Nizamabad Central)",
    crop: "Cotton",
    policy_id: "POL-10487",
    coverage: 25000,
    premium: 599,
    status: "TRIGGERED",
    start_date: "2026-06-01",
    end_date: "2026-09-30",
    current_rainfall_mm: 18.0,
    threshold_mm: 30.0,
    diff_percent: 40.0,
    trigger_detected: true,
    payout_id: "PAY-88213",
    event_id: "EVT-90884",
    payout_amount: 25000,
    payout_status: "PAID",
    payout_badge: "STATUS: PAID (EVT-90884)",
    protection_title: "⚡ TRIGGER DETECTED",
    protection_match: "COTTON SEVERE DEFICIT MATCH",
    protection_desc: "Rainfall 18.0 mm < 30.0 mm threshold rule satisfied.",
    consensus_text: "3/3 Sources Healthy"
  },
  "USR-107": {
    user_id: "USR-107",
    name: "Mallesh Goud",
    mobile_number: "+91 98765 43216",
    location: "Medak",
    station_id: "ST-007 (Medak Rural)",
    crop: "Cotton",
    policy_id: "POL-10488",
    coverage: 15000,
    premium: 399,
    status: "REVIEW",
    start_date: "2026-06-01",
    end_date: "2026-09-30",
    current_rainfall_mm: 34.8,
    threshold_mm: 35.0,
    diff_percent: 0.5,
    trigger_detected: true,
    payout_id: "PAY-PENDING",
    event_id: "EVT-90887",
    payout_amount: 15000,
    payout_status: "REVIEW",
    payout_badge: "STATUS: UNDER ORACLE REVIEW",
    protection_title: "🔍 UNDER ORACLE REVIEW",
    protection_match: "DATA VARIANCE AUDIT",
    protection_desc: "Station reading 34.8 mm vs Satellite 37.2 mm. Quorum under 24-hr review.",
    consensus_text: "2/3 Sources (Oracle C Outlier)"
  },
  "USR-108": {
    user_id: "USR-108",
    name: "Balu Rathod",
    mobile_number: "+91 98765 43217",
    location: "Adilabad",
    station_id: "ST-008 (Adilabad North)",
    crop: "Maize",
    policy_id: "POL-10489",
    coverage: 15000,
    premium: 329,
    status: "TRIGGERED",
    start_date: "2026-06-01",
    end_date: "2026-09-30",
    current_rainfall_mm: 24.0,
    threshold_mm: 35.0,
    diff_percent: 31.4,
    trigger_detected: true,
    payout_id: "PAY-88214",
    event_id: "EVT-90888",
    payout_amount: 15000,
    payout_status: "PAID",
    payout_badge: "STATUS: PAID (EVT-90888)",
    protection_title: "⚡ TRIGGER DETECTED",
    protection_match: "MAIZE DROUGHT MATCH",
    protection_desc: "Rainfall 24.0 mm < 35.0 mm threshold rule satisfied.",
    consensus_text: "3/3 Sources Healthy"
  }
};

export default function FarmerDashboard({ lang = 'te', isOnline, initialFarmerId = "USR-109" }) {
  const [selectedFarmerId, setSelectedFarmerId] = useState(initialFarmerId);
  const [showDisclosureModal, setShowDisclosureModal] = useState(false);
  const [purchaseSuccessMsg, setPurchaseSuccessMsg] = useState("");

  useEffect(() => {
    if (initialFarmerId) {
      setSelectedFarmerId(initialFarmerId);
    }
  }, [initialFarmerId]);

  const currentData = FARMER_DATA_MAP[selectedFarmerId] || FARMER_DATA_MAP["USR-109"];
  const cropTheme = getCropTheme(currentData.crop);

  const handleBuyPolicyConfirm = () => {
    setShowDisclosureModal(false);
    setPurchaseSuccessMsg("✅ Policy successfully bound and protected locally!");
    setTimeout(() => setPurchaseSuccessMsg(""), 5000);
  };

  return (
    <div className="relative rounded-3xl p-2 md:p-4 overflow-hidden transition-all duration-700">
      
      {/* Dynamic Ambient Background Image of Farmer's Crop */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105 opacity-25 filter blur-[2px] pointer-events-none rounded-3xl"
        style={{ backgroundImage: `url(${cropTheme.bgImage})` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${cropTheme.overlayGradient} transition-all duration-700 pointer-events-none rounded-3xl`} />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">

        {/* Header Banner with Dynamic Crop Photo Background */}
        <div className="relative overflow-hidden rounded-3xl border border-agri-700/80 shadow-2xl backdrop-blur-md animate-slideUp">
          
          {/* Banner Crop Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-40 filter contrast-125"
            style={{ backgroundImage: `url(${cropTheme.bgImage})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${cropTheme.headerBg} transition-all duration-700`} />

          <div className="relative z-10 p-6 flex justify-between items-center flex-wrap gap-4 text-white">
            <div className="space-y-1.5 max-w-lg">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/50 border border-white/20 backdrop-blur text-emerald-300 flex items-center gap-1.5 shadow">
                  <span className="text-base">{cropTheme.emoji}</span> {currentData.crop.toUpperCase()} CROP PROTECTION
                </span>
                <span className="text-[10px] text-sky-200 bg-sky-950/70 border border-sky-500/40 px-2 py-0.5 rounded-full font-mono">
                  {cropTheme.growthStage}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow-md">Welcome, {currentData.name}</h2>
              <p className="text-xs text-gray-200 drop-shadow flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-400" /> Location: <strong>{currentData.location}, Telangana</strong></span>
                <span>• Mobile: <strong>{currentData.mobile_number}</strong></span>
                <span>• ID: <strong className="font-mono text-emerald-300">{currentData.user_id}</strong></span>
              </p>
              <div className="pt-1 flex items-center gap-2">
                <span className="text-[11px] text-amber-200 bg-amber-950/70 border border-amber-500/40 px-2.5 py-0.5 rounded-lg font-medium flex items-center gap-1">
                  <Sprout className="w-3 h-3 text-amber-400" /> Soil: {cropTheme.soilType}
                </span>
              </div>
            </div>

            {/* Farmer Profile Selector Dropdown */}
            <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-lg">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <select
                value={selectedFarmerId}
                onChange={(e) => setSelectedFarmerId(e.target.value)}
                className="bg-[#0b1c13] border border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-emerald-300 font-bold focus:outline-none focus:border-emerald-400 cursor-pointer shadow"
              >
                {Object.values(FARMER_DATA_MAP).map(f => {
                  const theme = getCropTheme(f.crop);
                  return (
                    <option key={f.user_id} value={f.user_id}>
                      {theme.emoji} {f.name} ({f.location} • {f.crop})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

      {purchaseSuccessMsg && (
        <div className="bg-emerald-900/90 text-emerald-200 border border-emerald-600 p-4 rounded-2xl text-sm font-bold shadow-lg animate-fadeIn flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {purchaseSuccessMsg}
        </div>
      )}

      {/* Main 4 Cards Grid with Distinct Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Card 1: My Policy */}
        <div className="bg-agri-dark/90 border border-agri-700/80 p-6 rounded-3xl text-white shadow-2xl backdrop-blur-md space-y-4 relative overflow-hidden card-hover-effect animate-slideUp anim-delay-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400 animate-float" />
              <h3 className="font-bold text-lg text-white">My Policy</h3>
            </div>
            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
              currentData.status === 'TRIGGERED'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulseGlow'
                : currentData.status === 'REVIEW'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}>
              {currentData.status === 'TRIGGERED' ? '⚡ PAYOUT TRIGGERED' : currentData.status === 'REVIEW' ? '🔍 UNDER REVIEW' : '🟢 POLICY ACTIVE'}
            </span>
          </div>

          <div className="space-y-2 text-sm border-t border-agri-800 pt-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Policy ID</span>
              <strong className="text-emerald-400 font-mono">{currentData.policy_id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Crop</span>
              <strong className="text-white">{currentData.crop}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Coverage</span>
              <strong className="text-emerald-300 font-bold">₹{currentData.coverage.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Premium</span>
              <strong className="text-gray-200">₹{currentData.premium}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Policy Period</span>
              <span className="text-xs font-mono text-gray-300">{currentData.start_date} – {currentData.end_date}</span>
            </div>
          </div>

          <button
            onClick={() => setShowDisclosureModal(true)}
            className="w-full py-2.5 bg-agri-800/90 hover:bg-agri-700 text-emerald-300 rounded-xl font-semibold text-xs border border-agri-600 transition-all transform hover:scale-102 flex items-center justify-center gap-2"
          >
            🔊 Buy / Review Policy with Voice Disclosure
          </button>
        </div>

        {/* Card 2: Rainfall Monitor */}
        <div className="bg-agri-dark/90 border border-agri-700/80 p-6 rounded-3xl text-white shadow-2xl backdrop-blur-md space-y-4 card-hover-effect animate-slideUp anim-delay-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <CloudRain className="w-6 h-6 text-sky-400 animate-bounce" />
              <h3 className="font-bold text-lg text-white">Rainfall Monitor</h3>
            </div>
            <span className="text-xs bg-sky-950/80 text-sky-300 border border-sky-800 px-2.5 py-1 rounded-full font-mono">
              {currentData.station_id}
            </span>
          </div>

          <div className="text-center py-2 space-y-1">
            <span className="text-4xl font-extrabold text-white tracking-tight">
              {currentData.current_rainfall_mm} <span className="text-lg font-normal text-sky-300">mm</span>
            </span>
            {currentData.diff_percent > 0 ? (
              <p className="text-xs text-amber-400 font-semibold flex items-center justify-center gap-1">
                ↓ {currentData.diff_percent}% below threshold ({currentData.threshold_mm} mm)
              </p>
            ) : (
              <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                ↑ Above threshold ({currentData.threshold_mm} mm)
              </p>
            )}
          </div>

          <div className="bg-agri-900/90 p-3 rounded-2xl border border-agri-800 text-xs flex justify-between items-center text-gray-300">
            <span>Oracle Consensus</span>
            <strong className="text-emerald-400 font-bold">{currentData.consensus_text}</strong>
          </div>
        </div>

        {/* Card 3: Protection Status */}
        <div className="bg-agri-dark/90 border border-agri-700/80 p-6 rounded-3xl text-white shadow-2xl backdrop-blur-md space-y-4 card-hover-effect animate-slideUp anim-delay-300">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-amber-400 animate-pulse" />
            <h3 className="font-bold text-lg text-white">Protection Status</h3>
          </div>

          <div className={`p-4 rounded-2xl text-center space-y-1 border ${
            currentData.status === 'TRIGGERED'
              ? 'bg-amber-950/70 border-amber-600/60'
              : currentData.status === 'REVIEW'
              ? 'bg-purple-950/70 border-purple-600/60'
              : 'bg-emerald-950/70 border-emerald-600/60'
          }`}>
            <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block">{currentData.protection_match}</span>
            <strong className={`text-xl font-black tracking-wide block ${
              currentData.status === 'TRIGGERED' ? 'text-amber-400' : currentData.status === 'REVIEW' ? 'text-purple-300' : 'text-emerald-400'
            }`}>
              {currentData.protection_title}
            </strong>
            <p className="text-[11px] text-gray-200">{currentData.protection_desc}</p>
          </div>
        </div>

        {/* Card 4: Payout Card */}
        <div className={`bg-agri-dark/90 border p-6 rounded-3xl text-white shadow-2xl backdrop-blur-md space-y-4 card-hover-effect animate-slideUp anim-delay-400 ${
          currentData.payout_status === 'PAID' ? 'border-emerald-500/40 animate-pulseGlow' : 'border-agri-700/80'
        }`}>
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-emerald-400 animate-bounce" />
            <h3 className="font-bold text-lg text-white">Payout Status</h3>
          </div>

          <div className={`p-4 rounded-2xl text-center space-y-1 border ${
            currentData.payout_status === 'PAID'
              ? 'bg-emerald-950/70 border-emerald-600/60'
              : currentData.payout_status === 'REVIEW'
              ? 'bg-purple-950/70 border-purple-600/60'
              : 'bg-agri-950/70 border-agri-800'
          }`}>
            <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">IDEMPOTENT PAYOUT ENGINE</span>
            <strong className={`text-3xl font-extrabold tracking-tight block ${
              currentData.payout_status === 'NO_TRIGGER' ? 'text-gray-400' : 'text-emerald-400'
            }`}>
              {currentData.payout_status === 'NO_TRIGGER' ? '₹0' : `₹${currentData.payout_amount.toLocaleString()}`}
            </strong>
            <span className="text-[11px] text-emerald-300 font-semibold bg-emerald-900/80 px-2.5 py-0.5 rounded-full inline-block mt-1">
              {currentData.payout_badge}
            </span>
          </div>
        </div>

      </div> {/* Close grid grid-cols-1 md:grid-cols-2 */}

      {/* Voice Assistant Center */}
      <div className="bg-agri-dark/90 border border-agri-700/80 p-6 rounded-3xl text-white shadow-2xl backdrop-blur-md text-center space-y-4 card-hover-effect animate-slideUp">
        <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">🔊 Voice Assistant & Policy Explanation</h4>
        <VoiceButton lang={lang} farmerData={currentData} />
      </div>

      {/* Previous AI / LLM Explanation Log */}
      <div className="animate-slideUp">
        <AIExplanationLog lang={lang} />
      </div>

      {/* Voice Disclosure Modal */}
      <VoiceDisclosureModal
        isOpen={showDisclosureModal}
        onClose={() => setShowDisclosureModal(false)}
        onConfirm={handleBuyPolicyConfirm}
        product={{ name: currentData.crop, premium: currentData.premium, coverage: currentData.coverage }}
        lang={lang}
      />

      </div>
    </div>
  );
}
