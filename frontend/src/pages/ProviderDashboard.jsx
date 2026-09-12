import React, { useState, useEffect } from 'react';
import { 
  Layers, DollarSign, AlertTriangle, MapPin, CheckCircle2, XCircle, Search, Filter, 
  Eye, Check, ShieldCheck, Sparkles, RefreshCw, Zap, UserCheck, ArrowUpRight, X, TrendingUp, ChevronRight, UserPlus, Plus, Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { fetchApi } from '../services/api';

const generate450FarmerPolicies = () => {
  const firstNames = [
    'Ramesh', 'Anitha', 'Venkat', 'Srinivas', 'Kavitha', 'Balaram', 'Rajendra', 'Sunitha',
    'Rajeshwar', 'Venkatesh', 'Swapna', 'Ramanaiah', 'Mahender', 'Madhavi', 'Nagappa', 'Chandra',
    'Swathi', 'Bhaskar', 'Ganga', 'Sudhakar', 'Padma', 'Tirupati', 'Saroja', 'Hanumanthu',
    'Sujatha', 'Laxman', 'Vijayalaxmi', 'Mallesh', 'Shankar', 'Radha', 'Narasimha', 'Santhosh',
    'Prabhakar', 'Subhash', 'Koteswara', 'Satyanarayana', 'Srinivasa', 'Devender', 'Srilatha', 'Vani'
  ];

  const lastNames = [
    'Kumar', 'Rao', 'Reddy', 'Goud', 'Chenna', 'Naidu', 'Prasad', 'Kurma', 'Chowdary', 'Devi',
    'Varma', 'Latha', 'Swamy', 'Sekhar', 'Kulkarni', 'Patel', 'Sharma', 'Verma', 'Yadav',
    'Deshmukh', 'Joshi', 'Babu', 'Murthy', 'Narayana', 'Raju', 'Singh', 'Naik', 'Gupta', 'Pillai'
  ];

  const crops = ['Paddy (Kharif)', 'Cotton', 'Groundnut', 'Maize', 'Chilli', 'Paddy (Rabi)'];

  const locations = [
    'Warangal Central', 'Nalgonda East', 'Karimnagar North', 'Khammam South', 'Mahabubnagar West',
    'Nizamabad District', 'Adilabad Sector 4', 'Medak Rural', 'Siddipet Zone', 'Ranga Reddy East'
  ];

  const coverages = [10000, 12000, 15000, 20000, 25000];
  const premiums = [249, 299, 399, 499, 599];

  const policies = [];

  for (let i = 0; i < 450; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 7 + 3) % lastNames.length];
    const crop = crops[(i * 3) % crops.length];
    const location = locations[(i * 5) % locations.length];
    const coverage = coverages[i % coverages.length];
    const premium = premiums[i % premiums.length];

    let status = 'ACTIVE';
    if (i < 42) {
      status = 'TRIGGERED';
    } else if (i < 170) {
      status = 'APPROVED';
    } else if (i < 425) {
      status = 'ACTIVE';
    } else {
      status = 'REJECTED';
    }

    let rainObserved = '38 mm';
    let rainThreshold = '40 mm';
    let txHash = null;

    if (status === 'TRIGGERED' || status === 'APPROVED') {
      rainObserved = `${16 + (i % 15)} mm`;
      if (status === 'APPROVED') {
        const hashSeed = (1000000 + i * 8888).toString(16);
        txHash = `0x${hashSeed}...${(4000 + i).toString(16)}`;
      }
    } else if (status === 'ACTIVE') {
      rainObserved = `${42 + (i % 25)} mm`;
    } else if (status === 'REJECTED') {
      rainObserved = `${45 + (i % 12)} mm`;
    }

    const monthNum = String(5 + (i % 4)).padStart(2, '0');
    const dayNum = String(1 + (i % 28)).padStart(2, '0');

    policies.push({
      id: `POL-${1001 + i}`,
      farmerId: `USR-${101 + (i % 380)}`,
      farmerName: `${fn} ${ln}`,
      phone: `+91 ${98000 + ((i * 37) % 10000)} ${(10000 + ((i * 12345) % 90000))}`,
      crop: crop,
      location: location,
      acreage: `${(1.5 + (i % 60) * 0.1).toFixed(1)} ha`,
      coverage: coverage,
      premium: premium,
      rainfallObserved: rainObserved,
      rainfallThreshold: rainThreshold,
      status: status,
      oracleConsensus: `${92 + (i % 8)}%`,
      txHash: txHash,
      dateEnrolled: `2026-${monthNum}-${dayNum}`
    });
  }

  return policies;
};

