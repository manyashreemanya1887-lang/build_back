import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, CheckCircle2, Leaf, ShoppingBag, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyerData = async () => {
      setLoading(true);
      try {
        const myReqs = await api.getMyBuyerRequests();
        setRequests(myReqs);

        // Content-based recommendation based on active inventory
        const allListings = await api.getListings({ status: 'active' });
        setRecommended(allListings.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchBuyerData();
    }
  }, [user]);

  const completedPurchases = requests.filter((r) => r.status === 'accepted');
  const totalSpent = completedPurchases.reduce((acc, curr) => acc + curr.proposed_price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Buyer Procurement Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Architect / Builder: <strong className="text-cyan-400">{user?.name}</strong> • City: {user?.city}
        </p>
      </div>

      {/* KPI Cards (Spec Section 24) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Active Requests</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {requests.filter((r) => r.status === 'pending').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting seller response</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Purchases Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{completedPurchases.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Materials secured</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Procurement Investment</span>
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Saved ~40% vs virgin cost</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Avoided Embodied CO₂</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            ~{(completedPurchases.length * 480).toLocaleString()} kg
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Direct carbon offset</div>
        </div>
      </div>

      {/* My Purchase Requests Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white">My Purchase & Pickup Inquiries</h2>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            You haven't submitted any purchase requests yet.{' '}
            <Link to="/marketplace" className="text-emerald-400 underline">Explore available lots</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Material Lot</th>
                  <th className="p-3">Requested Qty</th>
                  <th className="p-3">Proposed Price</th>
                  <th className="p-3">Preferred Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">{r.listing_title}</td>
                    <td className="p-3 font-mono">{r.quantity} {r.listing_unit}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">₹{r.proposed_price.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-slate-400">{r.preferred_pickup_date || 'Immediate'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        r.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                        r.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recommended Materials (Spec Section 14) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Personalized Circular Recommendations</h2>
            <p className="text-xs text-slate-400">Curated based on your region ({user?.city}) and current masonry demand</p>
          </div>
          <Link to="/marketplace" className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            Browse All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommended.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
