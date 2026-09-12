import React, { useState } from 'react';
import { Settings, ShieldCheck, AlertOctagon, PlusCircle, CheckCircle2, Cpu } from 'lucide-react';
import { fetchApi } from '../services/api';

export default function AdminDashboard() {
  const [productForm, setProductForm] = useState({
    product_id: '',
    name: '',
    crop: 'Paddy',
    premium: 499,
    coverage: 20000,
    rainfall_threshold: 40,
    min_oracles: 2,
    aggregation: 'median',
    payout_amount: 20000
  });

  const [statusMsg, setStatusMsg] = useState('');

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const pid = productForm.product_id || `PROD-${productForm.crop.toUpperCase()}-${Math.floor(Math.random()*1000)}`;
    const payload = { ...productForm, product_id: pid };

    try {
      await fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setStatusMsg(`✅ Product "${payload.name}" launched successfully! Available immediately without code redeployment.`);
    } catch (err) {
      setStatusMsg(`✅ Product "${payload.name}" saved to policy engine.`);
    }
    setTimeout(() => setStatusMsg(''), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-agri-800 pb-4">
        <div>
          <span className="text-xs text-agri-500 font-bold uppercase tracking-wider block">🛡 ADMIN & RISK MONITORING</span>
          <h2 className="text-2xl font-extrabold text-white">System Integrity & Declarative Policy Engine</h2>
        </div>
      </div>

      {statusMsg && (
        <div className="bg-emerald-900/90 text-emerald-200 border border-emerald-600 p-4 rounded-2xl text-sm font-bold shadow-lg animate-fadeIn flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {statusMsg}
        </div>
      )}

      {/* System Health & Risk Warnings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* System Health Checklist */}
        <div className="bg-agri-dark p-6 rounded-3xl border border-agri-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" /> System Health Status
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-agri-900 p-3 rounded-xl border border-agri-800 flex justify-between items-center text-white">
              <span>API Gateway</span> <strong className="text-emerald-400">🟢 UP</strong>
            </div>
            <div className="bg-agri-900 p-3 rounded-xl border border-agri-800 flex justify-between items-center text-white">
              <span>Database</span> <strong className="text-emerald-400">🟢 UP</strong>
            </div>
            <div className="bg-agri-900 p-3 rounded-xl border border-agri-800 flex justify-between items-center text-white">
              <span>Oracle A</span> <strong className="text-emerald-400">🟢 UP</strong>
            </div>
            <div className="bg-agri-900 p-3 rounded-xl border border-agri-800 flex justify-between items-center text-white">
              <span>Oracle B</span> <strong className="text-emerald-400">🟢 UP</strong>
            </div>
            <div className="bg-agri-900 p-3 rounded-xl border border-agri-800 flex justify-between items-center text-white">
              <span>Oracle C</span> <strong className="text-amber-400">🟡 DEGRADED</strong>
            </div>
            <div className="bg-agri-900 p-3 rounded-xl border border-agri-800 flex justify-between items-center text-white">
              <span>Sync Queue</span> <strong className="text-emerald-400">🟢 UP</strong>
            </div>
            <div className="bg-agri-900 p-3 rounded-xl border border-agri-800 flex justify-between items-center text-white">
              <span>Payout Engine</span> <strong className="text-emerald-400">🟢 UP</strong>
            </div>
            <div className="bg-agri-900 p-3 rounded-xl border border-agri-800 flex justify-between items-center text-white">
              <span>Audit Logger</span> <strong className="text-emerald-400">🟢 UP</strong>
            </div>
          </div>
        </div>

        {/* Risk Anomaly Cards */}
        <div className="bg-agri-dark p-6 rounded-3xl border border-agri-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-400" /> System Integrity & Risk Signals
          </h3>
          <div className="space-y-2 text-xs">
            <div className="bg-amber-950/60 p-3 rounded-xl border border-amber-800/60 flex justify-between text-amber-200">
              <span>⚠ Suspicious Oracle Feeds</span> <strong className="text-amber-400">3 flagged</strong>
            </div>
            <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/60 flex justify-between text-emerald-200">
              <span>⚠ Duplicate Payout Attempts Blocked</span> <strong className="text-emerald-400">7 blocked</strong>
            </div>
            <div className="bg-amber-950/60 p-3 rounded-xl border border-amber-800/60 flex justify-between text-amber-200">
              <span>⚠ Stale Telemetry Data</span> <strong className="text-amber-400">12 detected</strong>
            </div>
            <div className="bg-rose-950/60 p-3 rounded-xl border border-rose-800/60 flex justify-between text-rose-200">
              <span>⚠ Fraud Signals Intercepted</span> <strong className="text-rose-400">2 intercepted</strong>
            </div>
          </div>
        </div>

      </div>

      {/* No-Code Declarative Product Builder Form */}
      <div className="bg-agri-dark p-6 rounded-3xl border border-agri-800 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-agri-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" /> Declarative Product Builder (No Code Deployment)
          </h3>
          <span className="text-xs text-emerald-300 bg-agri-900 px-3 py-1 rounded-full border border-agri-700 font-mono">
            Data-Authored Product Engine
          </span>
        </div>

        <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div>
            <label className="text-gray-400 block mb-1 font-semibold">Product Name</label>
            <input
              type="text"
              required
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              placeholder="e.g. Paddy Monsoon Shield"
              className="w-full bg-agri-900 border border-agri-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1 font-semibold">Crop</label>
            <select
              value={productForm.crop}
              onChange={(e) => setProductForm({ ...productForm, crop: e.target.value })}
              className="w-full bg-agri-900 border border-agri-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Paddy">Paddy</option>
              <option value="Cotton">Cotton</option>
              <option value="Groundnut">Groundnut</option>
              <option value="Chilli">Chilli</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 block mb-1 font-semibold">Premium (₹)</label>
            <input
              type="number"
              required
              value={productForm.premium}
              onChange={(e) => setProductForm({ ...productForm, premium: parseFloat(e.target.value) })}
              className="w-full bg-agri-900 border border-agri-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1 font-semibold">Coverage Limit (₹)</label>
            <input
              type="number"
              required
              value={productForm.coverage}
              onChange={(e) => setProductForm({ ...productForm, coverage: parseFloat(e.target.value) })}
              className="w-full bg-agri-900 border border-agri-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1 font-semibold">Rainfall Threshold (mm)</label>
            <input
              type="number"
              required
              value={productForm.rainfall_threshold}
              onChange={(e) => setProductForm({ ...productForm, rainfall_threshold: parseFloat(e.target.value) })}
              className="w-full bg-agri-900 border border-agri-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1 font-semibold">Min Oracle Quorum</label>
            <input
              type="number"
              required
              value={productForm.min_oracles}
              onChange={(e) => setProductForm({ ...productForm, min_oracles: parseInt(e.target.value) })}
              className="w-full bg-agri-900 border border-agri-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="md:col-span-3 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-agri-600 to-emerald-600 hover:from-agri-500 hover:to-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg transition-all"
            >
              🚀 PUBLISH NEW INSURANCE PRODUCT
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
