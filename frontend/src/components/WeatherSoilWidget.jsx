import React, { useState, useEffect } from 'react';
import { CloudSun, Droplets, Wind, CloudRain, Sparkles, RefreshCw, Globe, Gauge, MapPin, Navigation, Search, AlertCircle } from 'lucide-react';
import { fetchOnlineWeatherTelemetry, fetchWeatherByCoordinates, getUserGPSLocation, searchCityWeather } from '../services/onlineWeatherService';

export default function WeatherSoilWidget({ locationName = "Warangal" }) {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gpsActive, setGpsActive] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadLiveData = async (loc = locationName) => {
    setLoading(true);
    setErrorMsg("");
    const data = await fetchOnlineWeatherTelemetry(loc);
    setTelemetry(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLiveData(locationName);
  }, [locationName]);

  const handleDetectGPS = async () => {
    setGpsLoading(true);
    setErrorMsg("");
    try {
      const coords = await getUserGPSLocation();
      const data = await fetchWeatherByCoordinates(coords.lat, coords.lon, `GPS: ${coords.lat.toFixed(2)}°, ${coords.lon.toFixed(2)}°`);
      setTelemetry(data);
      setGpsActive(true);
    } catch (err) {
      console.warn("GPS detection failed:", err.message);
      setErrorMsg("GPS permission denied or unavailable. Using station telemetry.");
      setTimeout(() => setErrorMsg(""), 4000);
    } finally {
      setGpsLoading(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await searchCityWeather(searchQuery.trim());
      setTelemetry(data);
      setGpsActive(false);
      setSearchQuery("");
    } catch (err) {
      setErrorMsg(`Could not find weather for "${searchQuery}".`);
      setTimeout(() => setErrorMsg(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#102419]/90 border border-emerald-500/30 rounded-3xl p-5 text-white shadow-2xl backdrop-blur-xl space-y-4 card-3d-effect perspective-1000">
      
      {/* Weather Header with GPS & Search Actions */}
      <div className="flex justify-between items-center border-b border-emerald-900/60 pb-3 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-xs text-gray-300 uppercase tracking-wider">Live Weather Telemetry</h4>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1 border ${
              gpsActive 
                ? 'bg-amber-950 text-amber-300 border-amber-500/50 animate-pulse' 
                : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
            }`}>
              <Globe className="w-3 h-3 text-emerald-400" /> 
              {gpsActive ? 'LIVE GPS ACTIVE' : 'OPEN-METEO ONLINE'}
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono block mt-0.5">
            {telemetry ? telemetry.station : "Loading online station..."}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* GPS Detect Button */}
          <button
            onClick={handleDetectGPS}
            disabled={gpsLoading}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 shadow ${
              gpsActive 
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50' 
                : 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border-emerald-500/40'
            }`}
            title="Detect My Location using GPS"
          >
            <Navigation className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : 'animate-bounce'}`} />
            {gpsLoading ? 'Detecting GPS...' : '📍 My Location'}
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => loadLiveData(locationName)}
            title="Refresh Live Telemetry"
            className="p-2 bg-emerald-900/50 hover:bg-emerald-800/80 text-emerald-300 rounded-xl border border-emerald-500/30 transition-all transform hover:scale-110"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* City Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search any city or location (e.g. Hyderabad, Warangal, Mumbai)..."
          className="w-full bg-[#0a1b12] border border-emerald-500/30 rounded-xl pl-9 pr-20 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 shadow-inner"
        />
        <button
          type="submit"
          className="absolute right-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold shadow"
        >
          Search
        </button>
      </form>

      {errorMsg && (
        <div className="bg-amber-950/80 border border-amber-600/60 p-2.5 rounded-xl text-[11px] text-amber-200 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" /> {errorMsg}
        </div>
      )}

      {/* Temperature & Live Metrics */}
      <div className="flex justify-between items-center py-1">
        <div>
          <span className="text-4xl font-black text-white tracking-tight">
            {telemetry ? `${telemetry.temperature_c}°C` : "29.4°C"}
          </span>
          <span className="text-xs text-emerald-300 block font-medium mt-0.5">
            {telemetry ? `${telemetry.source} • ${telemetry.fetched_at}` : "Live Online Data"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="bg-[#0a1b12] p-2 rounded-xl border border-emerald-500/30 shadow-inner">
            <Droplets className="w-3.5 h-3.5 text-sky-400 mx-auto mb-0.5" />
            <span className="text-gray-400 block font-medium">Humidity</span>
            <strong className="text-white font-mono">{telemetry ? `${telemetry.humidity_percent}%` : "76%"}</strong>
          </div>
          <div className="bg-[#0a1b12] p-2 rounded-xl border border-emerald-500/30 shadow-inner">
            <Wind className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-0.5" />
            <span className="text-gray-400 block font-medium">Wind</span>
            <strong className="text-white font-mono">{telemetry ? `${telemetry.wind_kmh} km/h` : "14.2 km/h"}</strong>
          </div>
          <div className="bg-[#0a1b12] p-2 rounded-xl border border-emerald-500/30 shadow-inner">
            <CloudRain className="w-3.5 h-3.5 text-blue-400 mx-auto mb-0.5" />
            <span className="text-gray-400 block font-medium">Rainfall</span>
            <strong className="text-amber-400 font-mono">{telemetry ? `${telemetry.rainfall_mm} mm` : "28.0 mm"}</strong>
          </div>
        </div>
      </div>

      {/* Atmospheric & Soil Moisture Live Sensors */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="bg-[#0a1b12]/90 p-2.5 rounded-xl border border-emerald-500/20 flex items-center justify-between">
          <span className="text-gray-400 flex items-center gap-1 text-[10px]">
            <Gauge className="w-3.5 h-3.5 text-amber-400" /> Pressure
          </span>
          <strong className="text-emerald-300 text-[11px]">{telemetry ? `${telemetry.pressure_hpa} hPa` : "1008 hPa"}</strong>
        </div>
        <div className="bg-[#0a1b12]/90 p-2.5 rounded-xl border border-emerald-500/20 flex items-center justify-between">
          <span className="text-gray-400 flex items-center gap-1 text-[10px]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Soil Moisture
          </span>
          <strong className="text-emerald-300 text-[11px]">{telemetry ? `${telemetry.soil_moisture_percent}%` : "38%"}</strong>
        </div>
      </div>

      {/* Soil Organic Progress Bar */}
      <div className="bg-[#0a1b12] p-3 rounded-2xl border border-emerald-500/30 space-y-1.5 text-xs">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-gray-300 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Vegetation Index (NDVI):
          </span>
          <strong className="text-emerald-400 font-mono">0.78 (Healthy Crop)</strong>
        </div>
        <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-emerald-500/30">
          <div className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-green-300 rounded-full animate-pulseGlow" style={{ width: '78%' }} />
        </div>
      </div>

    </div>
  );
}
