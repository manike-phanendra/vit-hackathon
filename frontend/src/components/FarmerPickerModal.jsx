import React from 'react';
import { X, UserCheck, MapPin, Smartphone, ShieldCheck, Check } from 'lucide-react';
import { getCropTheme } from '../services/cropThemes';

export default function FarmerPickerModal({ isOpen, onClose, onSelectFarmer, currentMobile }) {
  if (!isOpen) return null;

  const demoFarmers = [
    { name: "Manikanta (Verified Farmer)", location: "Warangal", crop: "Paddy", mobile: "+91 99121 67277", id: "USR-109", status: "TRIGGERED (₹20,000 Paid)" },
    { name: "Ramesh Kumar", location: "Warangal", crop: "Paddy", mobile: "+91 98765 43210", id: "USR-101", status: "TRIGGERED (₹20,000 Paid)" },
    { name: "Suresh Patel", location: "Karimnagar", crop: "Paddy", mobile: "+91 98765 43211", id: "USR-102", status: "ACTIVE (No Trigger)" },
    { name: "Anitha Devi", location: "Nalgonda", crop: "Cotton", mobile: "+91 98765 43212", id: "USR-103", status: "TRIGGERED (₹15,000 Paid)" },
    { name: "Kiran Rao", location: "Khammam", crop: "Groundnut", mobile: "+91 98765 43213", id: "USR-104", status: "ACTIVE (No Trigger)" },
    { name: "Venkatesh Naik", location: "Mahabubnagar", crop: "Paddy", mobile: "+91 98765 43214", id: "USR-105", status: "TRIGGERED (₹20,000 Paid)" },
    { name: "Laxmi Bai", location: "Nizamabad", crop: "Cotton", mobile: "+91 98765 43215", id: "USR-106", status: "TRIGGERED (₹25,000 Paid)" },
    { name: "Mallesh Goud", location: "Medak", crop: "Cotton", mobile: "+91 98765 43216", id: "USR-107", status: "REVIEW (Data Variance)" },
    { name: "Balu Rathod", location: "Adilabad", crop: "Maize", mobile: "+91 98765 43217", id: "USR-108", status: "TRIGGERED (₹15,000 Paid)" }
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn select-none">
      <div className="bg-[#0a1b12]/95 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-emerald-900/60 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-400/40">
              <UserCheck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Select Farmer Account</h3>
              <p className="text-[11px] text-emerald-400/80">Choose a registered farmer to populate mobile & OTP</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-emerald-900/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Farmer List Cards */}
        <div className="grid grid-cols-1 gap-2.5 text-xs">
          {demoFarmers.map((fm) => {
            const isSelected = currentMobile === fm.mobile;
            const theme = getCropTheme(fm.crop);
            return (
              <button
                key={fm.id}
                onClick={() => {
                  onSelectFarmer(fm);
                  onClose();
                }}
                className={`relative overflow-hidden p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all transform hover:scale-[1.01] ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-900 to-green-900 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-400/40'
                    : 'bg-[#102419]/90 border-emerald-500/20 text-gray-300 hover:border-emerald-500/50 hover:bg-[#102419]'
                }`}
              >
                {/* Crop Photo Background Watermark */}
                <div 
                  className="absolute right-0 top-0 bottom-0 w-1/3 bg-cover bg-center opacity-15 filter contrast-125 pointer-events-none rounded-r-2xl"
                  style={{ backgroundImage: `url(${theme.bgImage})` }}
                />

                <div className="relative z-10 space-y-1">
                  <div className="flex items-center space-x-2">
                    <strong className="text-sm font-bold text-white">{fm.name}</strong>
                    <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded font-mono border border-emerald-800">
                      {fm.id}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-gray-300">
                    <span className="flex items-center gap-1 font-mono text-emerald-400">
                      <Smartphone className="w-3 h-3" /> {fm.mobile}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-400" /> {fm.location}
                    </span>
                    <span className="font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                      <span>{theme.emoji}</span> {fm.crop}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 text-right space-y-1">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold block ${
                    fm.status.includes('TRIGGERED')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : fm.status.includes('REVIEW')
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {fm.status}
                  </span>
                  {isSelected && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
                      <Check className="w-4 h-4" /> Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
