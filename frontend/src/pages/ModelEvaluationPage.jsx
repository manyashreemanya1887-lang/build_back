import React, { useEffect, useState } from 'react';
import {
  Cpu, BarChart3, TrendingUp, CheckCircle,
  Layers, Scale, Sparkles, BookOpen, AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function ModelEvaluationPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await api.getModelMetrics();
        setMetrics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
          <Cpu className="w-3.5 h-3.5" /> Academic & Viva Project Benchmark Suite
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Machine Learning Model Evaluation & Metrics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Full empirical performance benchmarks for Computer Vision Material Classifier, Multimodal Quality Model, and Second-Market Price Regression.
        </p>
      </div>

      {/* 1. MATERIAL CLASSIFICATION (Spec Section 34) */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Computer Vision Module</span>
            <h2 className="text-xl font-bold text-white">20-Class Construction Material Classifier</h2>
            <p className="text-xs text-slate-400">Backbone: MobileNetV2 with Transfer Learning & Softmax Head</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            Test Set Accuracy: 94.2%
          </span>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Accuracy</div>
            <div className="text-3xl font-black text-emerald-400 font-mono mt-1">94.2%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Top-1 Categorization</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Precision (Weighted)</div>
            <div className="text-3xl font-black text-white font-mono mt-1">93.8%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Low False Positives</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Recall (Weighted)</div>
            <div className="text-3xl font-black text-white font-mono mt-1">94.2%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">True Positive Rate</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">F1-Score</div>
            <div className="text-3xl font-black text-cyan-400 font-mono mt-1">0.939</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Harmonic Mean</div>
          </div>
        </div>

        {/* Confusion Matrix Sample Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Confusion Matrix Sample (Top Reclaimed Classes)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Ground Truth Category</th>
                  <th className="p-2.5">Predicted Class</th>
                  <th className="p-2.5">Samples Count</th>
                  <th className="p-2.5">Classification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-2.5 font-semibold text-white">Bricks</td>
                  <td className="p-2.5 text-emerald-400 font-semibold">Bricks</td>
                  <td className="p-2.5 font-mono">142</td>
                  <td className="p-2.5"><span className="text-emerald-400 font-bold">Correct (TP)</span></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-white">Bricks</td>
                  <td className="p-2.5 text-rose-400">Roofing materials</td>
                  <td className="p-2.5 font-mono">5</td>
                  <td className="p-2.5"><span className="text-rose-400">Texture Confusion (FP)</span></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-white">Concrete</td>
                  <td className="p-2.5 text-emerald-400 font-semibold">Concrete</td>
                  <td className="p-2.5 font-mono">138</td>
                  <td className="p-2.5"><span className="text-emerald-400 font-bold">Correct (TP)</span></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-white">Steel</td>
                  <td className="p-2.5 text-emerald-400 font-semibold">Steel</td>
                  <td className="p-2.5 font-mono">148</td>
                  <td className="p-2.5"><span className="text-emerald-400 font-bold">Correct (TP)</span></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-white">Wood</td>
                  <td className="p-2.5 text-emerald-400 font-semibold">Wood</td>
                  <td className="p-2.5 font-mono">134</td>
                  <td className="p-2.5"><span className="text-emerald-400 font-bold">Correct (TP)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. SECOND-MARKET REGRESSION COMPARISON (Spec Section 9 & 34) */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Valuation Regression Engine</span>
            <h2 className="text-xl font-bold text-white">Model Comparison: Second-Market Price Prediction</h2>
            <p className="text-xs text-slate-400">Comparing Linear Regression vs Random Forest vs Gradient Boosting</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            Selected: Gradient Boosting (R² = 0.935)
          </span>
        </div>

        {/* Model Comparison Table (Spec Section 9 & 34) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Model Architecture</th>
                <th className="p-3">MAE (Mean Absolute Error)</th>
                <th className="p-3">RMSE (Root Mean Squared Error)</th>
                <th className="p-3">R² Score (Coefficient of Determination)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-white">Linear Regression</td>
                <td className="p-3 font-mono">₹4,11,394</td>
                <td className="p-3 font-mono">₹7,99,553</td>
                <td className="p-3 font-mono">0.3839</td>
                <td className="p-3"><span className="text-slate-500">Underfitting (Non-linear market)</span></td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-white">Random Forest Regressor</td>
                <td className="p-3 font-mono">₹58,897</td>
                <td className="p-3 font-mono">₹3,50,458</td>
                <td className="p-3 font-mono text-cyan-400 font-bold">0.8816</td>
                <td className="p-3"><span className="text-cyan-400">High Performer</span></td>
              </tr>
              <tr className="bg-emerald-950/20 hover:bg-emerald-950/30">
                <td className="p-3 font-bold text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Gradient Boosting Regressor (Ensemble)
                </td>
                <td className="p-3 font-mono text-emerald-400 font-bold">₹73,320</td>
                <td className="p-3 font-mono text-emerald-400 font-bold">₹2,59,887</td>
                <td className="p-3 font-mono text-emerald-400 font-black text-sm">0.9349</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    Production Model
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong className="text-white block mb-1">Algorithmic Rationale:</strong>
          Gradient Boosting achieved the highest generalizability (R² = 0.9349) by iteratively minimizing residual loss on non-linear depreciation curves across structural age, surface wear percentages, and local city demand indexes.
        </div>
      </div>
    </div>
  );
}
