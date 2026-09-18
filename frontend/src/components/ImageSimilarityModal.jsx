import React, { useState, useRef } from 'react';
import { Upload, X, Sparkles, Camera, Loader2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import ListingCard from './ListingCard';

export default function ImageSimilarityModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [detectedMaterial, setDetectedMaterial] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResults(null);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResults(null);
      setError(null);
    }
  };

  const runSimilaritySearch = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.imageSimilaritySearch(formData);
      setResults(response.results);
      setDetectedMaterial(response.detected_material);
    } catch (err) {
      setError(err.message || 'Failed to search for similar materials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl bg-slate-950/95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              AI Visual Material Search
            </h2>
            <p className="text-xs text-slate-400">
              Upload a site photo of bricks, tiles, steel, or wood to find matching salvaged materials in the marketplace.
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        {!preview ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="my-6 border-2 border-dashed border-slate-700 hover:border-cyan-400/60 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-900/40 hover:bg-slate-900/70"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-200">
              Drag & Drop your construction material photo here
            </div>
            <div className="text-xs text-slate-400 mt-1">or click to browse from device (JPG, PNG, WEBP)</div>
          </div>
        ) : (
          <div className="my-6 flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-40 h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
              <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="text-sm font-semibold text-white">Reference Photo Selected</div>
              <p className="text-xs text-slate-400">
                Our MobileNetV2 computer vision feature extractor will compute the visual embedding vector and match with active marketplace inventory.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={runSimilaritySearch}
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Computing Embeddings...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Find Visually Similar Materials
                    </>
                  )}
                </button>
                <button
                  onClick={() => { setFile(null); setPreview(null); setResults(null); }}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Change Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Visual Similarity Search Results
                </h3>
                <p className="text-xs text-emerald-400">
                  Detected Category: <span className="font-semibold uppercase">{detectedMaterial}</span> • Ranked by Cosine Distance
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {results.length} matches found
              </span>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                No active listings found matching this visual signature. Try another angle or category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
