import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, Eye, Heart, Check, Trash2, ArrowRight, Layers, Award, Percent } from 'lucide-react';
import { Product } from '../types';

interface RunwayStudioProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: string[];
}

export default function RunwayStudio({
  products,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  wishlist
}: RunwayStudioProps) {
  // Category selections states
  const [selectedClothes, setSelectedClothes] = useState<Product | null>(null);
  const [selectedShoes, setSelectedShoes] = useState<Product | null>(null);
  const [selectedSlippers, setSelectedSlippers] = useState<Product | null>(null);
  const [selectedJewelry, setSelectedJewelry] = useState<Product | null>(null);
  
  // Custom states
  const [synergyIndex, setSynergyIndex] = useState(0);
  const [addedBundle, setAddedBundle] = useState(false);

  // Pre-filter catalog matches
  const clothesList = products.filter(p => p.category === 'Clothes').slice(0, 8);
  const shoesList = products.filter(p => p.category === 'Shoes').slice(0, 8);
  const slippersList = products.filter(p => p.category === 'Slippers').slice(0, 8);
  const jewelryList = products.filter(p => p.category === 'Jewelry').slice(0, 8);

  // Auto select default top-picked pieces on mount
  useEffect(() => {
    if (products.length > 0) {
      if (!selectedClothes) setSelectedClothes(clothesList[0] || null);
      if (!selectedShoes) setSelectedShoes(shoesList[0] || null);
      if (!selectedJewelry) setSelectedJewelry(jewelryList[0] || null);
    }
  }, [products]);

  // Compute live match synergy dynamics
  useEffect(() => {
    let itemsCount = 0;
    if (selectedClothes) itemsCount++;
    if (selectedShoes) itemsCount++;
    if (selectedSlippers) itemsCount++;
    if (selectedJewelry) itemsCount++;

    if (itemsCount === 0) {
      setSynergyIndex(0);
    } else if (itemsCount === 1) {
      setSynergyIndex(55);
    } else if (itemsCount === 2) {
      setSynergyIndex(78);
    } else if (itemsCount === 3) {
      setSynergyIndex(92);
    } else {
      setSynergyIndex(99); // Full perfect coordinate set
    }
  }, [selectedClothes, selectedShoes, selectedSlippers, selectedJewelry]);

  // Pricing calculations
  const calculateTotal = () => {
    let rawSum = 0;
    if (selectedClothes) rawSum += selectedClothes.discountPrice || selectedClothes.price;
    if (selectedShoes) rawSum += selectedShoes.discountPrice || selectedShoes.price;
    if (selectedSlippers) rawSum += selectedSlippers.discountPrice || selectedSlippers.price;
    if (selectedJewelry) rawSum += selectedJewelry.discountPrice || selectedJewelry.price;

    const discountAmount = rawSum * 0.15; // Auto 15% discount for coordinates sets
    const finalBundlePrice = rawSum - discountAmount;

    return {
      rawSum,
      discountAmount,
      finalBundlePrice
    };
  };

  const { rawSum, discountAmount, finalBundlePrice } = calculateTotal();

  // Unified basket integration
  const handleAdoptDesignBundle = () => {
    if (selectedClothes) onAddToCart(selectedClothes, 1, selectedClothes.colors?.[0], selectedClothes.sizes?.[0]);
    if (selectedShoes) onAddToCart(selectedShoes, 1, selectedShoes.colors?.[0], selectedShoes.sizes?.[0]);
    if (selectedSlippers) onAddToCart(selectedSlippers, 1, selectedSlippers.colors?.[0], selectedSlippers.sizes?.[0]);
    if (selectedJewelry) onAddToCart(selectedJewelry, 1, selectedJewelry.colors?.[0]);

    setAddedBundle(true);
    setTimeout(() => setAddedBundle(false), 3000);
  };

  const handleClearAll = () => {
    setSelectedClothes(null);
    setSelectedShoes(null);
    setSelectedSlippers(null);
    setSelectedJewelry(null);
  };

  return (
    <section id="runway-studio-segment" className="max-w-7xl mx-auto px-4 md:px-6 text-left space-y-6">
      
      {/* Header section with luxurious metadata style */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A880]/15 text-[#C5A880] text-[10px] font-bold font-mono tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-[#C5A880] animate-pulse" />
            3D RUNWAY EXPERIMENT
          </div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-neutral-900 uppercase tracking-tight mt-1.5">
            TRENDZOOO RUNWAY GENERATOR
          </h2>
          <p className="text-xs text-neutral-500 max-w-2xl mt-1 leading-relaxed">
            Drag, match, and orchestrate custom luxury sets. Unlock an <strong className="text-[#C5A880]">automatic 15% discount</strong> when coordinating two or more streetwear components.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleClearAll}
            className="text-[10px] font-mono text-neutral-500 hover:text-red-500 hover:border-red-500/30 font-bold uppercase border border-white/5 px-3.5 py-2 rounded-xl bg-white shadow-3xs cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset Stage
          </button>
        </div>
      </div>

      {/* Main Interactive Matrix Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Segment: Custom model mannequin & overlapping previews */}
        <div className="lg:col-span-4 rounded-3xl bg-neutral-900 p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between space-y-6 shadow-xl min-h-[450px]">
          {/* Futuristic geometric backdrop highlights */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-neutral-950 to-neutral-900 pointer-events-none" />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[#C5A880]/10 blur-3xl pointer-events-none" />
          
          {/* Mannequin Style HUD overlays */}
          <div className="relative z-10 flex justify-between items-center text-xs font-mono">
            <span className="text-[10px] uppercase font-bold text-neutral-400">COORDINATE MONITOR v1.4</span>
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              STABILIZED
            </div>
          </div>

          {/* Core Interactive Mannequin overlay representation */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center space-y-4 py-4 min-h-[250px]">
            {/* If no items selected */}
            {!selectedClothes && !selectedShoes && !selectedSlippers && !selectedJewelry && (
              <div className="text-center space-y-3">
                <Layers className="w-10 h-10 text-neutral-700 mx-auto animate-pulse" />
                <p className="text-neutral-500 text-xs max-w-xs leading-normal">
                  No layout pieces selected. Choose apparel below to project look models on target.
                </p>
              </div>
            )}

            {/* Overlapping items projection stack */}
            <div className="relative w-full max-w-[200px] aspect-[3/4] flex flex-col items-center justify-between">
              
              {/* Jewelry Slot */}
              <div className="h-[20%] w-full flex justify-center items-center">
                <AnimatePresence mode="wait">
                  {selectedJewelry ? (
                    <motion.div 
                      key={selectedJewelry.id}
                      initial={{ scale: 0.5, opacity: 0, y: -10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.5, opacity: 0, y: 10 }}
                      className="relative p-1 bg-neutral-800/80 rounded-full border border-brand-gold/30 flex items-center gap-1 max-w-[130px]"
                    >
                      <img referrerPolicy="no-referrer" src={selectedJewelry.image} className="w-7 h-7 rounded-full object-cover border border-white/10" />
                      <span className="text-[8px] font-mono font-black text-brand-gold truncate max-w-[80px] uppercase pr-2">{selectedJewelry.title}</span>
                    </motion.div>
                  ) : (
                    <div className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest border border-dashed border-neutral-800 rounded-full px-3 py-1">Jewelry Unselected</div>
                  )}
                </AnimatePresence>
              </div>

              {/* Clothes Slot (Torso) */}
              <div className="h-[50%] w-full flex justify-center items-center">
                <AnimatePresence mode="wait">
                  {selectedClothes ? (
                    <motion.div 
                      key={selectedClothes.id}
                      initial={{ scale: 0.8, opacity: 0, y: -20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.8, opacity: 0, y: 20 }}
                      className="group relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#C5A880]/50 shadow-lg shadow-[#C5A880]/5"
                    >
                      <img referrerPolicy="no-referrer" src={selectedClothes.image} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-neutral-950/80 py-1 text-[8px] font-mono text-white text-center truncate px-1">
                        {selectedClothes.title}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-neutral-800 flex items-center justify-center text-[8px] text-neutral-600 font-mono tracking-widest uppercase text-center p-2">
                      Clothes Unselected
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footwear Slot (Shoes/Slippers) */}
              <div className="h-[25%] w-full flex justify-center gap-3 items-center">
                <AnimatePresence mode="wait">
                  {selectedShoes ? (
                    <motion.div 
                      key={selectedShoes.id}
                      initial={{ scale: 0.6, opacity: 0, x: -15 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.6, opacity: 0, x: 15 }}
                      className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/20 shadow"
                    >
                      <img referrerPolicy="no-referrer" src={selectedShoes.image} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-neutral-950/80 text-[7px] font-mono text-white text-center truncate">
                        {selectedShoes.title}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl border border-dashed border-neutral-800 flex items-center justify-center text-[7px] text-neutral-600 font-mono text-center">
                      SHOES
                    </div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {selectedSlippers ? (
                    <motion.div 
                      key={selectedSlippers.id}
                      initial={{ scale: 0.6, opacity: 0, x: 15 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.6, opacity: 0, x: -15 }}
                      className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/20 shadow"
                    >
                      <img referrerPolicy="no-referrer" src={selectedSlippers.image} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-neutral-950/80 text-[7px] font-mono text-white text-center truncate">
                        {selectedSlippers.title}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl border border-dashed border-neutral-800 flex items-center justify-center text-[7px] text-neutral-600 font-mono text-center">
                      SLIDES
                    </div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* Integrated synergy rating analysis */}
          <div className="relative z-10 pt-4 border-t border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">COHESION HARMONY:</span>
              <span className={`font-bold ${synergyIndex > 90 ? 'text-emerald-400' : synergyIndex > 70 ? 'text-amber-400' : 'text-neutral-500'}`}>
                {synergyIndex}%
              </span>
            </div>
            
            <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${synergyIndex > 90 ? 'bg-emerald-500 animate-pulse' : synergyIndex > 70 ? 'bg-amber-400' : 'bg-neutral-600'}`}
                animate={{ width: `${synergyIndex}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Price block breakdown */}
            {rawSum > 0 && (
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-neutral-400">Original Total:</span>
                  <span className="text-neutral-300 line-through">${rawSum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[#C5A880] font-mono">
                  <span className="font-bold flex items-center gap-1">
                    <Percent className="w-3 h-3 text-[#C5A880]" /> 
                    Runway Discount (15%):
                  </span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end pt-1 border-t border-white/5 font-mono">
                  <span className="text-[10px] text-white font-bold uppercase">Coordinate Set Total:</span>
                  <span className="text-lg font-bold text-emerald-400">${finalBundlePrice.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleAdoptDesignBundle}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer tracking-wider uppercase transition-all flex items-center justify-center gap-2 mt-2 ${
                    addedBundle 
                      ? 'bg-green-600 text-white' 
                      : 'bg-[#C5A880] text-black hover:bg-[#d4bca1] shadow-lg shadow-[#C5A880]/10'
                  }`}
                >
                  {addedBundle ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      Set Added to Bag!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-black" />
                      Add Styled Set to Bag
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Segment: Selection options classified by clothing types */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          
          {/* Section: Clothes Choice Row */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-black">1. Choose Street Apparel Drop</span>
              {selectedClothes && (
                <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 rounded">
                  Connected
                </span>
              )}
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-thin">
              {clothesList.map((item) => {
                const isActive = selectedClothes?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedClothes(item)}
                    className={`flex-shrink-0 w-28 snap-start text-left p-2 rounded-2xl border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-neutral-900 border-[#C5A880] text-white shadow-md' 
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <img referrerPolicy="no-referrer" src={item.image} className="w-full h-16 object-cover rounded-xl" />
                    <span className="block text-[9px] font-bold mt-1.5 truncate">{item.title}</span>
                    <span className="block text-[8px] font-mono text-neutral-400 mt-0.5">${(item.discountPrice || item.price).toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Shoes Choice Row */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-black">2. Choose Feet Sneakers</span>
              {selectedShoes && (
                <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 rounded">
                  Connected
                </span>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-thin">
              {shoesList.map((item) => {
                const isActive = selectedShoes?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedShoes(item)}
                    className={`flex-shrink-0 w-28 snap-start text-left p-2 rounded-2xl border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-neutral-900 border-[#C5A880] text-white shadow-md' 
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <img referrerPolicy="no-referrer" src={item.image} className="w-full h-16 object-cover rounded-xl" />
                    <span className="block text-[9px] font-bold mt-1.5 truncate">{item.title}</span>
                    <span className="block text-[8px] font-mono text-neutral-400 mt-0.5">${(item.discountPrice || item.price).toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Slippers / Slides Row */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-black">3. Choose Women's Slippers & Slides</span>
              {selectedSlippers && (
                <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 rounded">
                  Connected
                </span>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-thin">
              {slippersList.map((item) => {
                const isActive = selectedSlippers?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSlippers(item)}
                    className={`flex-shrink-0 w-28 snap-start text-left p-2 rounded-2xl border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-neutral-900 border-[#C5A880] text-white shadow-md' 
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <img referrerPolicy="no-referrer" src={item.image} className="w-full h-16 object-cover rounded-xl" />
                    <span className="block text-[9px] font-bold mt-1.5 truncate">{item.title}</span>
                    <span className="block text-[8px] font-mono text-neutral-400 mt-0.5">${(item.discountPrice || item.price).toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Jewelry Choice Row */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-black">4. Choose Fine Ornaments & Smart Rings</span>
              {selectedJewelry && (
                <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 rounded">
                  Connected
                </span>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-thin">
              {jewelryList.map((item) => {
                const isActive = selectedJewelry?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedJewelry(item)}
                    className={`flex-shrink-0 w-28 snap-start text-left p-2 rounded-2xl border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-neutral-900 border-[#C5A880] text-white shadow-md' 
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <img referrerPolicy="no-referrer" src={item.image} className="w-full h-16 object-cover rounded-xl" />
                    <span className="block text-[9px] font-bold mt-1.5 truncate">{item.title}</span>
                    <span className="block text-[8px] font-mono text-neutral-400 mt-0.5">${(item.discountPrice || item.price).toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
