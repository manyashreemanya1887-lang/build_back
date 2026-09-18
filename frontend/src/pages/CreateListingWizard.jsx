import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Upload, Sparkles, Check, ArrowRight, ArrowLeft, Shield,
  Layers, MapPin, DollarSign, AlertCircle, CheckCircle2,
  Calendar, RotateCcw, Building2, HelpCircle, Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MATERIAL_OPTIONS = [
  'Red Bricks', 'Concrete Rubble', 'Cement Blocks', 'TMT Steel Rods', 'Structural Wood / Timber',
  'Ceramic Floor Tiles', 'Window Glass', 'PVC Pipes', 'Galvanized Iron (GI) Pipes', 'Flush Doors',
  'Aluminum Windows', 'Electrical Wiring & Panels', 'Corrugated Roofing Sheets', 'Natural Stone Slabs', 'Construction Sand',
  'Marble Slabs', 'Granite Slabs', 'Sanitaryware Ceramics', 'Mixed Demolition Waste', 'Asbestos / Hazardous Sheeting'
];

const UNIT_OPTIONS = ['Pieces', 'Tonnes', 'kg', 'sq.ft', 'cubic meter'];
const USAGE_OPTIONS = ['Residential', 'Commercial', 'Industrial', 'Infrastructure'];
const AVAILABILITY_OPTIONS = ['Immediate', 'Within 7 days', 'Custom'];

