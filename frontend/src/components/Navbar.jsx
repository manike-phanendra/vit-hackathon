import React from 'react';
import { Shield, Wifi, WifiOff, Globe, LogOut, User, Layers, Database, FileText, Settings } from 'lucide-react';

export default function Navbar({ currentRole, setRole, lang, setLang, isOnline, toggleOnline, userSession, onLogout }) {
  const isFarmer = userSession?.role === 'farmer' || currentRole === 'farmer';
  const isProvider = userSession?.role === 'provider' || ['provider', 'field', 'claims', 'admin'].includes(currentRole);

  return (
    <header className="bg-agri-dark/95 backdrop-blur-md text-white shadow-xl border-b border-agri-800/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onLogout()}>
          <div className="p-2 bg-agri-600 rounded-lg text-white shadow">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
              🌾 KRISHISHIELD
            </h1>
            <p className="text-xs text-agri-100 font-medium">Offline-First Micro-Insurance</p>
          </div>
        </div>

        {/* Role-Scoped Navigation Bar */}
        {userSession?.isLoggedIn ? (
          <nav className="flex items-center bg-agri-900/90 p-1 rounded-xl border border-agri-800 text-xs font-semibold text-gray-300 overflow-x-auto">
            {/* FARMER SCOPED NAV: Only show Farmer View */}
            {userSession.role === 'farmer' && (
              <button
                onClick={() => setRole('farmer')}
                className="px-3 py-1.5 rounded-lg bg-agri-600 text-white shadow flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" /> Farmer Protection Dashboard
              </button>
            )}

            {/* PROVIDER SCOPED NAV: Show Provider views */}
            {userSession.role === 'provider' && (
              <>
                <button
                  onClick={() => setRole('provider')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    currentRole === 'provider' ? 'bg-agri-600 text-white shadow' : 'hover:text-white hover:bg-agri-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> Portfolio
                </button>
                <button
                  onClick={() => setRole('field')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    currentRole === 'field' ? 'bg-agri-600 text-white shadow' : 'hover:text-white hover:bg-agri-800'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" /> Field Oracles
                </button>
                <button
                  onClick={() => setRole('claims')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    currentRole === 'claims' ? 'bg-agri-600 text-white shadow' : 'hover:text-white hover:bg-agri-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Claims
                </button>
                <button
                  onClick={() => setRole('admin')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    currentRole === 'admin' ? 'bg-agri-600 text-white shadow' : 'hover:text-white hover:bg-agri-800'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" /> Product Builder
                </button>
              </>
            )}
          </nav>
        ) : null}

        {/* Right Controls: User Badge, Language & Logout */}
        <div className="flex items-center space-x-3">
          
          {/* User Session Badge */}
          {userSession?.isLoggedIn && (
            <span className="text-xs bg-emerald-950/80 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/40 font-semibold flex items-center gap-1.5">
              {userSession.role === 'farmer' ? `🌾 ${userSession.name || 'Farmer'} (Farmer)` : '🏢 Insurer Org'}
            </span>
          )}

          {/* Language Picker */}
          <div className="flex items-center bg-agri-900 rounded-lg p-1 border border-agri-800 text-xs">
            <Globe className="w-3.5 h-3.5 text-agri-500 mx-1.5" />
            <button
              onClick={() => setLang('te')}
              className={`px-2 py-1 rounded font-medium ${lang === 'te' ? 'bg-agri-600 text-white' : 'text-gray-300'}`}
            >
              తెలుగు
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2 py-1 rounded font-medium ${lang === 'hi' ? 'bg-agri-600 text-white' : 'text-gray-300'}`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded font-medium ${lang === 'en' ? 'bg-agri-600 text-white' : 'text-gray-300'}`}
            >
              English
            </button>
          </div>

          {/* Network Toggle Button */}
          <button
            onClick={toggleOnline}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              isOnline
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 animate-pulse'
            }`}
            title="Click to simulate network disconnect for Live Offline Demo"
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </button>

          {/* Logout Button */}
          {userSession?.isLoggedIn && (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700/60 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
              title="Logout of current session"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
