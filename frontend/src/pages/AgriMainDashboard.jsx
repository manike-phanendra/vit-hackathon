import React, { useState } from 'react';
import { 
  ShieldCheck, CloudRain, Award, AlertCircle, Sparkles, Sprout, Layers, Activity, TrendingUp, CheckCircle2, Calendar 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SatelliteLocusWidget from '../components/SatelliteLocusWidget';
import WeatherSoilWidget from '../components/WeatherSoilWidget';
import AIExplanationLog from '../components/AIExplanationLog';
import VoiceButton from '../components/VoiceButton';

export default function AgriMainDashboard({ lang = 'te', isOnline, userSession, dateRange }) {
  const userName = userSession?.name || 'Ramesh Kumar';
  const firstName = userName.split(' ')[0];

  const [rainfallTrend] = useState([
    { day: 'Jun 10', actual: 42, forecast: 45, threshold: 40 },
    { day: 'Jun 15', actual: 38, forecast: 40, threshold: 40 },
    { day: 'Jun 20', actual: 31, forecast: 35, threshold: 40 },
    { day: 'Jun 25', actual: 28, forecast: 30, threshold: 40 },
    { day: 'Jun 30', actual: 28, forecast: 28, threshold: 40 }
  ]);

  const [cropDistribution] = useState([
    { name: 'Paddy', value: 52, color: '#22c55e' },
    { name: 'Cotton', value: 26, color: '#38bdf8' },
    { name: 'Groundnut', value: 15, color: '#f59e0b' },
    { name: 'Chilli', value: 7, color: '#a855f7' }
  ]);

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
      
      {/* Welcome Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-emerald-900/60 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2 drop-shadow">
            Welcome back, {firstName} 🌾
          </h2>
          <p className="text-xs text-emerald-300/80 font-medium mt-0.5">
            Here's what's happening on your farm & parametric coverage today.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-[#102419] text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-mono flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Analysis Window: <strong className="text-white">{dateRange?.label || 'Jun 01 – Sep 30, 2026'}</strong>
          </span>
          <span className="bg-[#102419] text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 3/3 Weather Oracles Active
          </span>
        </div>
      </div>

      {/* Top 4 KPI Stat Cards matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Fields */}
        <div className="bg-[#102419]/90 border border-emerald-500/30 p-5 rounded-3xl text-white shadow-2xl backdrop-blur-xl space-y-2 card-hover-effect">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-300 font-semibold uppercase tracking-wider">Total Fields</span>
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">24</div>
          <div className="text-[11px] text-gray-400 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">14 Active</span> • <span>10 Inactive</span>
          </div>
        </div>

        {/* Card 2: Total Coverage Area */}
        <div className="bg-[#102419]/90 border border-emerald-500/30 p-5 rounded-3xl text-white shadow-2xl backdrop-blur-xl space-y-2 card-hover-effect">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-300 font-semibold uppercase tracking-wider">Total Coverage Area</span>
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">125.6 <span className="text-sm font-normal text-sky-300">ha</span></div>
          <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> ₹20,000 Paddy Shield Covered
          </div>
        </div>

        {/* Card 3: Crops Growing */}
        <div className="bg-[#102419]/90 border border-emerald-500/30 p-5 rounded-3xl text-white shadow-2xl backdrop-blur-xl space-y-2 card-hover-effect">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-300 font-semibold uppercase tracking-wider">Crops Growing</span>
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">4</div>
          <div className="text-[11px] text-gray-400 truncate">
            Paddy, Cotton, Groundnut, Maize
          </div>
        </div>

        {/* Card 4: AI Health Score */}
        <div className="bg-[#102419]/90 border border-emerald-500/30 p-5 rounded-3xl text-white shadow-2xl backdrop-blur-xl space-y-2 card-hover-effect border-emerald-400/40">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-300 font-semibold uppercase tracking-wider">AI Trust & Health Score</span>
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-300 tracking-tight">96<span className="text-sm font-normal text-gray-400">/100</span></div>
          <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> High Consensus Confidence
          </div>
        </div>

      </div>

      {/* Middle Grid: Field Health Overview + Satellite Locus Map + Weather & Soil */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Field Health Overview Donut Card */}
        <div className="bg-[#102419]/90 border border-emerald-500/30 rounded-3xl p-5 text-white shadow-2xl backdrop-blur-xl space-y-4 card-hover-effect flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Field Health Overview
            </h4>
            <p className="text-[11px] text-emerald-400/80 mt-0.5">AI-powered vegetation & soil analysis</p>
          </div>

          <div className="flex items-center justify-center my-2 relative">
            <div className="w-36 h-36 rounded-full border-8 border-emerald-500/30 border-t-emerald-400 border-r-green-400 flex flex-col items-center justify-center shadow-inner animate-pulseGlow">
              <span className="text-3xl font-black text-white">86</span>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Good</span>
            </div>
          </div>

          <div className="space-y-2 text-xs border-t border-emerald-900/60 pt-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-gray-300"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Excellent</span>
              <strong className="text-white font-mono">36%</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-gray-300"><span className="w-2 h-2 rounded-full bg-green-400" /> Good</span>
              <strong className="text-white font-mono">41%</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-gray-300"><span className="w-2 h-2 rounded-full bg-amber-400" /> Average</span>
              <strong className="text-white font-mono">15%</strong>
            </div>
          </div>
        </div>

        {/* Satellite Field Locus Map */}
        <SatelliteLocusWidget />

        {/* Weather & Soil Summary Widget */}
        <WeatherSoilWidget />

      </div>

      {/* Bottom Row: Soil Moisture & Rainfall Trend + Crop Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Soil Moisture & Parametric Rainfall Trend Chart */}
        <div className="lg:col-span-2 bg-[#102419]/90 border border-emerald-500/30 rounded-3xl p-6 text-white shadow-2xl backdrop-blur-xl space-y-4 card-hover-effect">
          <div className="flex justify-between items-center border-b border-emerald-900/60 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white">Soil Moisture & Parametric Rainfall Trend</h3>
              <p className="text-[11px] text-emerald-400/80">Observed rainfall (mm) vs 40 mm policy trigger threshold</p>
            </div>
            <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-mono">
              Threshold Line: 40 mm
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rainfallTrend}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0a1b12', borderColor: '#22c55e', color: '#fff' }} />
                <Area type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Distribution Donut Chart */}
        <div className="bg-[#102419]/90 border border-emerald-500/30 rounded-3xl p-6 text-white shadow-2xl backdrop-blur-xl space-y-4 card-hover-effect flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white">Crop Distribution</h3>
            <p className="text-[11px] text-emerald-400/80">By Area (125.6 ha total)</p>
          </div>

          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cropDistribution} innerRadius={50} outerRadius={70} dataKey="value">
                  {cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0a1b12', borderColor: '#22c55e', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-900/60 font-mono">
            {cropDistribution.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <strong className="text-white">{item.value}%</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Voice Assistant & AI Explanation Log Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#102419]/90 border border-emerald-500/30 p-6 rounded-3xl text-white shadow-2xl backdrop-blur-xl text-center space-y-4 card-hover-effect">
          <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">🔊 Voice Assistant</h4>
          <VoiceButton lang={lang} farmerData={{ crop: 'Paddy', coverage: 20000, premium: 499 }} />
        </div>

        <div className="lg:col-span-2">
          <AIExplanationLog lang={lang} />
        </div>
      </div>

    </div>
  );
}
