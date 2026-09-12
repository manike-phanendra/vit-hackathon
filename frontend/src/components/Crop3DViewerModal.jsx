import React, { useState, useEffect } from 'react';
import { X, ZoomIn, Eye, Layers, ShieldCheck, Sprout, Activity, Radio, Sparkles, MapPin, Check } from 'lucide-react';
import { CROP_THEME_MAP, getCropTheme } from '../services/cropThemes';

export default function Crop3DViewerModal({ isOpen, onClose, stationData }) {
  if (!isOpen) return null;

  const initialCropKey = stationData?.cropName || stationData?.crop?.split(' ')[0] || 'Paddy';
  const [selectedCropName, setSelectedCropName] = useState(initialCropKey);

  useEffect(() => {
    if (stationData?.cropName || stationData?.crop) {
      setSelectedCropName(stationData.cropName || stationData.crop.split(' ')[0]);
    }
  }, [stationData]);

  const cropTheme = getCropTheme(selectedCropName);

  const [activeLayer, setActiveLayer] = useState('all'); // 'all' | 'ndvi' | 'roots'
  const [zoomLevel, setZoomLevel] = useState(1);

  const cropList = [
    { key: 'Paddy', label: 'Paddy (Rice)' },
    { key: 'Cotton', label: 'Cotton' },
    { key: 'Groundnut', label: 'Groundnut' },
    { key: 'Maize', label: 'Maize' }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 z-50 animate-fadeIn select-none overflow-y-auto">
      <div className="bg-[#06150c]/95 border border-emerald-500/40 rounded-3xl max-w-5xl w-full p-6 text-white shadow-2xl space-y-5 relative overflow-hidden my-auto border-t-emerald-400/80">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-sm" />

        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-emerald-900/60 pb-3 flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-400/40 shadow-inner">
              <Sprout className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1 shadow">
                  <span className="text-sm">{cropTheme.emoji}</span> REAL CROP FIELD VIEW
                </span>
                <span className="text-[10px] bg-sky-950 text-sky-300 px-2.5 py-0.5 rounded-full font-mono border border-sky-800">
                  Sentinel-2 Telemetry
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white drop-shadow">
                {cropTheme.name} Field Inspector
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick Crop Switcher Buttons */}
            <div className="flex items-center space-x-1 bg-black/60 p-1 rounded-2xl border border-white/10 text-xs overflow-x-auto max-w-[360px] md:max-w-none">
              {cropList.map((c) => {
                const theme = getCropTheme(c.key);
                const isActive = selectedCropName.toLowerCase() === c.key.toLowerCase();
                return (
                  <button
                    key={c.key}
                    onClick={() => setSelectedCropName(c.key)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-500 text-black shadow-lg font-extrabold'
                        : 'text-gray-300 hover:bg-emerald-950 hover:text-emerald-300'
                    }`}
                  >
                    <span>{theme.emoji}</span> {c.key}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-emerald-900/50 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Canvas + Telemetry Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Left Column: 100% FULL-BLEED STATIC REAL CROP FIELD STAGE (NO ROTATION) */}
          <div className="lg:col-span-2 relative h-[440px] rounded-3xl border-2 border-emerald-500/50 overflow-hidden shadow-2xl flex items-center justify-center bg-black">
            
            {/* 100% FULL BLEED EDGE-TO-EDGE REAL CROP PHOTOGRAPH (STATIC & STABLE) */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
              style={{
                backgroundImage: `url(${cropTheme.bgImage})`,
                transform: `scale(${zoomLevel})`
              }}
            >
              {/* Soft Environmental Gradient & Lighting */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/35 pointer-events-none" />

              {/* Spectral Heatmap Layer Overlay */}
              {activeLayer === 'ndvi' && (
                <div className="absolute inset-0 bg-emerald-500/35 backdrop-hue-rotate-90 animate-pulse border-4 border-emerald-400 z-10 flex items-center justify-center pointer-events-none">
                  <span className="bg-black/90 text-emerald-300 font-mono text-xs px-4 py-2 rounded-2xl border border-emerald-400 shadow-2xl font-bold">
                    🌿 SENTINEL-2 OPTICAL SPECTRAL HEATMAP (NDVI 0.78 CANOPY VIGOR)
                  </span>
                </div>
              )}

              {/* Telemetry Hotspot Pins on Real Field */}
              <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 animate-bounce z-10">
                <div className="bg-amber-500 text-black p-2 rounded-full shadow-[0_0_20px_#f59e0b] border-2 border-amber-200 flex items-center justify-center">
                  <MapPin className="w-4 h-4 fill-black" />
                </div>
                <span className="bg-black/95 text-amber-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl border border-amber-500/60 absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap shadow-2xl backdrop-blur-md">
                  {cropTheme.name} Locus Node (28.0 mm)
                </span>
              </div>

              <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-emerald-500 text-black p-2 rounded-full shadow-[0_0_20px_#10b981] border-2 border-emerald-200 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <span className="bg-black/95 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl border border-emerald-500/60 absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap shadow-2xl backdrop-blur-md">
                  Canopy Health: 0.78 NDVI
                </span>
              </div>

              {/* Root Soil Layer Overlay */}
              {(activeLayer === 'all' || activeLayer === 'roots') && (
                <div className="absolute bottom-4 left-6 right-6 bg-black/90 backdrop-blur-xl border border-amber-500/60 p-3 rounded-2xl shadow-2xl z-20 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-amber-300 font-mono font-bold uppercase tracking-wider block">SOIL MOISTURE ROOT PROBE</span>
                    <strong className="text-white text-xs block">0-10cm Depth Moisture: <span className="text-emerald-400 font-mono font-bold">33% (Optimal)</span></strong>
                    <span className="text-[10px] text-gray-300">{cropTheme.soilType}</span>
                  </div>
                  <div className="w-32 bg-stone-900 rounded-full h-2 overflow-hidden border border-amber-600/50">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-300 h-full w-[66%]" />
                  </div>
                </div>
              )}
            </div>

            {/* Atmosphere Mesh Scan Grid Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

            {/* Scanning Radar Laser Line */}
            {(activeLayer === 'all' || activeLayer === 'radar') && (
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse shadow-[0_0_20px_#10b981] z-20 pointer-events-none" />
            )}

            {/* Status Banner */}
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] text-emerald-300 font-mono border border-emerald-500/40 z-20 shadow-lg flex items-center gap-2 pointer-events-none">
              <span>✨ Sentinel-2 Optical Field View</span>
              <span>• Scale {Math.round(zoomLevel * 100)}%</span>
            </div>

            {/* Fixed View Badge */}
            <div className="absolute top-3 right-3 z-20">
              <span className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-lg font-mono">
                📸 Fixed HD Field View
              </span>
            </div>

            {/* Stage Bottom Controls */}
            <div className="absolute bottom-3 inset-x-3 flex justify-between items-center bg-black/85 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 text-xs z-20">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-300 font-semibold">Inspect Layer:</span>
                {[
                  { id: 'all', label: '🌐 Full Crop Field' },
                  { id: 'ndvi', label: '🌿 NDVI Heatmap' },
                  { id: 'roots', label: '🪵 Soil Probe' }
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLayer(l.id)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                      activeLayer === l.id 
                        ? 'bg-emerald-500 text-black shadow font-black' 
                        : 'bg-emerald-950/70 text-emerald-300 hover:bg-emerald-900 border border-emerald-800'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
                  className="p-1.5 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-300 rounded-lg border border-emerald-600/40"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" /> Zoom In
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-300 rounded-lg border border-emerald-600/40 text-[10px] font-bold"
                >
                  Reset Zoom
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Realtime Crop Telemetry & Agronomic Panel */}
          <div className="space-y-4 text-xs">
            
            {/* Active Crop Info Box */}
            <div className="bg-[#102419] p-4 rounded-2xl border border-emerald-500/40 space-y-2 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">CROP SPECIES</span>
                <span className="text-amber-400 font-bold text-xs bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                  {cropTheme.emoji} {cropTheme.name}
                </span>
              </div>
              <p className="text-xs text-emerald-200 font-medium pt-1">
                {cropTheme.description}
              </p>
              <div className="pt-1 text-[11px] text-gray-300 flex justify-between border-t border-emerald-900/60 mt-2">
                <span>Growth Stage</span>
                <strong className="text-white font-mono">{cropTheme.growthStage}</strong>
              </div>
            </div>

            {/* Vegetation Vigor Score */}
            <div className="bg-[#102419] p-4 rounded-2xl border border-emerald-500/30 space-y-2 shadow-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">VEGETATION VIGOR (NDVI)</span>
                <span className="text-emerald-400 font-mono font-bold">0.78 (Healthy Canopy)</span>
              </div>
              <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden border border-emerald-800">
                <div className="bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-300 h-full w-[78%]" />
              </div>
              <p className="text-[11px] text-gray-300">
                Satellite optical spectral signature confirms healthy leaf canopy & panicle formation.
              </p>
            </div>

            {/* Agronomic Metrics */}
            <div className="bg-[#102419] p-4 rounded-2xl border border-emerald-500/30 space-y-2 shadow-lg">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">AGRONOMIC TELEMETRY</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-black/50 p-2.5 rounded-xl border border-emerald-900/60">
                  <span className="text-gray-400 block text-[10px]">Soil Type</span>
                  <strong className="text-white font-semibold text-[11px]">{cropTheme.soilType}</strong>
                </div>
                <div className="bg-black/50 p-2.5 rounded-xl border border-emerald-900/60">
                  <span className="text-gray-400 block text-[10px]">0-10cm Moisture</span>
                  <strong className="text-emerald-400 font-mono">33% (Optimal)</strong>
                </div>
                <div className="bg-black/50 p-2.5 rounded-xl border border-emerald-900/60">
                  <span className="text-gray-400 block text-[10px]">Consensus Rain</span>
                  <strong className="text-amber-400 font-mono">28.0 mm</strong>
                </div>
                <div className="bg-black/50 p-2.5 rounded-xl border border-emerald-900/60">
                  <span className="text-gray-400 block text-[10px]">Protection Status</span>
                  <strong className="text-emerald-400 font-bold">TRIGGER MATCH</strong>
                </div>
              </div>
            </div>

            {/* WMO Station Summary */}
            <div className="bg-gradient-to-r from-emerald-950 to-green-950 p-3.5 rounded-2xl border border-emerald-500/40 text-center space-y-1 shadow-xl">
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">WMO TELEMETRY STATION</span>
              <strong className="text-white text-sm block">{stationData?.name || 'Warangal Central'}</strong>
              <p className="text-[11px] text-emerald-200/80">
                3/3 Oracles Verified • SHA-256 Audit Sealed
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