export default function CreateListingWizard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [error, setError] = useState(null);

  // Form & AI prediction states
  const [material, setMaterial] = useState('Bricks');
  const [aiConfidence, setAiConfidence] = useState(0.94);
  const [isLowConfidence, setIsLowConfidence] = useState(false);
  const [alternatives, setAlternatives] = useState([]);
  const [userConfirmedMaterial, setUserConfirmedMaterial] = useState(true);

  // Quality assessment state
  const [qualityGrade, setQualityGrade] = useState('Grade B');
  const [qualityScore, setQualityScore] = useState(78);
  const [condition, setCondition] = useState('Good');
  const [recommendedUses, setRecommendedUses] = useState([]);
  const [recyclability, setRecyclability] = useState('Directly Reusable');
  const [damagePercentage, setDamagePercentage] = useState(12);
  const [ageYears, setAgeYears] = useState(3);
  const [originalUsage, setOriginalUsage] = useState('Residential');

  // Quantity state
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState(2000);
  const [unit, setUnit] = useState('Pieces');
  const [description, setDescription] = useState('');

  // Pricing state
  const [aiEstimatedPrice, setAiEstimatedPrice] = useState(18000);
  const [priceMin, setPriceMin] = useState(16000);
  const [priceMax, setPriceMax] = useState(20000);
  const [pricePerUnit, setPricePerUnit] = useState(9);
  const [priceConfidence, setPriceConfidence] = useState(0.84);
  const [sellerPrice, setSellerPrice] = useState(18000);
  const [pricingExplanation, setPricingExplanation] = useState('');

  // Location state
  const [city, setCity] = useState(user?.city || 'Mysuru');
  const [state, setState] = useState(user?.state || 'Karnataka');
  const [pincode, setPincode] = useState(user?.pincode || '570001');
  const [availability, setAvailability] = useState('Immediate');

  const [publishing, setPublishing] = useState(false);
  const fileInputRef = useRef(null);

  // 1. Handle Image Selection & AI Material Prediction
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
    setAnalyzingImage(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const pred = await api.predictMaterial(formData);
      setMaterial(pred.material);
      setAiConfidence(pred.confidence);
      setIsLowConfidence(pred.is_low_confidence);
      setAlternatives(pred.alternatives || []);
      setUnit(pred.default_unit || 'Pieces');
      setTitle(`Reclaimed ${pred.material} Batch`);

      // Trigger automatic quality assessment with initial defaults
      const qualityRes = await api.assessQuality({
        material: pred.material,
        age_years: 2.0,
        damage_percentage: 10.0,
        original_usage: 'Residential'
      });
      setQualityGrade(qualityRes.quality_grade);
      setQualityScore(qualityRes.quality_score);
      setCondition(qualityRes.condition);
      setRecommendedUses(qualityRes.recommended_uses);
      setRecyclability(qualityRes.recyclability);

      // Advance to Step 2
      setStep(2);
    } catch (err) {
      setError(err.message || 'Error running AI material classifier.');
    } finally {
      setAnalyzingImage(false);
    }
  };

  // Re-run quality assessment when parameters change
  const handleAssessQuality = async () => {
    try {
      const res = await api.assessQuality({
        material,
        age_years: parseFloat(ageYears) || 1.0,
        damage_percentage: parseFloat(damagePercentage) || 5.0,
        original_usage: originalUsage
      });
      setQualityGrade(res.quality_grade);
      setQualityScore(res.quality_score);
      setCondition(res.condition);
      setRecommendedUses(res.recommended_uses);
      setRecyclability(res.recyclability);
    } catch (err) {
      console.error(err);
    }
  };

  // Re-run price prediction
  const handleEstimatePrice = async () => {
    try {
      const res = await api.predictPrice({
        material_type: material,
        quality_grade: qualityGrade,
        quantity: parseFloat(quantity) || 100,
        unit: unit,
        age_years: parseFloat(ageYears) || 2.0,
        damage_percentage: parseFloat(damagePercentage) || 10.0,
        location: city,
        original_usage: originalUsage,
        transport_distance: 15.0
      });
      setAiEstimatedPrice(res.estimated_price);
      setPriceMin(res.price_min);
      setPriceMax(res.price_max);
      setPricePerUnit(res.price_per_unit);
      setPriceConfidence(res.confidence);
      setSellerPrice(res.estimated_price);
      setPricingExplanation(res.explanation);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublish = async () => {
    if (!user) {
      navigate('/auth?redirect=/create-listing');
      return;
    }

    setPublishing(true);
    try {
      const listingData = {
        title: title || `Reclaimed ${material}`,
        material_name: material,
        category: material in ['Steel', 'Metal pipes'] ? 'Metals' : material in ['Wood', 'Doors', 'Windows'] ? 'Timber' : 'Masonry',
        description: description || `High quality recovered ${material} suitable for circular secondary reuse.`,
        image_url: imagePreview || "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800",
        predicted_material: material,
        ai_confidence: aiConfidence,
        quality_grade: qualityGrade,
        quality_score: qualityScore,
        quantity: parseFloat(quantity),
        unit: unit,
        age: parseFloat(ageYears),
        damage_percentage: parseFloat(damagePercentage),
        price: parseFloat(sellerPrice),
        ai_estimated_price: parseFloat(aiEstimatedPrice),
        city: city,
        state: state,
        pincode: pincode,
        original_usage: originalUsage,
        availability: availability
      };

      const res = await api.createListing(listingData);

      // Record ML Feedback Loop entry (Spec Section 26)
      await api.submitFeedback({
        listing_id: res.id,
        image_url: res.image_url,
        predicted_material: material,
        corrected_material: material,
        predicted_quality: qualityGrade,
        corrected_quality: qualityGrade,
        predicted_price: aiEstimatedPrice,
        final_price: sellerPrice,
        confidence: aiConfidence,
        is_confirmed: userConfirmedMaterial
      });

      navigate(`/listings/${res.id}`);
    } catch (err) {
      setError(err.message || 'Failed to publish listing.');
    } finally {
      setPublishing(false);
    }
  };

  const stepTitles = [
    'Upload Image',
    'AI Detection',
    'Verify Material',
    'Quality Diagnosis',
    'Quantity & Specs',
    'AI Price Valuation',
    'Location & Logistics',
    'Preview Listing',
    'Publish'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> 9-Step AI Circular Appraisal Wizard
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          List Recovered Construction Material
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Step {step} of 9: <span className="text-white font-semibold">{stepTitles[step - 1]}</span>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
          style={{ width: `${(step / 9) * 100}%` }}
        />
      </div>

      {/* Wizard Card Body */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 min-h-[420px] flex flex-col justify-between shadow-xl">
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Upload Image */}
        {step === 1 && (
          <div className="space-y-6 text-center py-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500/80 rounded-3xl p-10 cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all max-w-xl mx-auto space-y-4"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Upload Material Photo</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Drag and drop site photo or click to browse (JPG, PNG, WEBP)
                </p>
              </div>
              <div className="text-[11px] text-slate-500">
                Identifies 20 materials: Bricks, Concrete, Steel, Wood, Tiles, Stones, Pipes, Doors, etc.
              </div>
            </div>

            {analyzingImage && (
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-mono">
                <Loader2 className="w-4 h-4 animate-spin" />
                MobileNetV2 neural feature extraction in progress...
              </div>
            )}
          </div>
        )}

        {/* STEP 2: AI Detection & Feedback Display */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img src={imagePreview} alt="Uploaded" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Computer Vision Prediction
                  </span>
                  <div className="text-2xl font-black text-white">{material}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      Confidence: {Math.round(aiConfidence * 100)}%
                    </span>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-400 font-mono">
                      MobileNetV2
                    </span>
                  </div>
                </div>

                {isLowConfidence && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>AI confidence is low. Please verify the material category manually in Step 3.</span>
                  </div>
                )}

                {alternatives.length > 0 && (
                  <div className="text-xs text-slate-400 space-y-1">
                    <span className="text-slate-500 font-medium">Alternative Predictions:</span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {alternatives.map((alt, i) => (
                        <span key={i} className="px-2 py-1 rounded-md bg-slate-800 text-[11px] text-slate-300">
                          {alt.material} ({Math.round(alt.confidence * 100)}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Verify Material */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Verify Material Category</h3>
              <p className="text-xs text-slate-400">
                Confirm the AI classification or correct it manually to feed our continuous retraining pipeline.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Select Confirmed Material:
                </label>
                <select
                  value={material}
                  onChange={(e) => {
                    setMaterial(e.target.value);
                    setUserConfirmedMaterial(false);
                    setTitle(`Reclaimed ${e.target.value} Lot`);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  {MATERIAL_OPTIONS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <div className="text-[11px] text-slate-400 pt-2">
                  Selected Category: <strong className="text-white">{material}</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-slate-300 space-y-2">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Active Feedback Loop
                </div>
                <p className="leading-relaxed">
                  Your manual validation trains our continuous machine learning pipeline, maintaining high precision across construction sites in Karnataka and nationwide.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Quality Assessment */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Condition & Quality Scoring</h3>
              <p className="text-xs text-slate-400">
                Estimate age, surface wear, and prior operational stress to compute condition grades.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Estimated Age (Years)</label>
                <input
                  type="number"
                  value={ageYears}
                  onChange={(e) => setAgeYears(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Surface Wear / Damage (%)</label>
                <input
                  type="number"
                  value={damagePercentage}
                  onChange={(e) => setDamagePercentage(e.target.value)}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Original Usage</label>
                <select
                  value={originalUsage}
                  onChange={(e) => setOriginalUsage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  {USAGE_OPTIONS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAssessQuality}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Re-calculate Quality Diagnostics
            </button>

            {/* Quality Result Banner */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Assigned Grade:</span>
                <strong className="text-emerald-400 text-base">{qualityGrade} ({condition})</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Quality Score:</span>
                <strong className="text-white text-base font-mono">{qualityScore} / 100</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Recyclability:</span>
                <strong className="text-cyan-400 text-sm">{recyclability}</strong>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Enter Quantity & Units */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Enter Quantity & Listing Title</h3>
              <p className="text-xs text-slate-400">
                Specify available batch size and detailed notes for prospective buyers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Listing Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Reclaimed Heritage Red Bricks"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Description (Optional)</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details on source building, mortar cleanliness, stacking, etc."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* STEP 6: AI Price Valuation */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">AI Second-Market Valuation</h3>
              <p className="text-xs text-slate-400">
                Estimated by Gradient Boosting Regression model trained on regional second-hand building materials.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
                <div className="pt-2 sm:pt-0">
                  <div className="text-xs text-slate-400">AI Estimated Price</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                    ₹{aiEstimatedPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">₹{pricePerUnit} / {unit}</div>
                </div>

                <div className="pt-4 sm:pt-0 sm:pl-4">
                  <div className="text-xs text-slate-400">Recommended Range</div>
                  <div className="text-lg font-bold text-white font-mono mt-1">
                    ₹{priceMin.toLocaleString('en-IN')} – ₹{priceMax.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">±12% bounds</div>
                </div>

                <div className="pt-4 sm:pt-0 sm:pl-4">
                  <div className="text-xs text-slate-400">Regression Confidence</div>
                  <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
                    {Math.round(priceConfidence * 100)}%
                  </div>
                  <div className="text-[11px] text-slate-500">Regional R² = 0.935</div>
                </div>
              </div>

              {pricingExplanation && (
                <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
                  <strong className="text-slate-300">Appraisal Factors:</strong> {pricingExplanation}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Expected Listing Price (₹ INR):
              </label>
              <input
                type="number"
                value={sellerPrice}
                onChange={(e) => setSellerPrice(e.target.value)}
                className="w-full max-w-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-base focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                You have full control to set your own price; the AI rate is an advisory benchmark.
              </span>
            </div>
          </div>
        )}

        {/* STEP 7: Location & Logistics */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Location & Availability</h3>
              <p className="text-xs text-slate-400">
                Help local builders, architects, and recyclers plan pickup and logistics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">PIN Code</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Material Availability</label>
              <div className="flex gap-3">
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAvailability(opt)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      availability === opt
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: Preview Listing */}
        {step === 8 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Review & Preview Listing</h3>
              <p className="text-xs text-slate-400">
                Confirm your listing details before publishing to the live marketplace.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2 text-xs">
                <div className="text-emerald-400 font-semibold">{qualityGrade} • {condition}</div>
                <h4 className="text-base font-bold text-white">{title}</h4>
                <div className="text-slate-300">
                  Quantity: <strong className="text-white">{quantity} {unit}</strong>
                </div>
                <div className="text-slate-300">
                  Listed Price: <strong className="text-emerald-400 text-sm font-mono">₹{sellerPrice.toLocaleString('en-IN')}</strong>
                </div>
                <div className="text-slate-300">
                  Location: <strong>{city}, {state}</strong> ({availability})
                </div>
                <div className="text-slate-400 pt-1">
                  AI Confidence: {Math.round(aiConfidence * 100)}% • Quality Score: {qualityScore}/100
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: Publish */}
        {step === 9 && (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white">Ready to Publish</h3>
              <p className="text-xs text-slate-400">
                Clicking Publish will register this lot on the REBUILD AI marketplace and record your appraisal metrics into the continuous model training loop.
              </p>
            </div>

            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing & Updating AI Weights...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Publish Listing Now
                </>
              )}
            </button>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 9 && step > 1 && (
            <button
              type="button"
              onClick={() => {
                if (step === 5) handleEstimatePrice();
                setStep(step + 1);
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              Continue to {stepTitles[step]} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
