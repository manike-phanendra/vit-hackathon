import React, { useState, useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import SidebarNav from './components/SidebarNav';
import HeaderBar from './components/HeaderBar';
import OfflineBanner from './components/OfflineBanner';
import AIAssistantDrawer from './components/AIAssistantDrawer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AgriMainDashboard from './pages/AgriMainDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import FieldDataDashboard from './pages/FieldDataDashboard';
import ClaimsDashboard from './pages/ClaimsDashboard';
import AdminDashboard from './pages/AdminDashboard';
import WeatherSoilWidget from './components/WeatherSoilWidget';
import { processOfflineSyncQueue } from './services/syncEngine';

export default function App() {
  const [role, setRole] = useState('login'); // Default initial view is Login screen
  const [userSession, setUserSession] = useState({ isLoggedIn: false, role: null, name: '', user_id: 'USR-101' });
  const [lang, setLang] = useState('te'); // te | hi | en
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(2);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '2026-06-01',
    endDate: '2026-09-30',
    label: 'Jun 01 – Sep 30, 2026'
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState) {
      triggerSync();
    }
  };

  const triggerSync = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setTimeout(async () => {
      await processOfflineSyncQueue();
      setPendingSyncCount(0);
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    }, 1500);
  };

  const handleLoginSuccess = (userData) => {
    const roleType = typeof userData === 'string' ? userData : userData.role;
    const userId = userData?.user_id || 'USR-101';
    const userName = userData?.name || 'Ramesh Kumar';

    if (roleType === 'farmer') {
      setUserSession({ isLoggedIn: true, role: 'farmer', name: userName, user_id: userId });
      setRole('dashboard');
    } else {
      setUserSession({ isLoggedIn: true, role: 'provider', name: userName, user_id: 'PROV-001' });
      setRole('provider');
    }
  };

  const handleLogout = () => {
    setUserSession({ isLoggedIn: false, role: null, name: '', user_id: 'USR-101' });
    setRole('login');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed font-sans text-gray-100 flex relative selection:bg-emerald-500 selection:text-white"
      style={{ backgroundImage: "url('/bg-farm.png')" }}
    >
      {/* Lightened Dark Glass Overlay so the vibrant paddy field sunrise image is clearly visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/60 backdrop-blur-[1px] pointer-events-none" />

      {/* Full Layout: Sidebar + Main Workspace */}
      <div className="relative z-10 flex w-full min-h-screen">
        
        {/* Left Sidebar Navigation (When Logged In) */}
        {userSession.isLoggedIn && (
          <SidebarNav
            currentRole={role}
            setRole={setRole}
            userSession={userSession}
            onLogout={handleLogout}
            lang={lang}
            setLang={setLang}
            isOnline={isOnline}
            toggleOnline={toggleOnline}
          />
        )}

        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          
          {/* Top Header Bar */}
          <HeaderBar
            lang={lang}
            setLang={setLang}
            userSession={userSession}
            isOnline={isOnline}
            toggleOnline={toggleOnline}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />

          {/* Offline Mode Alert Banner */}
          {!isOnline && (
            <OfflineBanner
              onReconnect={toggleOnline}
            />
          )}

          {/* Main Role-Based Workspace Views */}
          <main className="flex-1 overflow-y-auto">
            {role === 'landing' && <LandingPage onSelectRole={(r) => setRole(r)} lang={lang} />}
            {role === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
            
            {/* Logged-In Role Views */}
            {userSession.isLoggedIn && userSession.role === 'provider' ? (
              <>
                {(role === 'dashboard' || role === 'provider') && (
                  <ProviderDashboard userSession={userSession} viewMode="dashboard" setRole={setRole} dateRange={dateRange} />
                )}
                {role === 'policy' && (
                  <ProviderDashboard userSession={userSession} viewMode="policy" setRole={setRole} dateRange={dateRange} />
                )}
                {role === 'claims' && (
                  <ProviderDashboard userSession={userSession} viewMode="claims" setRole={setRole} dateRange={dateRange} />
                )}
                {role === 'field' && <FieldDataDashboard dateRange={dateRange} />}
                {role === 'weather' && (
                  <div className="max-w-4xl mx-auto p-6">
                    <WeatherSoilWidget dateRange={dateRange} />
                  </div>
                )}
                {role === 'admin' && <AdminDashboard dateRange={dateRange} />}
              </>
            ) : (
              <>
                {(role === 'dashboard' || (role === 'farmer' && userSession.role === 'farmer')) && (
                  <AgriMainDashboard lang={lang} isOnline={isOnline} userSession={userSession} dateRange={dateRange} />
                )}
                {role === 'policy' && <FarmerDashboard lang={lang} isOnline={isOnline} initialFarmerId={userSession.user_id} dateRange={dateRange} />}
                {role === 'provider' && <ProviderDashboard userSession={userSession} dateRange={dateRange} />}
                {role === 'field' && <FieldDataDashboard dateRange={dateRange} />}
                {role === 'weather' && (
                  <div className="max-w-4xl mx-auto p-6">
                    <WeatherSoilWidget dateRange={dateRange} />
                  </div>
                )}
                {role === 'claims' && <ClaimsDashboard dateRange={dateRange} />}
                {role === 'admin' && <AdminDashboard dateRange={dateRange} />}
              </>
            )}

            {/* Fallback Guard */}
            {!userSession.isLoggedIn && role !== 'login' && role !== 'landing' && (
              <div className="max-w-md mx-auto my-12 p-6 bg-[#102419]/90 border border-emerald-500/40 rounded-3xl text-center space-y-4 shadow-2xl backdrop-blur-xl">
                <h3 className="text-xl font-bold text-amber-400">Authentication Required</h3>
                <p className="text-xs text-gray-300">Please login to access your specific dashboard.</p>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg"
                >
                  Go to Login Screen
                </button>
              </div>
            )}
          </main>

          {/* Floating AI Assistant Trigger Button */}
          {!isAIChatOpen && (
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="fixed bottom-6 right-6 px-4 py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-2xl font-extrabold text-xs shadow-2xl border border-emerald-400/50 flex items-center gap-2 z-40 animate-pulseGlow transition-all transform hover:scale-105"
            >
              <Bot className="w-5 h-5 text-amber-300 animate-bounce" />
              <span>AI Assistant</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}

          {/* AI Assistant Chat Drawer */}
          <AIAssistantDrawer
            isOpen={isAIChatOpen}
            onClose={() => setIsAIChatOpen(false)}
            lang={lang}
          />

          {/* Footer */}
          <footer className="border-t border-emerald-900/60 bg-black/90 backdrop-blur-md py-3 px-6 text-center text-xs text-gray-400">
            <p>🌾 <strong>KrishiShield AI</strong> — FS-2604 Parametric Insurance Engine. <em>"AI explains. Rules decide."</em></p>
          </footer>

        </div>

      </div>

    </div>
  );
}
