import React from 'react';

export default function OfflineBanner({ onReconnect }) {
  return (
    <div className="mx-4 mt-3 mb-2 px-5 py-3.5 bg-[#fdf6e2] text-[#78350f] border border-[#fef08a]/70 rounded-xl shadow-sm animate-slideDown flex justify-between items-center flex-wrap gap-3 select-none">
      <div className="space-y-0.5">
        <h4 className="font-bold text-sm text-[#854d0e]">
          Offline mode is on
        </h4>
        <p className="text-xs text-[#92400e]/90 font-medium">
          Your latest policy is cached. New events will sync when you reconnect.
        </p>
      </div>

      <button
        onClick={onReconnect}
        className="text-xs font-bold text-[#854d0e] hover:text-[#78350f] hover:underline cursor-pointer bg-transparent border-none transition-all"
      >
        Reconnect
      </button>
    </div>
  );
}

