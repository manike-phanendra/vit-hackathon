import React, { useState, useRef, useEffect } from 'react';
import { Search, Globe, Calendar, Bell, Wifi, WifiOff, X, Check, CloudRain, Award, Shield, CheckCircle2, ChevronDown, RotateCcw, Zap } from 'lucide-react';

const PRESET_SEASONS = [
  { id: 'kharif-2026', label: 'Kharif 2026', start: '2026-06-01', end: '2026-09-30', tag: 'Jun 01 – Sep 30, 2026' },
  { id: 'rabi-2025', label: 'Rabi 2025–26', start: '2025-10-01', end: '2026-03-31', tag: 'Oct 01 – Mar 31' },
  { id: 'zaid-2026', label: 'Summer Zaid 2026', start: '2026-04-01', end: '2026-05-31', tag: 'Apr 01 – May 31' },
  { id: 'year-2026', label: 'Full Year 2026', start: '2026-01-01', end: '2026-12-31', tag: 'Jan 01 – Dec 31' }
];

export default function HeaderBar({ lang, setLang, userSession, isOnline, toggleOnline, dateRange, setDateRange, onOpenDeltaSyncModal }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const [tempStartDate, setTempStartDate] = useState(dateRange?.startDate || '2026-06-01');
  const [tempEndDate, setTempEndDate] = useState(dateRange?.endDate || '2026-09-30');

  const dropdownRef = useRef(null);
  const datePickerRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: lang === 'te' ? '₹20,000 పరిహారం ఆమోదించబడింది 💰' : '₹20,000 Payout Approved 💰',
      message: lang === 'te' ? 'వర్షపాతం నిబంధన థ్రెషోల్డ్ (28 మిమీ < 40 మిమీ) దాటినందున నేరుగా మీ బ్యాంకు ఖాతాకు జమ అవుతుంది.' : 'Low rainfall (28 mm < 40 mm) verified across 3 oracles. Direct bank transfer initiated.',
      time: '10 mins ago',
      type: 'payout',
      read: false
    },
    {
      id: 2,
      title: lang === 'te' ? '3 వాతావరణ ఆరాకిల్స్ సింక్ అయ్యాయి 📡' : '3 Weather Oracles Synced 📡',
      message: lang === 'te' ? 'IMD, NASA, Open-Meteo ద్వారా 96% విశ్వసనీయ స్కోరు నమోదు అయింది.' : 'IMD, NASA Power & Open-Meteo established 96% median consensus score.',
      time: '45 mins ago',
      type: 'oracle',
      read: false
    },
    {
      id: 3,
      title: lang === 'te' ? 'వరి పంట రక్షణ పాలసీ సక్రియం 🛡️' : 'Paddy Kharif Shield Active 🛡️',
      message: lang === 'te' ? '14 పొలాలకు సెప్టెంబరు 30, 2026 వరకు సంపూర్ణ రక్షణ వర్తిస్తుంది.' : '14 active fields covered under ₹20,000 policy shield until Sep 30, 2026.',
      time: '2 hours ago',
      type: 'policy',
      read: false
    },
    {
      id: 4,
      title: lang === 'te' ? 'ఆఫ్‌లైన్ క్యాచే నవీకరించబడింది 💾' : 'Offline Policy Cache Ready 💾',
      message: lang === 'te' ? 'ఇంటర్నెట్ లేకపోయినా పనిచేయడానికి సరికొత్త వివరాలు సేవ్ అయ్యాయి.' : 'Latest policy rules and weather logs cached for offline access.',
      time: 'Yesterday',
      type: 'offline',
      read: true
    }
  ]);

  // Sync temp state when dateRange prop changes
  useEffect(() => {
    if (dateRange?.startDate) setTempStartDate(dateRange.startDate);
    if (dateRange?.endDate) setTempEndDate(dateRange.endDate);
  }, [dateRange]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleNotifications = () => {
    setIsNotificationsOpen(prev => !prev);
    setUnreadCount(0);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatRangeLabel = (startStr, endStr) => {
    if (!startStr || !endStr) return 'Select Date Range';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sParts = startStr.split('-');
    const eParts = endStr.split('-');
    if (sParts.length !== 3 || eParts.length !== 3) return `${startStr} – ${endStr}`;
    
    const sM = months[parseInt(sParts[1], 10) - 1] || sParts[1];
    const sD = sParts[2];
    const sY = sParts[0];

    const eM = months[parseInt(eParts[1], 10) - 1] || eParts[1];
    const eD = eParts[2];
    const eY = eParts[0];

    if (sY === eY) {
      return `${sM} ${sD} – ${eM} ${eD}, ${sY}`;
    }
    return `${sM} ${sD}, ${sY} – ${eM} ${eD}, ${eY}`;
  };

  const handleApplyDateRange = () => {
    const newLabel = formatRangeLabel(tempStartDate, tempEndDate);
    if (setDateRange) {
      setDateRange({
        startDate: tempStartDate,
        endDate: tempEndDate,
        label: newLabel
      });
    }
    setIsDatePickerOpen(false);
  };

  return (
    <header className="sticky top-0 z-20 bg-[#0a1b12]/90 backdrop-blur-xl border-b border-emerald-500/20 px-6 py-3.5 flex flex-wrap justify-between items-center gap-4 text-white shadow-lg relative">
      
      {/* Search Input Box */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search fields, crops, weather stations, policy rules..."
            className="w-full bg-[#102419]/90 border border-emerald-500/30 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400/70 shadow-inner transition-all"
          />
        </div>
      </div>

      {/* Right Tools: Welcome, Date, Language, Delta Sync, Notifications, Offline Toggle, Avatar */}
      <div className="flex items-center space-x-3 text-xs">
        
        {/* Delta Sync Protocol Inspector Button */}
        <button
          onClick={onOpenDeltaSyncModal}
          className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow border cursor-pointer bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-500/40 hover:border-emerald-400"
          title="Click to Open Delta Sync & 1 Crore Offline Inspector"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>⚡ Delta Sync</span>
        </button>

        {/* Offline Mode Toggle Button */}
        <button
          onClick={toggleOnline}
          className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow border cursor-pointer ${
            isOnline
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
          }`}
          title="Toggle Offline Mode"
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
          <span>{isOnline ? '🟢 Online' : '📴 Offline Mode'}</span>
        </button>


        {/* Interactive Date Range Picker Button with Dropdown Popover */}
        <div className="relative" ref={datePickerRef}>
          <button
            onClick={() => {
              setTempStartDate(dateRange?.startDate || '2026-06-01');
              setTempEndDate(dateRange?.endDate || '2026-09-30');
              setIsDatePickerOpen(prev => !prev);
            }}
            className="hidden sm:flex items-center space-x-2 bg-[#102419]/90 hover:bg-emerald-950 border border-emerald-500/40 hover:border-emerald-400 px-3 py-1.5 rounded-xl font-mono text-emerald-300 transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
            title="Click to Change Analysis Date Range"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-bold text-xs">{dateRange?.label || 'Jun 01 – Sep 30, 2026'}</span>
            <ChevronDown className={`w-3 h-3 text-emerald-400/70 transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Date Range Picker Modal Popover */}
          {isDatePickerOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0a1b12]/95 border border-emerald-500/50 rounded-3xl shadow-2xl backdrop-blur-2xl z-50 text-white animate-fadeIn overflow-hidden p-4 space-y-4">
              {/* Popover Header */}
              <div className="flex justify-between items-center border-b border-emerald-900 pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-extrabold text-sm text-white">Select Analysis Date Range</h4>
                </div>
                <button
                  onClick={() => setIsDatePickerOpen(false)}
                  className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preset Seasonal Buttons */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 block">
                  ⚡ Quick Seasonal Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_SEASONS.map(preset => {
                    const isSelected = tempStartDate === preset.start && tempEndDate === preset.end;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setTempStartDate(preset.start);
                          setTempEndDate(preset.end);
                        }}
                        className={`px-3 py-2 rounded-xl text-left transition-all border text-xs cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 font-bold shadow'
                            : 'bg-[#102419] border-emerald-500/20 text-gray-300 hover:bg-emerald-950 hover:text-white'
                        }`}
                      >
                        <div className="font-semibold text-[11px]">{preset.label}</div>
                        <div className="text-[9px] text-gray-400 font-mono mt-0.5">{preset.tag}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Date Pickers: From & To */}
              <div className="space-y-2 pt-1 border-t border-emerald-900/60">
                <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 block">
                  🗓️ Custom From vs To Date Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-gray-300 block mb-1 font-semibold">From Date:</span>
                    <input
                      type="date"
                      value={tempStartDate}
                      onChange={(e) => setTempStartDate(e.target.value)}
                      className="w-full bg-[#102419] border border-emerald-500/40 rounded-xl px-2.5 py-1.5 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-300 block mb-1 font-semibold">To Date:</span>
                    <input
                      type="date"
                      value={tempEndDate}
                      onChange={(e) => setTempEndDate(e.target.value)}
                      className="w-full bg-[#102419] border border-emerald-500/40 rounded-xl px-2.5 py-1.5 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* Active Range Preview */}
              <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-gray-300 text-[11px]">Selected Window:</span>
                <span className="font-mono text-emerald-300 font-bold text-[11px]">
                  {formatRangeLabel(tempStartDate, tempEndDate)}
                </span>
              </div>

              {/* Footer Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => {
                    setTempStartDate('2026-06-01');
                    setTempEndDate('2026-09-30');
                  }}
                  className="px-3 py-1.5 bg-[#102419] hover:bg-emerald-900 border border-emerald-500/30 text-gray-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3 h-3 text-gray-400" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleApplyDateRange}
                  className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-emerald-400/40"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Apply Analysis Filter</span>
                </button>
              </div>

              <div className="text-[9px] text-gray-400 text-center font-mono pt-1">
                📊 Updates rainfall graphs, oracle consensus & parametric policy audits
              </div>
            </div>
          )}
        </div>

        {/* Language Picker */}
        <div className="flex items-center bg-[#102419]/90 rounded-xl p-1 border border-emerald-500/30">
          <Globe className="w-3.5 h-3.5 text-emerald-400 mx-1.5" />
          <button
            onClick={() => setLang('te')}
            className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer ${lang === 'te' ? 'bg-emerald-600 text-white shadow' : 'text-gray-300 hover:text-white'}`}
          >
            తెలుగు
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer ${lang === 'hi' ? 'bg-emerald-600 text-white shadow' : 'text-gray-300 hover:text-white'}`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer ${lang === 'en' ? 'bg-emerald-600 text-white shadow' : 'text-gray-300 hover:text-white'}`}
          >
            English
          </button>
        </div>

        {/* Notification Bell with Dropdown Popover */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleToggleNotifications}
            className="p-2 bg-[#102419]/90 hover:bg-emerald-950 border border-emerald-500/30 rounded-xl text-emerald-300 relative transition-all cursor-pointer focus:outline-none"
            title="View Notifications"
          >
            <Bell className="w-4 h-4 text-emerald-400" />
            {unreadCount > 0 && (
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full absolute -top-0.5 -right-0.5 ring-2 ring-[#0a1b12] animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full absolute -top-0.5 -right-0.5 ring-2 ring-[#0a1b12]" />
            )}
          </button>

          {/* Notifications Dropdown Modal */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0a1b12]/95 border border-emerald-500/40 rounded-3xl shadow-2xl backdrop-blur-2xl z-50 text-white animate-fadeIn overflow-hidden">
              
              {/* Popover Header */}
              <div className="p-4 bg-gradient-to-r from-emerald-950 to-green-950 border-b border-emerald-900 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-extrabold text-sm text-white">Live Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
                  >
                    Mark read
                  </button>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="p-1 text-gray-400 hover:text-white rounded-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-emerald-950">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-xs">
                    No new notifications right now 🌾
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-3.5 flex items-start space-x-3 transition-colors ${
                        !n.read ? 'bg-emerald-950/40' : 'hover:bg-emerald-950/20'
                      }`}
                    >
                      <div className="p-2 rounded-xl shrink-0 mt-0.5 bg-emerald-900/60 border border-emerald-500/30">
                        {n.type === 'payout' && <Award className="w-4 h-4 text-amber-400" />}
                        {n.type === 'oracle' && <CloudRain className="w-4 h-4 text-sky-400" />}
                        {n.type === 'policy' && <Shield className="w-4 h-4 text-emerald-400" />}
                        {n.type === 'offline' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <h5 className="font-bold text-xs text-white truncate">{n.title}</h5>
                          <span className="text-[9px] text-gray-400 font-mono shrink-0 ml-2">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-emerald-200/80 leading-snug">{n.message}</p>
                      </div>

                      <button
                        onClick={() => clearNotification(n.id)}
                        className="text-gray-500 hover:text-rose-400 p-1 shrink-0"
                        title="Dismiss"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Popover Footer */}
              <div className="p-2.5 bg-[#05110b] border-t border-emerald-900/60 text-center">
                <span className="text-[10px] text-emerald-400/80 font-mono">
                  🌾 KrishiShield Real-Time Parametric Audit Feed
                </span>
              </div>

            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center space-x-2 bg-[#102419]/90 border border-emerald-500/30 pl-2 pr-3 py-1 rounded-2xl">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center font-bold text-xs shadow text-white">
            {userSession?.name ? userSession.name[0] : 'R'}
          </div>
          <div className="text-left hidden md:block">
            <h4 className="text-[11px] font-bold text-white leading-tight">{userSession?.name || 'Ramesh Kumar'}</h4>
            <span className="text-[9px] text-emerald-400 block font-mono">{userSession?.role === 'provider' ? 'Provider' : 'Farmer'}</span>
          </div>
        </div>

      </div>

    </header>
  );
}

