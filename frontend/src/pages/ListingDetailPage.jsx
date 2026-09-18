import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Sparkles, Shield, Heart, ArrowLeft, Send,
  Leaf, AlertTriangle, CheckCircle2, User, Phone, Calendar,
  DollarSign, Layers, Info, Share2, Check
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [similarListings, setSimilarListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Purchase Request Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [reqQuantity, setReqQuantity] = useState('');
  const [reqPrice, setReqPrice] = useState('');
  const [reqDate, setReqDate] = useState('');
  const [reqMessage, setReqMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reqSuccess, setReqSuccess] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await api.getListingDetail(id);
        setListing(data);
        setReqQuantity(data.quantity);
        setReqPrice(data.price);

        // Fetch similar materials in same category
        const allInCat = await api.getListings({ category: data.category });
        setSimilarListings(allInCat.filter((l) => l.id !== data.id).slice(0, 3));
      } catch (err) {
        setError(err.message || 'Failed to load listing details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handlePurchaseRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }

    setSubmitting(true);
    try {
      await api.createPurchaseRequest({
        listing_id: parseInt(id),
        quantity: parseFloat(reqQuantity),
        proposed_price: parseFloat(reqPrice),
        preferred_pickup_date: reqDate || undefined,
        message: reqMessage || undefined
      });
      setReqSuccess(true);
      setTimeout(() => {
        setModalOpen(false);
        setReqSuccess(false);
      }, 2500);
    } catch (err) {
      alert(err.message || 'Could not submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="text-sm text-slate-400 mt-3">Analyzing listing metadata and circular lifecycle...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <div className="text-rose-400 font-bold">{error || 'Listing not found'}</div>
        <Link to="/marketplace" className="inline-block px-4 py-2 rounded-xl bg-slate-800 text-xs text-white">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button */}
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image & Environmental Badge */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video relative group">
            <img
              src={listing.image_url || "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800"}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                {listing.quality_grade}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {Math.round(listing.ai_confidence * 100)}% AI Confidence
              </span>
            </div>
          </div>

          {/* Environmental Impact Card (Spec Section 17 & 19) */}
          <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-emerald-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Leaf className="w-4 h-4" />
                Estimated Circular Environmental Benefit
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">LCA Verified</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              By reusing this batch of <strong>{listing.quantity} {listing.unit} of {listing.material_name}</strong> instead of procuring virgin stock:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/20 text-center">
                <div className="text-xl font-extrabold text-emerald-400 font-mono">
                  ~{listing.estimated_waste_diverted} t
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Waste Diverted from Landfill</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/20 text-center">
                <div className="text-xl font-extrabold text-cyan-400 font-mono">
                  ~{listing.estimated_co2_saving} kg
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Avoided Embodied CO₂e</div>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-950/70 border border-emerald-500/20 text-center">
                <div className="text-xl font-extrabold text-amber-400 font-mono">
                  {Math.max(1, Math.round((listing.estimated_co2_saving || 20) / 21.77))}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Mature Tree Years Equivalent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Listing Details & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="uppercase tracking-wider font-semibold text-emerald-400">{listing.category}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {listing.city}, {listing.state}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {listing.title}
              </h1>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Listed Price</div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  ₹{listing.price.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  ₹{(listing.price / listing.quantity).toFixed(2)} per {listing.unit}
                </div>
              </div>

              {listing.ai_estimated_price && (
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">AI Valuation Estimate</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    ₹{listing.ai_estimated_price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-500">Based on demand index</div>
                </div>
              )}
            </div>

            {/* AI Condition & Quality Score Breakdown (Spec Section 7) */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                AI Quality & Condition Diagnosis
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Condition Grade:</span>
                  <strong className="text-white text-sm">{listing.quality_grade}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Quality Score:</span>
                  <strong className="text-emerald-400 text-sm">{listing.quality_score} / 100</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Estimated Age:</span>
                  <span className="text-slate-200">{listing.age} years</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Surface Damage:</span>
                  <span className="text-slate-200">{listing.damage_percentage}% wear</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full"
                  style={{ width: `${listing.quality_score}%` }}
                />
              </div>
            </div>

            {/* Recommended Uses (Spec Section 15) */}
            {listing.recommended_uses && listing.recommended_uses.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  AI Recommended Circular Uses:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {listing.recommended_uses.map((use, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Structural Advisory Notice (Spec Section 15) */}
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Disclaimer: Reuse recommendations are generated based on material condition scoring. They do not constitute formal structural engineering certifications.
              </span>
            </div>

            {/* Seller Contact & Purchase Request Button (Spec Section 20) */}
            <div className="pt-2 space-y-3">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Purchase / Pickup Request
              </button>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Seller: <strong>{listing.seller_name}</strong></span>
                </div>
                {listing.seller_phone && (
                  <span className="text-slate-400 font-mono">{listing.seller_phone}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Materials Section (Spec Section 19) */}
      {similarListings.length > 0 && (
        <div className="pt-10 border-t border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Similar Recovered Materials</h2>
            <Link to={`/marketplace?category=${listing.category}`} className="text-xs font-semibold text-emerald-400">
              View More in {listing.category}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarListings.map((sim) => (
              <ListingCard key={sim.id} listing={sim} />
            ))}
          </div>
        </div>
      )}

      {/* Purchase Request Modal (Spec Section 20) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-700 bg-slate-950 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">
              Send Purchase / Pickup Request
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Listing: <strong>{listing.title}</strong>
            </p>

            {reqSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Purchase Request Sent!</h4>
                <p className="text-xs text-slate-300">
                  The seller has been notified. You can track this deal in your Buyer Hub.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePurchaseRequest} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Quantity Required ({listing.unit})
                  </label>
                  <input
                    type="number"
                    required
                    value={reqQuantity}
                    onChange={(e) => setReqQuantity(e.target.value)}
                    max={listing.quantity}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Available batch: {listing.quantity} {listing.unit}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Proposed Total Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    required
                    value={reqPrice}
                    onChange={(e) => setReqPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Preferred Site Pickup Date
                  </label>
                  <input
                    type="date"
                    value={reqDate}
                    onChange={(e) => setReqDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Note / Message to Seller (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={reqMessage}
                    onChange={(e) => setReqMessage(e.target.value)}
                    placeholder="Describe transport arrangement or questions..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-slate-400 bg-slate-900 hover:bg-slate-800 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl text-slate-950 bg-emerald-400 hover:bg-emerald-300 font-bold text-xs shadow-md shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {submitting ? 'Transmitting...' : 'Confirm Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
