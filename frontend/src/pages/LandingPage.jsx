import React from 'react';
import { Shield, WifiOff, Volume2, Cpu, ArrowRight, Layers } from 'lucide-react';
import { en, te, hi } from '../i18n';

export default function LandingPage({ onSelectRole, lang = 'te' }) {
  const t = lang === 'te' ? te : lang === 'hi' ? hi : en;

  return (
    <div className="min-h-[85vh] bg-transparent text-white flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-4xl text-center space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-agri-600/30 border border-emerald-500/50 text-emerald-300 text-xs md:text-sm font-semibold shadow-2xl backdrop-blur-md">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Parametric Crop-Insurance Platform • FS-2604</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
          🌾 KRISHISHIELD
          <span className="block text-2xl md:text-4xl text-emerald-400 font-bold mt-3 drop-shadow">
            "{t.tagline}"
          </span>
        </h1>

        <p className="text-sm md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
          Multilingual, voice-enabled, offline-first micro-insurance protecting smallholder farmers. 
          Uses 3+ independent weather oracles with deterministic rules for instant payout authorization.
        </p>

        {/* Features Row with Frosted Glassmorphism */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-left">
          <div className="bg-agri-900/40 p-4 rounded-2xl border border-agri-700/50 backdrop-blur-md space-y-2 shadow-xl hover:border-emerald-500/50 transition-all">
            <WifiOff className="w-6 h-6 text-amber-400" />
            <h4 className="font-bold text-sm text-white">Offline-First</h4>
            <p className="text-xs text-gray-300">IndexedDB local queue continues operating without internet.</p>
          </div>
          <div className="bg-agri-900/40 p-4 rounded-2xl border border-agri-700/50 backdrop-blur-md space-y-2 shadow-xl hover:border-emerald-500/50 transition-all">
            <Cpu className="w-6 h-6 text-emerald-400" />
            <h4 className="font-bold text-sm text-white">3 Oracles</h4>
            <p className="text-xs text-gray-300">Median consensus filters stale & corrupted weather streams.</p>
          </div>
          <div className="bg-agri-900/40 p-4 rounded-2xl border border-agri-700/50 backdrop-blur-md space-y-2 shadow-xl hover:border-emerald-500/50 transition-all">
            <Volume2 className="w-6 h-6 text-sky-400" />
            <h4 className="font-bold text-sm text-white">Voice Assistant</h4>
            <p className="text-xs text-gray-300">Telugu, Hindi & English explanations & comprehension check.</p>
          </div>
          <div className="bg-agri-900/40 p-4 rounded-2xl border border-agri-700/50 backdrop-blur-md space-y-2 shadow-xl hover:border-emerald-500/50 transition-all">
            <Shield className="w-6 h-6 text-purple-400" />
            <h4 className="font-bold text-sm text-white">Idempotent</h4>
            <p className="text-xs text-gray-300">Hash-linked audit trail preventing duplicate payouts.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
          <button
            onClick={() => onSelectRole('farmer')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-agri-600 to-emerald-600 hover:from-agri-500 hover:to-emerald-500 text-white rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 shadow-2xl transition-all transform hover:scale-105"
          >
            🌾 I'M A FARMER <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onSelectRole('provider')}
            className="w-full sm:w-auto px-8 py-4 bg-agri-900/80 hover:bg-agri-800 border border-agri-700 text-emerald-300 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 backdrop-blur-md transition-all"
          >
            🏢 PROVIDER LOGIN <Layers className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
