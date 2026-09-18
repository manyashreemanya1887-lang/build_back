import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Recycle, Sparkles, ArrowRight, ShieldCheck, Scale, Leaf,
  TrendingUp, Layers, CheckCircle2, ChevronRight, UploadCloud,
  Building2, HardHat, DollarSign, BarChart3, AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import ListingCard from '../components/ListingCard';

export default function LandingPage() {
  const [impact, setImpact] = useState({
    total_materials_reused_count: 5400,
    total_waste_diverted_tonnes: 32.2,
    total_co2_savings_kg: 5914.0,
    equivalent_trees_planted: 271,
    total_transactions: 12
  });

  const [featuredListings, setFeaturedListings] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await api.getEnvironmentalSummary();
        setImpact(stats);
      } catch (err) {
        console.error("Could not fetch live impact:", err);
      }

      try {
        const listings = await api.getListings({ status: 'active' });
        setFeaturedListings(listings.slice(0, 3));
      } catch (err) {
        console.error("Could not fetch featured listings:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          Autonomous Circular Economy AI Platform
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Give Construction Waste a{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Second Life.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          AI-powered identification, quality assessment, pricing and marketplace for reusable construction materials.
        </p>

        {/* Call to Actions (Spec 3 Buttons) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/marketplace"
            className="px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
          >
            Find Materials
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/create-listing"
            className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 transition-all flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-emerald-400" />
            Sell Waste / Upload Material
          </Link>

          <Link
            to="/marketplace"
            className="px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            Explore Marketplace
          </Link>
        </div>

        {/* Live Environmental Impact Bar (Spec Section 3 & 17) */}
        <div className="mt-16 max-w-5xl mx-auto glass-card rounded-2xl p-6 border border-slate-800 shadow-xl">
          <div className="text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-4 flex items-center justify-center gap-1.5">
            <Leaf className="w-4 h-4" /> Live Circular Economy Impact Dashboard
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {impact.total_materials_reused_count.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">Units of Material Reused</div>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                ~{impact.total_waste_diverted_tonnes} t
              </div>
              <div className="text-xs text-slate-400 mt-1">Waste Diverted from Landfill</div>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
                ~{impact.total_co2_savings_kg.toLocaleString()} kg
              </div>
              <div className="text-xs text-slate-400 mt-1">Avoided Embodied CO₂e</div>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                {impact.total_transactions}
              </div>
              <div className="text-xs text-slate-400 mt-1">Second-Market Deals Closed</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION (Spec Section 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">The Problem</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            Millions of Tonnes of Reusable Material Are Dumped Every Year
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Construction and Demolition (C&D) represents over 35% of all solid waste globally. Without automated appraisal tools, good materials get hauled straight to open dump yards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800/90">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Massive C&D Waste Volume</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Construction projects generate tonnes of usable brick rubble, rebar cutoffs, and timber that overwhelm city landfills.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800/90">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Discarded Reusable Goods</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Doors, tiles, blocks, and steel with over 80% residual structural lifespan are dumped due to lack of rapid classification.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800/90">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">High Cost of New Materials</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Contractors and builders struggle with soaring virgin material costs while affordable salvaged alternatives sit unlisted.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800/90">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Unorganized Second Market</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Demolition crews lack a trusted, transparent second-market valuation mechanism to monetize their salvaged inventory.
            </p>
          </div>
        </div>
      </section>

      {/* 3. THE SOLUTION SECTION (Spec Section 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/80">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">The Solution</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                REBUILD AI Bridges the Circular Gap with Computer Vision & Machine Learning
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We empower site managers and demolition contractors to snap a quick photo from their mobile phone. Within seconds, our transfer-learning neural networks classify the material, grade its condition, forecast the fair market resale value, and connect directly with local buyers.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">
                    <strong>Autonomous Classification:</strong> 20 C&D categories recognized via MobileNetV2 with low-confidence safety overrides.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">
                    <strong>Grades A to E Quality Scoring:</strong> Multimodal visual edge and condition assessment algorithms.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">
                    <strong>Predictive Price Regression:</strong> Trained on local Indian building market indices to prevent under-pricing.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">
                    <strong>Instant Carbon LCA:</strong> Quantifies avoided embodied CO₂ emissions and landfill diversion in tonnes.
                  </span>
                </div>
              </div>
            </div>

            {/* AI Mock Visual Analysis Preview Card */}
            <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-slate-950/90 shadow-2xl relative overflow-hidden">
              <div className="text-xs font-mono uppercase text-emerald-400 font-semibold mb-3 flex items-center justify-between">
                <span>AI Material Analysis</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px]">Real-Time Inference</span>
              </div>

              <div className="aspect-video rounded-xl overflow-hidden mb-4 relative">
                <img
                  src="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&auto=format&fit=crop&q=80"
                  alt="Brick sample"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 text-xs text-white font-mono bg-slate-950/80 px-2 py-1 rounded">
                  Sample: Red Brick (Colonial Reclaimed)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-400">Detected Material</div>
                  <div className="text-base font-extrabold text-white">RED BRICK</div>
                  <div className="text-[11px] text-cyan-400 font-mono mt-0.5">Confidence: 95%</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-400">Quality Assessment</div>
                  <div className="text-base font-extrabold text-emerald-400">GRADE B</div>
                  <div className="text-[11px] text-slate-300 font-mono mt-0.5">Score: 78 / 100</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Suggested Price:</span>
                  <span className="font-extrabold text-emerald-400 font-mono">₹18,000 (2,000 pcs)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Recyclability:</span>
                  <span className="text-teal-300">Directly Reusable (Secondary Masonry)</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold">Recommended Uses:</span> Garden walls, Landscaping features, Patios, Non-loadbearing infill.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (Spec Section 3 - 6 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Seamless Circular Workflow</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            How REBUILD AI Works
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Six rapid steps from demolition debris to verified secondary construction reuse.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { step: 'Step 1', title: 'Upload Image', desc: 'Take or upload site photo of materials directly from phone or desktop.', icon: UploadCloud, color: 'text-emerald-400' },
            { step: 'Step 2', title: 'AI Identifies Material', desc: 'Computer Vision models categorize the material among 20 C&D classes.', icon: Sparkles, color: 'text-teal-400' },
            { step: 'Step 3', title: 'AI Evaluates Quality', desc: 'Assigns Grades A through E with a 0-100 score and structural guidance.', icon: ShieldCheck, color: 'text-cyan-400' },
            { step: 'Step 4', title: 'AI Estimates Price', desc: 'Predictive regression calculates fair second-market valuation in INR.', icon: Scale, color: 'text-amber-400' },
            { step: 'Step 5', title: 'List on Marketplace', desc: 'Publish with 1 click to verified buyers, contractors, and recyclers.', icon: Building2, color: 'text-indigo-400' },
            { step: 'Step 6', title: 'Buyer Reuses / Recycles', desc: 'Material is diverted from landfill; CO₂ & tonnage savings recorded live.', icon: Recycle, color: 'text-emerald-400' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-card rounded-2xl p-6 border border-slate-800/80 relative group hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-slate-500">{item.step}</span>
                  <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FEATURED LISTINGS */}
      {featuredListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live Second Market</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Featured Reclaimed Materials
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              View All Listings <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-card rounded-3xl p-10 sm:p-14 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-teal-950/40">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Monetize Demolition Waste or Find Affordable Salvaged Materials?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mt-4">
            Join forward-thinking contractors, demolition companies, architects, and recyclers driving zero-landfill construction.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/create-listing"
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/20"
            >
              Start AI Material Scan
            </Link>
            <Link
              to="/marketplace"
              className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700"
            >
              Browse Second-Market Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
