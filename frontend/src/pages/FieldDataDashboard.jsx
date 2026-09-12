import React, { useState, useEffect } from 'react';
import { Database, Activity, CheckCircle2, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';
import { fetchApi } from '../services/api';

export default function FieldDataDashboard() {
  const [oracleHealth, setOracleHealth] = useState({
    station_id: "ST-001",
    oracles: [
      { name: "Oracle A", rainfall: 28.0, status: "Healthy", latency: "120ms" },
      { name: "Oracle B", rainfall: 27.0, status: "Healthy", latency: "180ms" },
      { name: "Oracle C", rainfall: 28.0, status: "Delayed", latency: "4200ms" }
    ],
    consensus_mm: 28.0,
    confidence: "HIGH",
    agreement_status: "CONVERGED"
  });

  const [stations, setStations] = useState([
    { station_id: "ST-001", location: "Warangal Central", rainfall_mm: 28.0, status: "Healthy", last_update: "2 min ago" },
    { station_id: "ST-002", location: "Karimnagar North", rainfall_mm: 27.0, status: "Healthy", last_update: "3 min ago" },
    { station_id: "ST-003", location: "Nalgonda East", rainfall_mm: 28.0, status: "Delayed", last_update: "8 min ago" }
  ]);

  useEffect(() => {
    async function loadOracleData() {
      try {
        const health = await fetchApi('/oracles/health');
        if (health) setOracleHealth(health);
        const stList = await fetchApi('/oracles/stations');
        if (stList) setStations(stList);
      } catch (err) {
        console.warn("Using default oracle health state.");
      }
    }
    loadOracleData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-agri-800 pb-4">
        <div>
          <span className="text-xs text-agri-500 font-bold uppercase tracking-wider block">📡 FIELD & ORACLE TELEMETRY</span>
          <h2 className="text-2xl font-extrabold text-white">Rainfall Feed Trust & Oracle Health</h2>
        </div>
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/40 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> 3 Independent Sources
        </span>
      </div>

      {/* Main Consensus Card */}
      <div className="bg-agri-dark p-6 rounded-3xl border border-agri-800 shadow-xl space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-3 border-b border-agri-800 pb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">RAINFALL ORACLE CONSENSUS & HEALTH</h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Station:</span>
            <strong className="font-mono text-emerald-300 bg-agri-900 px-2.5 py-1 rounded border border-agri-700">ST-001 (Warangal)</strong>
          </div>
        </div>

        {/* 3 Oracles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {oracleHealth.oracles.map((orc, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${
                orc.status === 'Healthy'
                  ? 'bg-agri-900/80 border-agri-700 text-white'
                  : 'bg-amber-950/60 border-amber-700/60 text-amber-100'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm flex items-center gap-1.5">
                  {orc.status === 'Healthy' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                  🟢 {orc.name}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  orc.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {orc.status}
                </span>
              </div>
              <div className="text-center py-2">
                <span className="text-3xl font-extrabold text-white">{orc.rainfall}</span>
                <span className="text-sm font-normal text-sky-300 ml-1">mm</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-gray-400 border-t border-agri-800 pt-2">
                <span>Latency</span>
                <span className="font-mono text-gray-300">{orc.latency}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Consensus Result Footer */}
        <div className="bg-emerald-950/70 border border-emerald-700 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4 text-white">
          <div>
            <span className="text-xs text-emerald-300 font-semibold block uppercase">Median Consensus Calculation</span>
            <strong className="text-2xl font-extrabold text-white">28.0 mm</strong>
          </div>
          <div>
            <span className="text-xs text-emerald-300 font-semibold block uppercase">Quorum Confidence</span>
            <strong className="text-lg font-bold text-emerald-400 bg-emerald-900/80 px-3 py-0.5 rounded-full border border-emerald-500/40">
              {oracleHealth.confidence} CONFIDENCE
            </strong>
          </div>
          <div>
            <span className="text-xs text-emerald-300 font-semibold block uppercase">Agreement Status</span>
            <span className="text-sm font-bold text-sky-300">{oracleHealth.agreement_status}</span>
          </div>
        </div>

      </div>

      {/* Station Table */}
      <div className="bg-agri-dark p-6 rounded-3xl border border-agri-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" /> Weather Telemetry Stations
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-gray-300">
            <thead className="bg-agri-900 text-gray-400 uppercase font-semibold border-b border-agri-800">
              <tr>
                <th className="px-4 py-3">Station ID</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Rainfall</th>
                <th className="px-4 py-3">Oracle Status</th>
                <th className="px-4 py-3">Last Telemetry Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-agri-800 font-mono">
              {stations.map((st) => (
                <tr key={st.station_id} className="hover:bg-agri-900/50">
                  <td className="px-4 py-3 font-bold text-white">{st.station_id}</td>
                  <td className="px-4 py-3 text-gray-300 font-sans">{st.location}</td>
                  <td className="px-4 py-3 text-sky-300 font-bold">{st.rainfall_mm} mm</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      st.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      🟢 {st.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{st.last_update}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
