import React, { useEffect, useState } from 'react';
import {
  Users, Layers, Leaf, DollarSign, ShieldCheck,
  Sparkles, Check, X, AlertTriangle, BarChart3, Database,
  TrendingUp, Activity
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const s = await api.getAdminStats();
      setStats(s);

      const ai = await api.getAiMonitoring();
      setAiData(ai);

      const allListings = await api.getListings({ status: 'all' });
      setListings(allListings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleModerate = async (id, action) => {
    try {
      await api.moderateListing(id, action);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to moderate listing');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="text-sm text-slate-400 mt-3">Loading administrative and AI telemetry...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform Governance & AI Auditing
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Administrator Command Center
          </h1>
        </div>
      </div>

      {/* Platform KPI Cards (Spec Section 24) */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Registered Users</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{stats.total_users}</div>
            <div className="text-[11px] text-slate-400 mt-1">Sellers, Buyers & Recyclers</div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Total Listed Lots</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{stats.total_listings}</div>
            <div className="text-[11px] text-emerald-400 mt-1">{stats.active_listings} active in marketplace</div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Diverted C&D Waste</span>
              <Leaf className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-teal-400 font-mono">
              ~{stats.total_waste_diverted_tonnes} t
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Saved from city landfills</div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Completed Transactions</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-400 font-mono">{stats.total_transactions}</div>
            <div className="text-[11px] text-slate-400 mt-1">Verified second-market deals</div>
          </div>
        </div>
      )}

      {/* AI Telemetry & Monitoring (Spec Section 25) */}
      {aiData && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">AI Model Performance & Drift Telemetry</h2>
                <p className="text-xs text-slate-400">Continuous inference metrics and active human feedback loop tracking</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Status: {aiData.drift_status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Total AI Inferences</div>
              <div className="text-2xl font-black text-white font-mono mt-1">{aiData.total_predictions}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Mean Confidence Score</div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                {Math.round(aiData.average_confidence * 100)}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Human Corrections Logged</div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">{aiData.human_corrections_recorded}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Model F1 Retention</div>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{aiData.accuracy_retention_rate}</div>
            </div>
          </div>

          {/* Low confidence review queue */}
          {aiData.low_confidence_queue && aiData.low_confidence_queue.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Low Confidence Flagged Listings Queue (&lt; 75%)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Title</th>
                      <th className="p-2.5">Predicted Material</th>
                      <th className="p-2.5">Confidence</th>
                      <th className="p-2.5">Seller</th>
                      <th className="p-2.5">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {aiData.low_confidence_queue.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-900/40">
                        <td className="p-2.5 font-semibold text-white">{item.title}</td>
                        <td className="p-2.5">{item.material}</td>
                        <td className="p-2.5 font-mono text-amber-400 font-bold">{Math.round(item.confidence * 100)}%</td>
                        <td className="p-2.5 text-slate-400">{item.seller}</td>
                        <td className="p-2.5">{item.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Listing Moderation Queue (Spec Section 2 Admin) */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white">Marketplace Listings Moderation Queue</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Price</th>
                <th className="p-3">Quality</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {listings.map((l) => (
                <tr key={l.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-semibold text-white">{l.title}</td>
                  <td className="p-3">{l.category}</td>
                  <td className="p-3 font-mono">{l.quantity} {l.unit}</td>
                  <td className="p-3 font-mono font-bold text-white">₹{l.price.toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold text-[10px]">
                      {l.quality_grade}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      l.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      l.status === 'flagged' ? 'bg-amber-500/20 text-amber-400' :
                      l.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {l.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      {l.status !== 'active' && (
                        <button
                          onClick={() => handleModerate(l.id, 'approve')}
                          className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[11px] font-semibold"
                        >
                          Approve
                        </button>
                      )}
                      {l.status !== 'flagged' && (
                        <button
                          onClick={() => handleModerate(l.id, 'flag')}
                          className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-[11px] font-semibold"
                        >
                          Flag
                        </button>
                      )}
                      {l.status !== 'rejected' && (
                        <button
                          onClick={() => handleModerate(l.id, 'reject')}
                          className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-[11px] font-semibold"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
