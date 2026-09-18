import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, ShieldCheck, Leaf, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Recycle className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                REBUILD<span className="text-emerald-400 ml-0.5">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Accelerating the circular economy in the construction industry through state-of-the-art Computer Vision, condition evaluation, and AI-powered secondary market price prediction.
            </p>
            <div className="flex items-center gap-4 text-xs text-emerald-400 font-medium pt-1">
              <span className="flex items-center gap-1"><Leaf className="w-3.5 h-3.5" /> Carbon Offset LCA</span>
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> MobileNetV2 Vision</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Verified Marketplace</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/marketplace" className="hover:text-emerald-400 transition-colors">Browse Materials</Link></li>
              <li><Link to="/create-listing" className="hover:text-emerald-400 transition-colors">Sell Surplus & Waste</Link></li>
              <li><Link to="/model-evaluation" className="hover:text-emerald-400 transition-colors">AI Model Metrics</Link></li>
              <li><Link to="/auth" className="hover:text-emerald-400 transition-colors">Contractor Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Circular Notice</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              REBUILD AI generates circular reuse recommendations, life-cycle carbon savings estimates, and fair valuation suggestions based on AI models. Recommendations do not substitute for certified professional structural engineering certifications.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <div>© 2026 REBUILD AI Platform. All rights reserved.</div>
          <div className="mt-2 sm:mt-0">Built for Advanced Circular Construction & Demo Engineering</div>
        </div>
      </div>
    </footer>
  );
}
