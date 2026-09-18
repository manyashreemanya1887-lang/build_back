import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, Shield, Heart, ArrowUpRight, Leaf } from 'lucide-react';

export default function ListingCard({ listing, onToggleFavorite }) {
  const gradeColors = {
    'Grade A': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'Grade B': 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    'Grade C': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'Grade D': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    'Grade E': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  const gradeBadge = gradeColors[listing.quality_grade] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col group border border-slate-800/80">
      {/* Image container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={listing.image_url || "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800"}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${gradeBadge}`}>
            {listing.quality_grade}
          </span>
          {listing.ai_confidence > 0 && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              {Math.round(listing.ai_confidence * 100)}% Match
            </span>
          )}
        </div>

        {/* Similarity match badge if from image search */}
        {listing.similarity_score !== undefined && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500 text-slate-950 shadow-md">
            {listing.similarity_score}% Visual Match
          </div>
        )}

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(listing.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-rose-400 transition-colors backdrop-blur-md border border-white/10"
            title="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${listing.is_favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-emerald-400">{listing.category}</span>
            <span className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {listing.city}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
            {listing.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {listing.description || `High quality reusable ${listing.material_name} available in bulk.`}
          </p>

          {/* Reuse Recommendation Snippet */}
          {listing.recommended_uses && listing.recommended_uses.length > 0 && (
            <div className="mt-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300">
              <span className="text-emerald-400 font-semibold block mb-0.5">Top AI Reuse:</span>
              <span className="line-clamp-1">{listing.recommended_uses[0]}</span>
            </div>
          )}
        </div>

        {/* Price and Action */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Total Valuation</div>
            <div className="text-lg font-extrabold text-white tracking-tight">
              ₹{listing.price.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-400 ml-1">
                ({listing.quantity} {listing.unit})
              </span>
            </div>
          </div>

          <Link
            to={`/listings/${listing.id}`}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-1 shadow-md shadow-emerald-500/10"
          >
            Details
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
