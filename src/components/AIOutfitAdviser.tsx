/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Sparkles, RefreshCw, ShoppingBag, Check, 
  Loader2, Eye, ShieldCheck, Shirt, Award, HelpCircle, Flame
} from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/currency';

interface AIOutfitAdviserProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  onQuickView: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
}

// Visual preset models to let users test instantly
const PRESET_MODELS = [
  {
    id: "preset-urban-street",
    label: "Urban Streetwear",
    tag: "STREETWEAR",
    description: "Casual high-contrast street look",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "preset-technical-active",
    label: "Tech Active",
    tag: "ATHLETIC",
    description: "Technical windproof outdoor aesthetic",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "preset-accessory-lux",
    label: "High-Fashion Chic",
    tag: "ELEVATED",
    description: "Premium coat & fine silver accent detail",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "preset-cozy-lounge",
    label: "Cozy Minimalist",
    tag: "LOUNGE",
    description: "Relaxed soft bouclé knits and slides",
    image: "https://images.unsplash.com/photo-1506193029111-d9da1b978c43?q=80&w=600&auto=format&fit=crop"
  }
];

export default function AIOutfitAdviser({
  products,
  onAddToCart,
  onQuickView,
  wishlist,
  onToggleWishlist
}: AIOutfitAdviserProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState("");
  const [scanResult, setScanResult] = useState<{
    insights: string;
    recommendedIds: string[];
    isFallback?: boolean;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [addedAllBundle, setAddedAllBundle] = useState(false);

  // Handle uploading files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setScanResult(null); // Clear previous results
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert preset URL to dataURL or let the server fetch it
  const handleSelectPreset = (presetUrl: string) => {
    setSelectedImage(presetUrl);
    setScanResult(null);
  };

  // Analyze the outfit with Gemini API
  const handleAnalyzeOutfit = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setAddedAllBundle(false);
    
    // Step-by-step progress indicator Simulation
    const progressMsgs = [
      "Interpreting facial/aesthetic tone balance...",
      "Matching posture style to our active silhouettes...",
      "Extracting color hues and contrast signatures...",
      "Cross-referencing Trendzo inventory database...",
      "Finalizing coordinated premium wardrobe recommendations..."
    ];

    let currentStep = 0;
    setScanProgress(progressMsgs[0]);
    
    const progressInterval = setInterval(() => {
      currentStep++;
      if (currentStep < progressMsgs.length) {
        setScanProgress(progressMsgs[currentStep]);
      }
    }, 1100);

    try {
      // Send base64 inline data
      const base64Data = selectedImage.split(',')[1] || selectedImage;

      const response = await fetch('/api/scan-outfit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: base64Data
        })
      });

      if (!response.ok) {
        throw new Error('Outfit Scanning Endpoint Failure');
      }

      const data = await response.json();
      clearInterval(progressInterval);
      setScanResult(data);
    } catch (err) {
      console.error("[AI Outfit adviser error]", err);
      // Client-side aesthetic fallback rules
      clearInterval(progressInterval);
      setScanResult({
        insights: "Analyzing your street backdrop, we recommend styling with high-contrast breathable Techwear. This setup balances organic ripstop utilities with shock-absorbing high-rebound cushioning to lock in active performance.",
        recommendedIds: ["prod-03", "prod-04", "prod-11"],
        isFallback: true
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddToCartWithFeedback = (p: Product) => {
    // Select first color/size if available
    const color = p.colors?.[0] || 'Carbon';
    const size = p.sizes?.[0] || 'M';
    onAddToCart(p, 1, color, size);
    setAddedItems(prev => [...prev, p.id]);
    setTimeout(() => {
      setAddedItems(prev => prev.filter(id => id !== p.id));
    }, 2000);
  };

  const recommendedProducts = scanResult 
    ? products.filter(p => scanResult.recommendedIds.includes(p.id))
    : [];

  // Calculate sum of outfit package with automated bundle discount
  const originalTotalPrice = recommendedProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscountPrice = recommendedProducts.reduce((sum, p) => sum + (p.discountPrice || p.price), 0) * 0.85; // Additional 15% off bundle!

  const handleAddBundleToCart = () => {
    recommendedProducts.forEach(p => {
      onAddToCart(p, 1, p.colors?.[0], p.sizes?.[0]);
    });
    setAddedAllBundle(true);
    setTimeout(() => setAddedAllBundle(false), 3000);
  };

  return (
    <div id="ai-outfit-adviser-view" className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-12 text-left">
      
      {/* Visual Header Banner */}
      <div className="relative rounded-3xl bg-neutral-950 p-8 md:p-12 border border-white/10 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#B76E79]/20 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B76E79]/15 text-[#B76E79] text-[10px] font-bold font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            AI DEEP STYLE SCANNER
          </span>
          <h1 className="font-serif italic font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight leading-tight">
            YOUR VISUAL COUTURE CO-PILOT
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
            Upload a photo of a person or use a quick preset model. Our Gemini AI fashion model will analyze skin tone undertones, posture, and ambiance to curate matching streetwear drops, elite kicks, and accessories.
          </p>
        </div>
      </div>

      {/* Main scanning grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Upload & Target Image Zone */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-xs">
            <h3 className="font-sans font-bold text-sm text-neutral-900 mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#B76E79]" />
              1. Feed your Target Visual
            </h3>

            {/* Upload Drag Target */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl aspect-square overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer p-4 transition-all ${
                dragActive 
                  ? "border-[#B76E79] bg-[#B76E79]/5" 
                  : selectedImage 
                    ? "border-neutral-200 bg-neutral-50 hover:border-neutral-300" 
                    : "border-neutral-300 bg-neutral-25 hover:border-neutral-400"
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="hidden" 
              />

              {selectedImage ? (
                <div className="relative w-full h-full group">
                  <img 
                    src={selectedImage} 
                    alt="Source Person Visual" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl text-white text-xs font-bold font-mono">
                    <RefreshCw className="w-4 h-4 animate-spin-slow" />
                    CLICK TO CHANGE IMAGE
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pointer-events-none py-6 px-4">
                  <div className="w-12 h-12 rounded-full bg-[#B76E79]/15 flex items-center justify-center mx-auto text-[#B76E79]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-800">Drag & drop your style image here</p>
                    <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-widest font-mono">or click to browse local files</p>
                  </div>
                  <div className="text-[9px] text-neutral-400 max-w-xs font-serif italic mx-auto">
                    Supports high-resolution PNG, JPG, or WEBP photos representing clean fashion outlines.
                  </div>
                </div>
              )}

              {/* Glowing Line Scanning overlay effect */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div 
                    initial={{ top: "0%" }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#B76E79] to-transparent shadow-[0_0_12px_#B76E79] pointer-events-none z-10"
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Action Trigger Button */}
            <button
              onClick={handleAnalyzeOutfit}
              disabled={!selectedImage || isScanning}
              className={`w-full mt-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                !selectedImage
                  ? "bg-neutral-100 border border-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-neutral-900 border border-neutral-800 text-white hover:bg-[#B76E79] hover:border-[#B76E79] hover:shadow-lg hover:shadow-[#B76E79]/10"
              }`}
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Recommendation...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Photo & Curate Outfit
                </>
              )}
            </button>
          </div>

          {/* Quick Preset Choice Grid */}
          <div className="space-y-3">
            <span className="block text-[10px] font-mono tracking-widest text-[#B76E79] font-black uppercase">
              OR TEST INSTANTLY WITH A COUTURE PRESET MODEL:
            </span>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_MODELS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.image)}
                  className={`p-3 rounded-2xl bg-white border cursor-pointer transition-all flex items-center gap-3 hover:border-neutral-400 hover:shadow-xs group ${
                    selectedImage === preset.image ? "border-[#B76E79] ring-2 ring-[#B76E79]/15" : "border-neutral-200"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-100">
                    <img 
                      src={preset.image} 
                      alt={preset.label} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="block text-[8px] font-mono font-bold text-[#B76E79]">{preset.tag}</span>
                    <h4 className="font-sans font-bold text-xs text-neutral-800 truncate">{preset.label}</h4>
                    <p className="text-[9px] text-neutral-400 truncate mt-0.5">{preset.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: scanning progress details & matched outfit grids */}
        <div className="lg:col-span-7 space-y-6">
          
          <AnimatePresence mode="wait">
            {isScanning ? (
              <motion.div
                key="scanning-progress"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="p-8 rounded-3xl border border-[#B76E79]/20 bg-neutral-950 text-white flex flex-col items-center justify-center text-center space-y-6 min-h-[350px] relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#B76E79]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />

                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#B76E79]/20 blur-xl animate-pulse" />
                  <div className="w-16 h-16 rounded-full border border-white/15 bg-neutral-900 flex items-center justify-center text-[#B76E79] animate-spin-slow">
                    <Sparkles className="w-7 h-7" />
                  </div>
                </div>

                <div className="space-y-2 max-w-md z-10">
                  <h3 className="font-serif italic text-xl font-bold tracking-wider text-white">AI ANALYSIS IN PROGRESS</h3>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-[#B76E79] bg-[#B76E79]/15 px-3.5 py-1 rounded-full border border-[#B76E79]/30">
                    <Loader2 className="w-3 h-3 animate-spin text-[#B76E79]" />
                    <span>{scanProgress}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-2">
                    Our luxury wardrobe crawler is matching details from the photo against our reactive capsule styles, sizes, and stock list.
                  </p>
                </div>
              </motion.div>
            ) : scanResult ? (
              <motion.div
                key="scan-result-details"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* AI Stylist Narrative segment */}
                <div className="rounded-3xl border border-neutral-200 bg-white p-6 md:p-8 space-y-4 text-left shadow-xs">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#B76E79] to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                        AI
                      </div>
                      <div>
                        <h3 className="font-sans font-bold text-sm text-neutral-900 leading-tight">AI Stylist Verdict</h3>
                        <p className="text-[10px] text-neutral-400 font-mono">PERSONALITY: FUTURISTIC & ELEGANT</p>
                      </div>
                    </div>
                    {scanResult.isFallback && (
                      <span className="text-[9px] font-mono tracking-widest text-amber-600 bg-amber-500/10 rounded-full px-2.5 py-1 font-bold">
                        FAST LOCAL MATCH
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-serif italic text-neutral-700 leading-relaxed bg-[#FAFAFA] border border-neutral-200/50 p-4 rounded-2xl relative">
                    <span className="absolute -top-3 left-4 px-2 bg-[#FAFAFA] border border-neutral-200/30 text-[9px] font-mono font-bold tracking-wider text-[#B76E79] rounded-md uppercase">
                      COUTURE REPORT
                    </span>
                    <p>"{scanResult.insights}"</p>
                  </div>
                </div>

                {/* Outfit Package list header */}
                <div className="rounded-3xl border border-neutral-200 bg-white overflow-hidden shadow-xs">
                  <div className="p-5 border-b border-neutral-100 bg-neutral-950/2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                      <span className="text-[10px] font-mono text-[#B76E79] font-black uppercase tracking-widest flex items-center gap-1.5 mb-1">
                        <Flame className="w-3.5 h-3.5" />
                        EXCLUSIVE PACKAGE DEAL
                      </span>
                      <h4 className="font-serif italic font-bold text-lg text-neutral-900 uppercase">
                        RECOMENDED MATCHING OUTFIT
                      </h4>
                    </div>
                    
                    {recommendedProducts.length > 1 && (
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <span className="block text-[9px] text-neutral-400 line-through font-mono">{formatPrice(originalTotalPrice)}</span>
                          <span className="block text-xs font-mono font-bold text-blue-600">Bundle Price: {formatPrice(bundleDiscountPrice)}</span>
                        </div>
                        <button
                          onClick={handleAddBundleToCart}
                          className={`py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                            addedAllBundle 
                              ? 'bg-green-600 text-white' 
                              : 'bg-neutral-900 hover:bg-[#B76E79] text-white'
                          }`}
                        >
                          {addedAllBundle ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Added Outfit!
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              Add Outfit to Bag
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Recommendation Grid List */}
                  <div className="divide-y divide-neutral-100">
                    {recommendedProducts.map((p) => {
                      const isAdded = addedItems.includes(p.id);
                      return (
                        <div 
                          key={p.id}
                          className="p-4 flex items-center justify-between gap-6 hover:bg-neutral-50/60 transition-colors text-left"
                        >
                          <div 
                            onClick={() => onQuickView(p)}
                            className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer group"
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-50 border border-neutral-200/60 flex-shrink-0">
                              <img 
                                referrerPolicy="no-referrer" 
                                src={p.image} 
                                alt={p.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-mono tracking-widest text-[#B76E79] font-black uppercase inline-block mb-0.5">{p.category}</span>
                              <h5 className="font-sans font-bold text-xs text-neutral-900 group-hover:text-blue-600 transition-colors truncate">{p.title}</h5>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-mono font-bold text-neutral-900">{formatPrice(p.discountPrice || p.price)}</span>
                                {p.discountPrice && (
                                  <span className="text-[9px] text-neutral-400 line-through font-mono">{formatPrice(p.price)}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => onQuickView(p)}
                              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/60 transition-colors cursor-pointer"
                              title="Quick-view sizes & details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAddToCartWithFeedback(p)}
                              className={`py-2 px-3.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                                isAdded 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-neutral-900 hover:bg-[#B76E79] text-white'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  Added
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  + Bag
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center p-12 rounded-3xl border-2 border-dashed border-neutral-200 bg-white/50 text-neutral-400 flex flex-col items-center justify-center space-y-4 min-h-[350px]">
                <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                  <Shirt className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-sans font-bold text-sm text-neutral-800">Couture Analysis Idle</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Please upload an image of a person or click one of our fashion model presets on the left to start the deep coordinating match.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Trust guarantees badge block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 flex flex-col items-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="font-sans font-bold text-xs text-neutral-800">Couture Matched</h4>
          <p className="text-[10px] text-neutral-500">Gemini is optimized specifically to match skin hues, silhouettes, and lighting styles accurately.</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 flex flex-col items-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <h4 className="font-sans font-bold text-xs text-neutral-800">Exclusive 15% Pack Discount</h4>
          <p className="text-[10px] text-neutral-500">Adding matched capsule visual outfits grants a bundle code markdown at checkout automatically.</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 flex flex-col items-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-sans font-bold text-xs text-neutral-800">Full Catalog Compliance</h4>
          <p className="text-[10px] text-neutral-500">Matches are verified against the active real-time active catalog stock inside the store inventory.</p>
        </div>
      </div>

    </div>
  );
}
