import React from 'react';
import { 
  Shield, LayoutDashboard, FileText, Database, CloudRain, 
  Award, Settings, Bot, Sparkles, Wifi, WifiOff, Globe, LogOut, ChevronRight
} from 'lucide-react';

export default function SidebarNav({ currentRole, setRole, userSession, onLogout, lang, setLang, isOnline, toggleOnline }) {
  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 bg-[#0a1b12]/95 border-r border-emerald-500/20 backdrop-blur-xl flex flex-col justify-between p-4 text-white select-none z-30 overflow-y-auto">
      
      {/* Top Logo & App Title */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 px-2 cursor-pointer" onClick={() => setRole('dashboard')}>
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-700 rounded-2xl shadow-lg shadow-emerald-900/50 border border-emerald-400/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              KrishiShield <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded font-mono">AI</span>
            </h1>
            <p className="text-[11px] text-emerald-400/80 font-medium">Parametric Micro-Insurance</p>
          </div>
        </div>

        {/* User Profile Badge */}
        {userSession?.isLoggedIn && (
          <div className="bg-emerald-950/60 border border-emerald-800/60 p-3 rounded-2xl flex items-center space-x-3 backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white font-bold text-sm shadow">
              {userSession.role === 'farmer' ? '🌾' : '🏢'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{userSession.name || 'Ramesh Kumar'}</h4>
              <span className="text-[10px] text-emerald-300 font-mono block">
                {userSession.role === 'farmer' ? 'Farmer Profile' : 'Provider Admin'}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/70 px-3 block mb-2">Main Menu</span>

          <button
            onClick={() => setRole('dashboard')}
            className={`w-full px-3 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-between transition-all ${
              currentRole === 'dashboard' || currentRole === 'farmer' || currentRole === 'provider'
                ? 'bg-gradient-to-r from-emerald-600/90 to-green-700/90 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/30'
                : 'text-gray-400 hover:text-white hover:bg-emerald-950/40'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Dashboard</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500/60" />
          </button>

          <button
            onClick={() => setRole('policy')}
            className={`w-full px-3 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-between transition-all ${
              currentRole === 'policy'
                ? 'bg-gradient-to-r from-emerald-600/90 to-green-700/90 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/30'
                : 'text-gray-400 hover:text-white hover:bg-emerald-950/40'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{userSession?.role === 'provider' ? 'Farmer Policy Roster' : 'Crop & Policy'}</span>
            </div>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
              {userSession?.role === 'provider' ? 'Roster' : 'Active'}
            </span>
          </button>

          <button
            onClick={() => setRole('field')}
            className={`w-full px-3 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-between transition-all ${
              currentRole === 'field'
                ? 'bg-gradient-to-r from-emerald-600/90 to-green-700/90 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/30'
                : 'text-gray-400 hover:text-white hover:bg-emerald-950/40'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Database className="w-4 h-4 text-sky-400" />
              <span>Field Oracles</span>
            </div>
            <span className="text-[9px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-mono">3 Live</span>
          </button>

          <button
            onClick={() => setRole('weather')}
            className={`w-full px-3 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-between transition-all ${
              currentRole === 'weather'
                ? 'bg-gradient-to-r from-emerald-600/90 to-green-700/90 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/30'
                : 'text-gray-400 hover:text-white hover:bg-emerald-950/40'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <CloudRain className="w-4 h-4 text-sky-400" />
              <span>Weather & Soil</span>
            </div>
          </button>

          <button
            onClick={() => setRole('claims')}
            className={`w-full px-3 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-between transition-all ${
              currentRole === 'claims'
                ? 'bg-gradient-to-r from-emerald-600/90 to-green-700/90 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/30'
                : 'text-gray-400 hover:text-white hover:bg-emerald-950/40'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{userSession?.role === 'provider' ? 'Payout Approvals' : 'Claims & Payouts'}</span>
            </div>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
              {userSession?.role === 'provider' ? 'Approvals' : '₹20,000'}
            </span>
          </button>

          {userSession?.role === 'provider' && (
            <button
              onClick={() => setRole('admin')}
              className={`w-full px-3 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-between transition-all ${
                currentRole === 'admin'
                  ? 'bg-gradient-to-r from-emerald-600/90 to-green-700/90 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/30'
                  : 'text-gray-400 hover:text-white hover:bg-emerald-950/40'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Settings className="w-4 h-4 text-purple-400" />
                <span>Product Engine</span>
              </div>
            </button>
          )}

        </div>
      </div>

      {/* Bottom Floating AI Assistant Leaf Card */}
      <div className="space-y-3 pt-4">
        
        <div className="bg-gradient-to-br from-emerald-950/90 to-green-900/80 border border-emerald-500/30 rounded-2xl p-3.5 shadow-xl backdrop-blur-md relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center space-x-2 mb-1.5">
            <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h5 className="font-bold text-xs text-white flex items-center gap-1">
              AI Farming Assistant <Sparkles className="w-3 h-3 text-amber-400" />
            </h5>
          </div>
          <p className="text-[11px] text-emerald-200/80 leading-snug mb-2.5">
            Hello! I monitor your 3 weather feeds & trigger payouts automatically.
          </p>
          <button
            onClick={() => setRole('farmer')}
            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-xl shadow transition-all flex items-center justify-center gap-1"
          >
            Ask AI Assistant <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Network & Logout Controls */}
        <div className="flex items-center justify-between pt-1 text-xs border-t border-emerald-900/50">
          <button
            onClick={toggleOnline}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              isOnline
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </button>

          {userSession?.isLoggedIn && (
            <button
              onClick={onLogout}
              className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/50 transition-all flex items-center gap-1 text-[11px] font-bold"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          )}
        </div>

      </div>

    </aside>
  );
}