export default function ProviderDashboard({ userSession, viewMode = 'dashboard', setRole, dateRange }) {
  const [farmerPolicies, setFarmerPolicies] = useState(() => generate450FarmerPolicies());
  
  // Real-time calculations derived directly from the 450 farmer policies dataset
  const totalPoliciesCount = farmerPolicies.length;
  const activePoliciesCount = farmerPolicies.filter(p => p.status === 'ACTIVE').length;
  const triggeredPoliciesCount = farmerPolicies.filter(p => p.status === 'TRIGGERED').length;
  const approvedPoliciesCount = farmerPolicies.filter(p => p.status === 'APPROVED').length;

  const totalPremiumCollected = farmerPolicies.reduce((sum, p) => sum + (p.premium || 0), 0);
  const totalCoverageAmount = farmerPolicies.reduce((sum, p) => sum + (p.coverage || 0), 0);
  const totalPayoutsDisbursed = farmerPolicies.filter(p => p.status === 'APPROVED').reduce((sum, p) => sum + (p.coverage || 0), 0);

  // Dynamic crop distribution calculated directly from registered farmer crops
  const cropData = [
    { crop: 'Paddy', count: farmerPolicies.filter(p => p.crop.includes('Paddy')).length },
    { crop: 'Cotton', count: farmerPolicies.filter(p => p.crop.includes('Cotton')).length },
    { crop: 'Groundnut', count: farmerPolicies.filter(p => p.crop.includes('Groundnut')).length },
    { crop: 'Maize', count: farmerPolicies.filter(p => p.crop.includes('Maize')).length },
    { crop: 'Chilli', count: farmerPolicies.filter(p => p.crop.includes('Chilli')).length }
  ];

  const [premiumTrend] = useState([
    { month: 'May', premium: 4.2 },
    { month: 'Jun', premium: 8.5 },
    { month: 'Jul', premium: 11.4 },
    { month: 'Aug', premium: 8.3 }
  ]);

  const [mapStations] = useState([
    { id: 'ST-001', name: 'Warangal Central', rainfall: '28 mm', status: 'TRIGGERED', policies: 420 },
    { id: 'ST-002', name: 'Karimnagar North', rainfall: '42 mm', status: 'HEALTHY', policies: 0 },
    { id: 'ST-003', name: 'Nalgonda East', rainfall: '18 mm', status: 'TRIGGERED', policies: 680 },
    { id: 'ST-004', name: 'Khammam South', rainfall: '35 mm', status: 'HEALTHY', policies: 0 }
  ]);

  // Filter, Search, Pagination, and Add Farmer modal states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(viewMode === 'claims' ? 'TRIGGERED' : 'ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [toastMessage, setToastMessage] = useState(null);
  const [selectedPolicyDetail, setSelectedPolicyDetail] = useState(null);
  const [isAddFarmerOpen, setIsAddFarmerOpen] = useState(false);

  // New Farmer Registration Form State
  const [newFarmer, setNewFarmer] = useState({
    farmerName: '',
    phone: '',
    crop: 'Paddy (Kharif)',
    location: 'Warangal Central',
    acreage: '3.5 ha',
    coverage: 20000,
    premium: 499
  });

  const handleAddFarmerSubmit = (e) => {
    e.preventDefault();
    if (!newFarmer.farmerName.trim()) {
      alert("Please enter farmer name");
      return;
    }

    const newIdNum = farmerPolicies.length + 1001;
    const newPolicyObj = {
      id: `POL-${newIdNum}`,
      farmerId: `USR-${farmerPolicies.length + 107}`,
      farmerName: newFarmer.farmerName.trim(),
      phone: newFarmer.phone.trim() || '+91 98765 00000',
      crop: newFarmer.crop,
      location: newFarmer.location,
      acreage: newFarmer.acreage,
      coverage: Number(newFarmer.coverage),
      premium: Number(newFarmer.premium),
      rainfallObserved: '38 mm',
      rainfallThreshold: '40 mm',
      status: 'ACTIVE',
      oracleConsensus: '97%',
      txHash: null,
      dateEnrolled: new Date().toISOString().split('T')[0]
    };

    setFarmerPolicies(prev => [newPolicyObj, ...prev]);

    setIsAddFarmerOpen(false);
    setNewFarmer({
      farmerName: '',
      phone: '',
      crop: 'Paddy (Kharif)',
      location: 'Warangal Central',
      acreage: '3.5 ha',
      coverage: 20000,
      premium: 499
    });

    showToast(`🌾 New Farmer ${newPolicyObj.farmerName} (${newPolicyObj.id}) registered successfully!`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle single policy payment approval
  const handleApprovePayment = (policyId) => {
    const randomHash = '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6);
    let farmerApprovedName = '';
    let amountApproved = 0;

    setFarmerPolicies(prev => prev.map(pol => {
      if (pol.id === policyId) {
        farmerApprovedName = pol.farmerName;
        amountApproved = pol.coverage;
        return { ...pol, status: 'APPROVED', txHash: randomHash };
      }
      return pol;
    }));

    showToast(`✅ Payment of ₹${amountApproved.toLocaleString('en-IN')} approved for ${farmerApprovedName} (${policyId})! Transaction hash: ${randomHash}`);
  };

  // Handle single policy rejection
  const handleRejectPayment = (policyId) => {
    let farmerName = '';
    setFarmerPolicies(prev => prev.map(pol => {
      if (pol.id === policyId) {
        farmerName = pol.farmerName;
        return { ...pol, status: 'REJECTED' };
      }
      return pol;
    }));
    showToast(`❌ Claim for policy ${policyId} (${farmerName}) was flagged/rejected for manual inspection.`);
  };

  // Batch approve all triggered policies
  const handleBatchApproveAll = () => {
    const triggeredList = farmerPolicies.filter(p => p.status === 'TRIGGERED');
    if (triggeredList.length === 0) {
      showToast("ℹ️ No pending triggered policies to approve.");
      return;
    }

    let totalDisbursed = 0;
    setFarmerPolicies(prev => prev.map(pol => {
      if (pol.status === 'TRIGGERED') {
        totalDisbursed += pol.coverage;
        const hash = '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6);
        return { ...pol, status: 'APPROVED', txHash: hash };
      }
      return pol;
    }));

    showToast(`⚡ Batch Approved ${triggeredList.length} pending claims! Total disbursed: ₹${totalDisbursed.toLocaleString('en-IN')}`);
  };

  // Reset page number on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Filtered farmers list
  const filteredPolicies = farmerPolicies.filter(pol => {
    const matchesSearch = pol.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pol.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pol.farmerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pol.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pol.crop.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || pol.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPolicies.length / pageSize));
  const paginatedPolicies = filteredPolicies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pendingTriggeredCount = farmerPolicies.filter(p => p.status === 'TRIGGERED').length;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0a2318] border border-emerald-500/60 text-emerald-200 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl animate-slideDown flex items-center gap-3 text-xs max-w-md">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* VIEW MODE 1: EXECUTIVE PORTFOLIO ANALYTICS DASHBOARD */}
      {viewMode === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-emerald-900/60 pb-4">
            <div>
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">🏢 INSURER & PROVIDER EXECUTIVE PORTFOLIO</span>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Executive Portfolio & Exposure Analytics
              </h2>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Real-time risk exposure, premium collection growth, and regional oracle telemetry overview.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {dateRange?.label && (
                <span className="bg-[#102419] border border-emerald-500/30 px-3 py-2 rounded-xl text-xs text-emerald-300 font-mono shadow-md flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Window: <strong className="text-white">{dateRange.label}</strong>
                </span>
              )}
              {setRole && (
                <button
                  onClick={() => setRole('policy')}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-400/40"
                >
                  <span>Go to Farmer Policy Roster</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <div className="bg-[#102419] border border-emerald-500/30 px-3 py-2 rounded-xl text-xs text-emerald-300 font-mono shadow-md">
                ID: KS-PROV-7A29F4
              </div>
            </div>
          </div>

          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-[#102419]/90 p-4 rounded-2xl border border-emerald-500/30 shadow-xl backdrop-blur-xl text-white card-hover-effect">
              <span className="text-xs text-gray-300 font-semibold block">Total Policies</span>
              <strong className="text-xl font-black text-white">{totalPoliciesCount.toLocaleString('en-IN')}</strong>
            </div>
            <div className="bg-[#102419]/90 p-4 rounded-2xl border border-emerald-500/30 shadow-xl backdrop-blur-xl text-white card-hover-effect">
              <span className="text-xs text-gray-300 font-semibold block">Active Policies</span>
              <strong className="text-xl font-black text-emerald-400">{activePoliciesCount.toLocaleString('en-IN')}</strong>
            </div>
            <div className="bg-[#102419]/90 p-4 rounded-2xl border border-emerald-500/30 shadow-xl backdrop-blur-xl text-white card-hover-effect">
              <span className="text-xs text-gray-300 font-semibold block">Premium Collected</span>
              <strong className="text-xl font-black text-sky-400">₹{(totalPremiumCollected / 100000).toFixed(2)} L</strong>
            </div>
            <div className="bg-[#102419]/90 p-4 rounded-2xl border border-emerald-500/30 shadow-xl backdrop-blur-xl text-white card-hover-effect">
              <span className="text-xs text-gray-300 font-semibold block">Coverage Exposure</span>
              <strong className="text-xl font-black text-purple-400">₹{(totalCoverageAmount / 10000000).toFixed(2)} Cr</strong>
            </div>
            <div className="bg-[#102419]/90 p-4 rounded-2xl border border-emerald-500/30 shadow-xl backdrop-blur-xl text-white card-hover-effect border-amber-500/40">
              <span className="text-xs text-amber-300 font-semibold block">Pending Triggered</span>
              <strong className="text-xl font-black text-amber-400">{triggeredPoliciesCount.toLocaleString('en-IN')}</strong>
            </div>
            <div className="bg-[#102419]/90 p-4 rounded-2xl border border-emerald-500/30 shadow-xl backdrop-blur-xl text-white card-hover-effect">
              <span className="text-xs text-gray-300 font-semibold block">Total Payouts</span>
              <strong className="text-xl font-black text-emerald-300">₹{(totalPayoutsDisbursed / 10000000).toFixed(2)} Cr</strong>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Policy Distribution Chart */}
            <div className="bg-[#102419]/90 p-6 rounded-3xl border border-emerald-500/30 shadow-2xl backdrop-blur-xl space-y-4 card-hover-effect">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" /> Policy Distribution by Crop
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cropData}>
                    <XAxis dataKey="crop" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#0a1b12', borderColor: '#22c55e', color: '#fff' }} />
                    <Bar dataKey="count" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Premium Trend Chart */}
            <div className="bg-[#102419]/90 p-6 rounded-3xl border border-emerald-500/30 shadow-2xl backdrop-blur-xl space-y-4 card-hover-effect">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-sky-400" /> Monthly Premiums (₹ Lakhs)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={premiumTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#0a1b12', borderColor: '#38bdf8', color: '#fff' }} />
                    <Line type="monotone" dataKey="premium" stroke="#38bdf8" strokeWidth={3} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Trigger Risk & Geographic Exposure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Exposure Risk Level Card */}
            <div className="bg-[#102419]/90 p-6 rounded-3xl border border-emerald-500/30 shadow-2xl backdrop-blur-xl space-y-4 card-hover-effect">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Trigger Risk Exposure
              </h3>
              <div className="space-y-3 text-xs">
                <div className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-800 flex justify-between items-center text-white">
                  <span>Low Risk (&gt;45 mm expected)</span>
                  <strong className="text-emerald-400 font-bold font-mono">8,200 policies</strong>
                </div>
                <div className="bg-amber-950/70 p-3 rounded-xl border border-amber-800 flex justify-between items-center text-white">
                  <span>Medium Risk (38–45 mm)</span>
                  <strong className="text-amber-400 font-bold font-mono">3,100 policies</strong>
                </div>
                <div className="bg-rose-950/70 p-3 rounded-xl border border-rose-800 flex justify-between items-center text-white">
                  <span>High Risk (&lt;38 mm)</span>
                  <strong className="text-rose-400 font-bold font-mono">1,240 policies</strong>
                </div>
              </div>
            </div>

            {/* Geographic Exposure List */}
            <div className="md:col-span-2 bg-[#102419]/90 p-6 rounded-3xl border border-emerald-500/30 shadow-2xl backdrop-blur-xl space-y-4 card-hover-effect">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" /> Geographic Station Exposure
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-gray-300">
                  <thead className="bg-[#05110b] text-gray-300 uppercase font-semibold border-b border-emerald-900">
                    <tr>
                      <th className="px-4 py-2">Station</th>
                      <th className="px-4 py-2">Region</th>
                      <th className="px-4 py-2">Observed Rain</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Triggered Policies</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950 font-mono">
                    {mapStations.map((st) => (
                      <tr key={st.id} className="hover:bg-emerald-950/60 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">{st.id}</td>
                        <td className="px-4 py-3 text-gray-300">{st.name}</td>
                        <td className="px-4 py-3 text-sky-300 font-bold">{st.rainfall}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            st.status === 'TRIGGERED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {st.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-emerald-400 font-bold">{st.policies}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}


      {/* VIEW MODE 2 & 3: FARMER POLICY ROSTER & PAYOUT APPROVALS PORTAL */}
      {(viewMode === 'policy' || viewMode === 'claims') && (
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-emerald-900/60 pb-4">
            <div>
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                {viewMode === 'claims' ? '💰 PAYOUT APPROVAL PORTAL' : '📜 FARMER POLICY ROSTER'}
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                {viewMode === 'claims' ? 'Pending Claims & Payout Disbursal' : 'Enrolled Farmer Policies & Status Tracking'}
              </h2>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                {viewMode === 'claims' 
                  ? 'Review parametric weather triggers and authorize instant direct bank transfers.' 
                  : 'Complete registry of all farmers enrolled in parametric crop insurance policies.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddFarmerOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-400/40 active:scale-95"
              >
                <UserPlus className="w-4 h-4 text-white" />
                <span>Add New Farmer</span>
              </button>
              <button
                onClick={handleBatchApproveAll}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 border border-emerald-400/40"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Approve All Triggered ({pendingTriggeredCount})</span>
              </button>
              <div className="bg-[#102419] border border-emerald-500/30 px-3 py-2 rounded-xl text-xs text-emerald-300 font-mono shadow-md">
                ID: KS-PROV-7A29F4
              </div>
            </div>
          </div>

          {/* MAIN FARMER POLICIES & PAYOUT APPROVAL TABLE */}
          <div className="bg-[#102419]/90 border border-emerald-500/30 rounded-3xl p-6 text-white shadow-2xl backdrop-blur-xl space-y-5">
            
            {/* Table Controls: Search & Filter Tabs */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-400" /> Farmer Policies Roster & Claim Approvals
                </h3>
                <p className="text-xs text-emerald-300/80">Search farmers, review rainfall metrics, and approve payouts.</p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Search Bar */}
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search farmer name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0a1b12] border border-emerald-500/30 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Status Filter Buttons */}
                <div className="flex items-center bg-[#0a1b12] rounded-xl p-1 border border-emerald-500/30 text-xs">
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${statusFilter === 'ALL' ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                  >
                    All ({farmerPolicies.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('TRIGGERED')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${statusFilter === 'TRIGGERED' ? 'bg-amber-500 text-black shadow' : 'text-amber-300 hover:text-amber-200'}`}
                  >
                    Triggered ({farmerPolicies.filter(p => p.status === 'TRIGGERED').length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('APPROVED')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${statusFilter === 'APPROVED' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-400 hover:text-white'}`}
                  >
                    Paid ({farmerPolicies.filter(p => p.status === 'APPROVED').length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('ACTIVE')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${statusFilter === 'ACTIVE' ? 'bg-sky-600 text-white shadow' : 'text-sky-300 hover:text-white'}`}
                  >
                    Healthy ({farmerPolicies.filter(p => p.status === 'ACTIVE').length})
                  </button>
                </div>
              </div>
            </div>

            {/* Farmer Policy Roster Table */}
            <div className="overflow-x-auto rounded-2xl border border-emerald-500/20">
              <table className="w-full text-xs text-left text-gray-200">
                <thead className="bg-[#05110b] text-gray-300 uppercase font-semibold border-b border-emerald-900">
                  <tr>
                    <th className="px-4 py-3">Policy ID</th>
                    <th className="px-4 py-3">Farmer Name & ID</th>
                    <th className="px-4 py-3">Crop & Location</th>
                    <th className="px-4 py-3">Observed Rain</th>
                    <th className="px-4 py-3">Coverage & Payout</th>
                    <th className="px-4 py-3">Policy Status</th>
                    <th className="px-4 py-3 text-right">Provider Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950 font-sans">
                  {filteredPolicies.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-400 font-mono">
                        No farmer policies found matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedPolicies.map((pol) => (
                      <tr key={pol.id} className="hover:bg-emerald-950/40 transition-colors">
                        
                        {/* Policy ID */}
                        <td className="px-4 py-3 font-mono font-bold text-emerald-300">{pol.id}</td>

                        {/* Farmer Profile */}
                        <td className="px-4 py-3">
                          <div className="font-bold text-white text-sm">{pol.farmerName}</div>
                          <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                            <span>{pol.farmerId}</span> • <span>{pol.phone}</span>
                          </div>
                        </td>

                        {/* Crop & Location */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{pol.crop} ({pol.acreage})</div>
                          <div className="text-[10px] text-gray-400">{pol.location}</div>
                        </td>

                        {/* Rainfall Telemetry */}
                        <td className="px-4 py-3">
                          <div className="font-mono font-bold text-amber-300">{pol.rainfallObserved}</div>
                          <div className="text-[10px] text-gray-400 font-mono">Limit: {pol.rainfallThreshold}</div>
                        </td>

                        {/* Coverage Amount */}
                        <td className="px-4 py-3">
                          <div className="font-mono font-bold text-emerald-300 text-sm">₹{pol.coverage.toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-gray-400 font-mono">Prem: ₹{pol.premium}</div>
                        </td>

                        {/* Policy Status Badge */}
                        <td className="px-4 py-3">
                          {pol.status === 'TRIGGERED' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3" /> TRIGGERED (Pending)
                            </span>
                          )}
                          {pol.status === 'APPROVED' && (
                            <div className="space-y-0.5">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> PAID & DISBURSED
                              </span>
                              {pol.txHash && (
                                <span className="text-[9px] text-emerald-400/80 font-mono block">Tx: {pol.txHash}</span>
                              )}
                            </div>
                          )}
                          {pol.status === 'ACTIVE' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1 w-fit">
                              <ShieldCheck className="w-3 h-3 text-sky-400" /> ACTIVE (Healthy Rain)
                            </span>
                          )}
                          {pol.status === 'REJECTED' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 w-fit">
                              <XCircle className="w-3 h-3 text-rose-400" /> REJECTED
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            
                            {pol.status === 'TRIGGERED' && (
                              <>
                                <button
                                  onClick={() => handleApprovePayment(pol.id)}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] shadow transition-all flex items-center gap-1 cursor-pointer"
                                  title="Approve Bank Payout"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button
                                  onClick={() => handleRejectPayment(pol.id)}
                                  className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg font-bold text-[11px] border border-rose-800 transition-all cursor-pointer"
                                  title="Reject Claim"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => setSelectedPolicyDetail(pol)}
                              className="p-1.5 bg-[#0a1b12] hover:bg-emerald-950 text-emerald-300 rounded-lg border border-emerald-500/30 transition-all cursor-pointer"
                              title="View Telemetry Audit"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-400" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pagination Controls */}
            <div className="flex flex-wrap justify-between items-center gap-4 pt-3 border-t border-emerald-900/60 text-xs">
              <div className="flex items-center space-x-3 text-gray-400 font-mono">
                <span>
                  Showing <strong className="text-white">{filteredPolicies.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> – <strong className="text-white">{Math.min(currentPage * pageSize, filteredPolicies.length)}</strong> of <strong className="text-emerald-300 font-bold">{filteredPolicies.length}</strong> farmers
                </span>
                <span className="text-gray-600">|</span>
                <div className="flex items-center space-x-1.5 text-xs text-gray-300">
                  <span>Rows:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-[#05110b] border border-emerald-500/30 rounded-lg px-2 py-1 text-emerald-300 text-xs font-mono focus:outline-none cursor-pointer"
                  >
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={450}>All (450)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 bg-[#0a1b12] hover:bg-emerald-950 border border-emerald-500/30 rounded-xl text-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all font-semibold"
                >
                  ◀ Prev
                </button>
                <span className="font-mono text-emerald-300 px-3 font-bold">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 bg-[#0a1b12] hover:bg-emerald-950 border border-emerald-500/30 rounded-xl text-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all font-semibold"
                >
                  Next ▶
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Add New Farmer Modal */}
      {isAddFarmerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a1b12] border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4 animate-scaleUp">
            
            <div className="flex justify-between items-center border-b border-emerald-900 pb-3">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-base text-white">Enroll New Farmer Policy</h3>
              </div>
              <button onClick={() => setIsAddFarmerOpen(false)} className="p-1.5 text-gray-400 hover:text-white rounded-xl">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFarmerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Farmer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manikanta Varma"
                  value={newFarmer.farmerName}
                  onChange={(e) => setNewFarmer({ ...newFarmer, farmerName: e.target.value })}
                  className="w-full bg-[#102419] border border-emerald-500/30 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Mobile Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +91 99887 76655"
                  value={newFarmer.phone}
                  onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value })}
                  className="w-full bg-[#102419] border border-emerald-500/30 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Crop Type</label>
                  <select
                    value={newFarmer.crop}
                    onChange={(e) => {
                      const c = e.target.value;
                      let cov = 20000;
                      let prem = 499;
                      if (c === 'Cotton') { cov = 15000; prem = 399; }
                      else if (c === 'Groundnut') { cov = 12000; prem = 299; }
                      else if (c === 'Maize') { cov = 10000; prem = 249; }
                      setNewFarmer({ ...newFarmer, crop: c, coverage: cov, premium: prem });
                    }}
                    className="w-full bg-[#102419] border border-emerald-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Paddy (Kharif)">Paddy (Kharif)</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Groundnut">Groundnut</option>
                    <option value="Maize">Maize</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Location Station</label>
                  <select
                    value={newFarmer.location}
                    onChange={(e) => setNewFarmer({ ...newFarmer, location: e.target.value })}
                    className="w-full bg-[#102419] border border-emerald-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Warangal Central">Warangal Central</option>
                    <option value="Nalgonda East">Nalgonda East</option>
                    <option value="Karimnagar North">Karimnagar North</option>
                    <option value="Khammam South">Khammam South</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Land Area (Acreage)</label>
                  <input
                    type="text"
                    placeholder="e.g. 3.5 ha"
                    value={newFarmer.acreage}
                    onChange={(e) => setNewFarmer({ ...newFarmer, acreage: e.target.value })}
                    className="w-full bg-[#102419] border border-emerald-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Coverage Shield (₹)</label>
                  <input
                    type="number"
                    readOnly
                    value={newFarmer.coverage}
                    className="w-full bg-[#05110b] border border-emerald-500/20 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFarmerOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Issue Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}



