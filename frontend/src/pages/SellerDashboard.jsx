import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers, CheckCircle, Clock, DollarSign, Leaf,
  PlusCircle, Check, X, ArrowUpRight, AlertCircle, Building2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      const allListings = await api.getListings({ status: 'all' });
      const myListings = allListings.filter((l) => l.seller_id === user?.id);
      setListings(myListings);

      const incomingReqs = await api.getIncomingSellerRequests();
      setRequests(incomingReqs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerData();
    }
  }, [user]);

  const handleStatusUpdate = async (reqId, newStatus) => {
    try {
      await api.updateRequestStatus(reqId, newStatus);
      fetchSellerData();
    } catch (err) {
      alert(err.message || 'Failed to update request');
    }
  };

  const activeCount = listings.filter((l) => l.status === 'active').length;
  const soldCount = listings.filter((l) => l.status === 'sold').length;
  const pendingReqs = requests.filter((r) => r.status === 'pending').length;
  const totalRevenue = listings
    .filter((l) => l.status === 'sold')
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Seller Operations Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Contractor: <strong className="text-emerald-400">{user?.name}</strong> • Location: {user?.city}, {user?.state}
          </p>
        </div>

        <Link
          to="/create-listing"
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Scan & Sell New Material
        </Link>
      </div>

      {/* KPI Cards (Spec Section 24) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Listed Lots</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{listings.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1">{activeCount} active in market</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Sold / Diverted</span>
            <CheckCircle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">{soldCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Diverted from landfill</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Pending Purchase Inquiries</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{pendingReqs}</div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting decision</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Realized Secondary Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Direct resale earnings</div>
        </div>
      </div>

      {/* Incoming Purchase Requests (Spec Section 20 & 24) */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Incoming Buyer Purchase Requests</h2>
          <span className="text-xs text-slate-400 font-mono">{requests.length} requests</span>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No incoming purchase requests yet. New buyer inquiries will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Material Lot</th>
                  <th className="p-3">Buyer Name</th>
                  <th className="p-3">Requested Qty</th>
                  <th className="p-3">Proposed Price</th>
                  <th className="p-3">Preferred Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">{r.listing_title}</td>
                    <td className="p-3">
                      <div>{r.buyer_name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{r.buyer_phone || r.buyer_email}</div>
                    </td>
                    <td className="p-3 font-mono">{r.quantity} {r.listing_unit}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">₹{r.proposed_price.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-slate-400">{r.preferred_pickup_date || 'Flexible'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        r.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                        r.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {r.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleStatusUpdate(r.id, 'accepted')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Accept Deal
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(r.id, 'rejected')}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-[11px]"
                          >
                            <X className="w-3 h-3" /> Decline
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* My Active Listings Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white">My Material Listings Inventory</h2>
        {listings.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            You have not listed any construction materials yet.{' '}
            <Link to="/create-listing" className="text-emerald-400 underline">Create one now</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Quality</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Listed Price</th>
                  <th className="p-3">AI Estimate</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">{l.title}</td>
                    <td className="p-3">{l.category}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-emerald-400">
                        {l.quality_grade}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{l.quantity} {l.unit}</td>
                    <td className="p-3 font-mono font-bold text-white">₹{l.price.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono text-emerald-400">₹{l.ai_estimated_price?.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        l.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        l.status === 'sold' ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {l.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/listings/${l.id}`}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 inline-block"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
