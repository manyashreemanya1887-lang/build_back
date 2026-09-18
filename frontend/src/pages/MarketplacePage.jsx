import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, SlidersHorizontal, Camera, RotateCcw, Filter,
  Building, MapPin, Sparkles, AlertCircle, ArrowUpDown
} from 'lucide-react';
import { api } from '../services/api';
import ListingCard from '../components/ListingCard';
import ImageSimilarityModal from '../components/ImageSimilarityModal';

const CATEGORIES = [
  'All', 'Masonry', 'Metals', 'Timber', 'Finishing',
  'Plumbing', 'Joinery', 'Stone', 'Aggregates', 'Electrical',
  'Roofing', 'Sanitaryware', 'Demolition Waste', 'Hazardous Waste'
];

const QUALITY_GRADES = ['All', 'Grade A', 'Grade B', 'Grade C', 'Grade D', 'Grade E'];
const CITIES = ['All', 'Bangalore', 'Mysuru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'];

export default function MarketplacePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [similarityModalOpen, setSimilarityModalOpen] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedGrade, setSelectedGrade] = useState(searchParams.get('quality_grade') || 'All');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [sortBy, setSortBy] = useState('latest');

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await api.getListings({
        q: searchQuery || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        quality_grade: selectedGrade !== 'All' ? selectedGrade : undefined,
        city: selectedCity !== 'All' ? selectedCity : undefined,
        max_price: maxPrice ? parseFloat(maxPrice) : undefined,
        sort_by: sortBy
      });
      setListings(data);
    } catch (err) {
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, selectedGrade, selectedCity, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedGrade('All');
    setSelectedCity('All');
    setMaxPrice('');
    setSortBy('latest');
    setTimeout(() => {
      fetchListings();
    }, 50);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Search and AI Visual Search Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Circular Construction Second-Market
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse AI-verified recovered masonry, metals, timber, stone, and recycled aggregates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Image Search Button (Spec Section 13) */}
          <button
            onClick={() => setSimilarityModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:brightness-110 transition-all flex items-center gap-2 shadow-md shadow-cyan-500/20"
          >
            <Camera className="w-4 h-4" />
            AI Image Match
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800/90 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Try searching "red bricks", "used steel rods", "teak doors", "Mysuru"...'
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-800/60 text-xs">
          {/* Category */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Quality Grade */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Quality Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full py-2 px-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {QUALITY_GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Location</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full py-2 px-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Max Price (₹)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={fetchListings}
              placeholder="e.g. 25000"
              className="w-full py-2 px-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="latest">Latest Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="quality">Highest Quality Score</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
          <span>Found <strong className="text-white font-mono">{listings.length}</strong> available material lots</span>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-24 space-y-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-sm text-slate-400">Loading second-market materials...</div>
        </div>
      ) : listings.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 text-slate-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Matching Materials Found</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search keywords, increasing price thresholds, or switching location filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      )}

      {/* Visual Similarity Modal */}
      <ImageSimilarityModal
        isOpen={similarityModalOpen}
        onClose={() => setSimilarityModalOpen(false)}
      />
    </div>
  );
}
