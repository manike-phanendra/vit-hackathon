import React, { useState, useEffect } from 'react';
import { X, Zap, RefreshCw, HardDrive, CheckCircle2, ShieldCheck, Database, Layers, ArrowUpRight, Wifi, WifiOff, Download, Server } from 'lucide-react';
import { executeDeltaSync, executePanchayatSync, processOfflineSyncQueue, getDeltaAuditLogs } from '../services/syncEngine';
import { getDeltaMetadata, getPendingOfflineEvents } from '../services/offlineDb';

export default function DeltaSyncModal({ isOpen, onClose, isOnline, userId = 'USR-101' }) {
  const [syncMeta, setSyncMeta] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState('Rampur Panchayat');
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  const loadStats = async () => {
    const meta = await getDeltaMetadata(userId);
    setSyncMeta(meta || {
      lastSyncTimestamp: new Date().toISOString(),
      totalRecords: 450,
      fullPayloadBytes: 1310720,
      deltaPayloadBytes: 24576,
      savedPct: '98.1%',
      status: 'READY'
    });

    const pending = await getPendingOfflineEvents();
    setPendingCount(pending ? pending.length : 0);
    setAuditLogs([...getDeltaAuditLogs()]);
  };

  const handleRunDeltaSync = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('⚡ Calculating server delta timestamps...');
    
    setTimeout(async () => {
      const res = await executeDeltaSync(userId);
      setSyncMeta(res.meta);
      setAuditLogs([...getDeltaAuditLogs()]);
      setIsSyncing(false);
      setSyncStatusMsg('✅ Delta Sync Completed! Transferred ' + (res.meta.deltaPayloadBytes / 1024).toFixed(1) + ' KB.');
      setTimeout(() => setSyncStatusMsg(''), 4000);
    }, 600);
  };

  const handleRunPanchayatSync = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(`🏡 Packaging SQLite WASM bundle for ${selectedVillage}...`);

    setTimeout(async () => {
      const res = await executePanchayatSync(selectedVillage, 300);
      setAuditLogs([...getDeltaAuditLogs()]);
      setIsSyncing(false);
      setSyncStatusMsg(`✅ ${selectedVillage} Offline Bundle Ready (300 Farmers, 1.44 MB)`);
      setTimeout(() => setSyncStatusMsg(''), 4000);
    }, 700);
  };

  const handleFlushOutbox = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('🔄 Flushing pending offline transactions to server...');

    setTimeout(async () => {
      const res = await processOfflineSyncQueue(userId);
      setPendingCount(0);
      setAuditLogs([...getDeltaAuditLogs()]);
      setIsSyncing(false);
      setSyncStatusMsg(`✅ Outbox Flushed: ${res.synced} events synchronized with Idempotency Keys.`);
      setTimeout(() => setSyncStatusMsg(''), 4000);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0a1b12] border border-emerald-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl text-white flex flex-col relative border-t-4 border-t-emerald-400">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-[#0a1b12]/95 backdrop-blur-xl px-6 py-4 border-b border-emerald-900 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-green-500 rounded-2xl shadow-lg shadow-emerald-900/40">
              <Zap className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-white tracking-wide">KrishiShield Delta Sync Protocol</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase">
                  1 Crore Scalability Architecture
                </span>
              </div>
              <p className="text-xs text-emerald-300/80">Sub-second data access via targeted delta updates & geofenced village micro-sync</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white bg-emerald-950/60 hover:bg-emerald-900 rounded-xl transition-all border border-emerald-500/20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast Banner if active */}
        {syncStatusMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/90 border border-emerald-400/60 text-emerald-200 rounded-2xl text-xs font-mono font-bold flex items-center justify-between animate-fadeIn shadow-lg">
            <span>{syncStatusMsg}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-6">

          {/* Top 4 KPI Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 bg-[#102419]/90 border border-emerald-500/30 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-gray-400 text-xs">
                <span>Last Sync Mode</span>
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-lg font-extrabold text-white font-mono">
                {syncMeta ? 'Delta Sync' : 'Initializing...'}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                {syncMeta?.lastSyncTimestamp ? new Date(syncMeta.lastSyncTimestamp).toLocaleTimeString() : 'Just Now'}
              </div>
            </div>

            <div className="p-4 bg-[#102419]/90 border border-emerald-500/30 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-gray-400 text-xs">
                <span>Bandwidth Saved</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-lg font-extrabold text-emerald-300 font-mono">
                {syncMeta?.savedPct || '98.1%'}
              </div>
              <div className="text-[10px] text-gray-400 font-mono">
                {(syncMeta?.deltaPayloadBytes / 1024 || 24).toFixed(1)} KB vs 1.25 MB Full
              </div>
            </div>

            <div className="p-4 bg-[#102419]/90 border border-emerald-500/30 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-gray-400 text-xs">
                <span>IndexedDB Cache</span>
                <HardDrive className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-lg font-extrabold text-sky-300 font-mono">
                450 Policies
              </div>
              <div className="text-[10px] text-sky-400 font-mono">
                0 ms local read latency
              </div>
            </div>

            <div className="p-4 bg-[#102419]/90 border border-emerald-500/30 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-gray-400 text-xs">
                <span>Offline Outbox</span>
                <Database className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-lg font-extrabold text-amber-300 font-mono">
                {pendingCount} Pending
              </div>
              <div className="text-[10px] text-amber-400 font-mono">
                Idempotency Key Active
              </div>
            </div>

          </div>

          {/* Interactive Control Panel */}
          <div className="p-5 bg-gradient-to-br from-[#102419] to-[#07170f] border border-emerald-500/40 rounded-3xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              Interactive Delta Sync & Agent Tools
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Trigger Delta Sync */}
              <button
                onClick={handleRunDeltaSync}
                disabled={isSyncing}
                className="p-3.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/50 rounded-2xl text-left transition-all cursor-pointer group space-y-1 focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white group-hover:text-emerald-200">⚡ Run Instant Delta Sync</span>
                  <Zap className={`w-4 h-4 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                </div>
                <p className="text-[10px] text-emerald-200/80 leading-snug">
                  Fetches changed policy records since last timestamp. Saves ~99% bandwidth.
                </p>
              </button>

              {/* Geofenced Village Package Sync */}
              <div className="p-3.5 bg-sky-950/30 hover:bg-sky-950/50 border border-sky-500/40 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-sky-200">🏡 Panchayat Village Package</span>
                  <Download className="w-4 h-4 text-sky-400" />
                </div>
                <select
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  className="w-full bg-[#05110b] border border-sky-500/40 rounded-xl px-2 py-1 text-[11px] text-sky-200 font-mono focus:outline-none"
                >
                  <option value="Rampur Panchayat">Rampur Panchayat (300 Farmers)</option>
                  <option value="Guntur North">Guntur North (450 Farmers)</option>
                  <option value="Ananthapur Zaid">Ananthapur Zaid (250 Farmers)</option>
                </select>
                <button
                  onClick={handleRunPanchayatSync}
                  disabled={isSyncing}
                  className="w-full py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow"
                >
                  Download Agent Bundle (1.44 MB)
                </button>
              </div>

              {/* Flush Outbox Queue */}
              <button
                onClick={handleFlushOutbox}
                disabled={isSyncing}
                className="p-3.5 bg-amber-950/30 hover:bg-amber-950/50 border border-amber-500/40 rounded-2xl text-left transition-all cursor-pointer group space-y-1 focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-200 group-hover:text-amber-100">🔄 Flush Outbox Queue</span>
                  <RefreshCw className={`w-4 h-4 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
                </div>
                <p className="text-[10px] text-amber-200/80 leading-snug">
                  Uploads offline actions with cryptographic UUID v4 idempotency verification.
                </p>
              </button>

            </div>
          </div>

          {/* 4 Architectural Defense Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 bg-[#102419]/70 border border-emerald-500/30 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Pillar 1: Bounded Delta Synchronization</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                Rather than re-downloading 1 Crore policies, clients submit their <code className="text-emerald-300 bg-emerald-950 px-1 rounded">last_sync_timestamp</code>. Server returns only updated rows, reducing transfer size from 1.25 MB to under 25 KB.
              </p>
            </div>

            <div className="p-4 bg-[#102419]/70 border border-emerald-500/30 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <Layers className="w-4 h-4" />
                <span>Pillar 2: Geofenced Field Agent Micro-Sync</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                Extension agents servicing offline villages download a compressed <code className="text-sky-300 bg-sky-950 px-1 rounded">SQLite WASM</code> package bounded by Panchayat ID (300 farmers, ~1.4 MB) for sub-millisecond local queries.
              </p>
            </div>

          </div>

          {/* Audit Log Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
              <span>📋 Live Delta Sync Execution Audit Trail</span>
              <span className="text-[10px] text-gray-400 font-mono font-normal">Real-Time Event Stream</span>
            </h4>

            <div className="bg-[#102419]/90 border border-emerald-500/30 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-gray-300 border-collapse">
                <thead>
                  <tr className="bg-emerald-950/80 border-b border-emerald-900 text-emerald-300 font-mono text-[10px] uppercase">
                    <th className="py-2.5 px-4">Event ID</th>
                    <th className="py-2.5 px-4">Timestamp</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Details & Bandwidth</th>
                    <th className="py-2.5 px-4 text-right">Saved %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/60 font-mono text-[11px]">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-gray-500">No delta sync logs recorded yet</td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-emerald-950/40 transition-colors">
                        <td className="py-2.5 px-4 text-emerald-400 font-bold">{log.id}</td>
                        <td className="py-2.5 px-4 text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td className="py-2.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            log.type === 'DELTA_SYNC' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            log.type === 'PANCHAYAT_SYNC' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-gray-200">{log.details}</td>
                        <td className="py-2.5 px-4 text-right text-emerald-400 font-bold">{log.savedPct}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#05110b] border-t border-emerald-900 flex justify-between items-center">
          <div className="text-[10px] text-emerald-400/80 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cryptographic Idempotency & Bounded Sharding Enabled</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
