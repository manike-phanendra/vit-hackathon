import React, { useState } from 'react';
import { MapPin, Compass, Radio, Sprout, Sparkles, Eye } from 'lucide-react';
import Crop3DViewerModal from './Crop3DViewerModal';

export default function SatelliteLocusWidget() {
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState({
    id: 'ST-001',
    name: 'Warangal Central',
    rainfall: '28.0 mm',
    status: 'TRIGGERED',
    oracles: '3/3 Valid',
    crop: 'Paddy Field #04',
    cropName: 'Paddy'
  });

  const stations = [
    { id: 'ST-001', name: 'Warangal Central', lat: '42%', lng: '32%', rainfall: '28.0 mm', status: 'TRIGGERED', crop: 'Paddy Field #04', cropName: 'Paddy' },
    { id: 'ST-002', name: 'Karimnagar North', lat: '22%', lng: '62%', rainfall: '45.5 mm', status: 'HEALTHY', crop: 'Paddy Field #12', cropName: 'Paddy' },
    { id: 'ST-003', name: 'Nalgonda East', lat: '68%', lng: '76%', rainfall: '22.0 mm', status: 'TRIGGERED', crop: 'Cotton Field #02', cropName: 'Cotton' }
  ];

  return (
    <>
      <div className="bg-[#102419]/90 border border-emerald-500/30 rounded-3xl p-5 text-white shadow-2xl backdrop-blur-xl space-y-4 card-3d-effect perspective-1000">
        
        {/* Widget Header */}
        <div className="flex justify-between items-center border-b border-emerald-900/60 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-emerald-500/20 rounded-xl border border-emerald-400/40">
              <Compass className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">3D Satellite Locus & Orbit Radar</h3>
              <p className="text-[11px] text-emerald-400/80">Realtime WMO & Sentinel-2 spatial telemetry</p>
            </div>
          </div>
          
          <button
            onClick={() => setIs3DModalOpen(true)}
            className="text-[11px] bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold border border-emerald-300/40 px-3 py-1.5 rounded-xl font-mono flex items-center gap-1.5 shadow-lg transform hover:scale-105 transition-all cursor-pointer animate-pulse"
          >
            <Sprout className="w-3.5 h-3.5" /> 🌱 3D Crop View
          </button>
        </div>

        {/* 3D Satellite Field Canvas Simulation with Interactive Radar Rings */}
        <div 
          onClick={() => setIs3DModalOpen(true)}
          className="relative h-56 rounded-2xl overflow-hidden border border-emerald-500/40 bg-cover bg-center shadow-inner perspective-1000 cursor-pointer group" 
          style={{ backgroundImage: "url('/bg-farm.png')" }}
          title="Click to view 3D Crop Model"
        >
          
          {/* Dark Map Overlay with 3D Grid */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/70 pointer-events-none" />

          {/* Hover Backdrop Glow overlay */}
          <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
            <span className="bg-black/90 border border-emerald-400 text-emerald-300 font-extrabold text-xs px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 transform group-hover:scale-110 transition-transform">
              <Eye className="w-4 h-4 text-emerald-400 animate-bounce" /> 🔍 Click to Inspect 3D Crop Model
            </span>
          </div>

          {/* 3D Rotating Radar Ring Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full border border-emerald-400/30 border-dashed animate-radarPulse3D" />
            <div className="w-32 h-32 rounded-full border border-emerald-500/40 border-dotted animate-spin3D absolute" />
          </div>

          {/* Floating 3D Station Pins */}
          {stations.map((st) => (
            <button
              key={st.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStation(st);
                setIs3DModalOpen(true);
              }}
              style={{ top: st.lat, left: st.lng }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 group/pin transition-all duration-300 ${
                selectedStation.id === st.id ? 'scale-125 z-20' : 'scale-100 opacity-90'
              }`}
            >
              <div className={`p-2 rounded-full border shadow-2xl transition-all transform group-hover/pin:scale-110 ${
                st.status === 'TRIGGERED'
                  ? 'bg-amber-500/90 border-amber-300 text-white animate-pulse'
                  : 'bg-emerald-500/90 border-emerald-300 text-white'
              }`}>
                <MapPin className="w-4 h-4" />
              </div>
              <div className="bg-black/95 text-emerald-300 text-[10px] font-mono px-2.5 py-1 rounded-xl border border-emerald-500/50 opacity-0 group-hover/pin:opacity-100 transition-opacity absolute bottom-full mb-1.5 left-1/2 transform -translate-x-1/2 whitespace-nowrap shadow-2xl backdrop-blur-md">
                {st.name} ({st.rainfall}) • Click for 3D Crop
              </div>
            </button>
          ))}

          {/* Selected Locus Overlay Banner */}
          <div className="absolute bottom-3 left-3 right-3 bg-black/90 backdrop-blur-xl p-3 rounded-xl border border-emerald-500/50 flex justify-between items-center text-xs shadow-2xl z-20">
            <div>
              <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">ACTIVE 3D LOCUS NODE</span>
              <strong className="text-white text-sm font-bold flex items-center gap-1.5">
                {selectedStation.name} <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </strong>
              <span className="text-[10px] text-emerald-400 block font-mono">{selectedStation.crop}</span>
            </div>
            <div className="text-right">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold block border ${
                selectedStation.status === 'TRIGGERED'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {selectedStation.status} ({selectedStation.rainfall})
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* 3D Crop Viewer Modal */}
      <Crop3DViewerModal
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
        stationData={selectedStation}
      />
    </>
  );
}
