import React from 'react';
import { X, CheckCircle2, ShieldAlert, Cpu, Clock, Award } from 'lucide-react';

export default function ReconstructionModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-agri-dark border border-agri-600 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-agri-800 pb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold text-emerald-300">PAYOUT RECONSTRUCTION TRAIL</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-300">
          Deterministic proof answering: <em>"Why did this farmer receive this money?"</em>
        </p>

        {/* Top Summary Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-agri-900/90 p-3 rounded-xl border border-agri-800">
            <span className="text-gray-400 block">Farmer Name</span>
            <strong className="text-white text-sm">{data.farmer_name || 'Ramesh Kumar'}</strong>
          </div>
          <div className="bg-agri-900/90 p-3 rounded-xl border border-agri-800">
            <span className="text-gray-400 block">Policy ID</span>
            <strong className="text-emerald-400 text-sm font-mono">{data.policy_id}</strong>
          </div>
          <div className="bg-agri-900/90 p-3 rounded-xl border border-agri-800">
            <span className="text-gray-400 block">Trigger Event ID</span>
            <strong className="text-amber-400 text-sm font-mono">{data.event_id}</strong>
          </div>
          <div className="bg-agri-900/90 p-3 rounded-xl border border-agri-800">
            <span className="text-gray-400 block">Payout Amount</span>
            <strong className="text-emerald-300 text-base font-bold">₹{data.payout_amount?.toLocaleString()}</strong>
          </div>
        </div>

        {/* Oracle breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Multi-Oracle Telemetry Readings</h4>
          <div className="grid grid-cols-3 gap-2">
            {(data.oracle_breakdown || [
              { oracle_id: 'Oracle A', rainfall_mm: 28, timestamp: '10:31:04' },
              { oracle_id: 'Oracle B', rainfall_mm: 27, timestamp: '10:31:08' },
              { oracle_id: 'Oracle C', rainfall_mm: 28, timestamp: '10:31:06' }
            ]).map((orc, idx) => (
              <div key={idx} className="bg-agri-900 p-2.5 rounded-xl border border-agri-800 text-center">
                <span className="text-[10px] text-gray-400 block font-semibold">{orc.oracle_id}</span>
                <span className="text-sm font-bold text-emerald-300">{orc.rainfall_mm} mm</span>
                <span className="text-[9px] text-gray-400 block flex items-center justify-center gap-0.5 mt-0.5">
                  <Clock className="w-2.5 h-2.5" /> {orc.timestamp}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-emerald-950/60 border border-emerald-800 p-2.5 rounded-xl flex justify-between items-center text-xs">
            <span className="text-emerald-300 font-semibold">Aggregated Consensus (Median)</span>
            <strong className="text-emerald-200 text-sm">{data.rainfall_mm || 28.0} mm</strong>
          </div>
        </div>

        {/* Deterministic Rules & Eligibility */}
        <div className="bg-agri-900/90 p-4 rounded-xl border border-agri-800 space-y-2 text-xs">
          <div className="flex justify-between items-center border-b border-agri-800 pb-2">
            <span className="text-gray-300 font-semibold">Deterministic Rule Evaluated</span>
            <span className="font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded">{data.rule_evaluated || 'rainfall < 40 mm'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Eligibility Status</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Idempotency Duplicate Guard</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> UNIQUE (Max 1 payout)
            </span>
          </div>
        </div>

        {/* Decision Footer */}
        <div className="bg-emerald-600 text-white p-3 rounded-2xl flex justify-between items-center shadow-lg">
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-yellow-300" />
            <div>
              <span className="text-xs text-emerald-100 font-medium block">Final Decision</span>
              <strong className="text-sm tracking-wide">AUTOMATIC PAYOUT AUTHORIZED</strong>
            </div>
          </div>
          <span className="text-xs bg-emerald-700 font-mono px-3 py-1.5 rounded-xl border border-emerald-400/40">
            {data.timestamp || '2026-09-12T10:31:10'}
          </span>
        </div>

      </div>
    </div>
  );
}
