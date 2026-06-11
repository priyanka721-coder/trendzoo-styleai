/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Star, ShoppingCart, ShieldCheck, ArrowRight, Truck, RefreshCw, Layers } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { products } from '../data';
import { formatPrice } from '../utils/currency';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onSelectSimilarProduct: (similar: Product) => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onSelectSimilarProduct
}: ProductDetailsModalProps) {
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'styler'>('desc');

  // "Complete The Look" instant companion feedback states
  const [addedLookItemIds, setAddedLookItemIds] = useState<string[]>([]);

  const handleAddLookItemToCart = (p: Product) => {
    onAddToCart(p, 1, p.colors?.[0], p.sizes?.[0]);
    setAddedLookItemIds(prev => [...prev, p.id]);
    setTimeout(() => {
      setAddedLookItemIds(prev => prev.filter(id => id !== p.id));
    }, 2000);
  };

  const relatedSameCategoryItems = products
    .filter(p => p.category === product.category && p.id !== product.id && p.stock > 0)
    .slice(0, 4);

  const getSuitingOutfitProducts = (): Product[] => {
    if (!product) return [];
    const suits: Product[] = [];
    
    if (product.category === 'Clothes') {
      const shoes = products.filter(p => p.category === 'Shoes' && p.id !== product.id && p.stock > 0);
      const jewelry = products.filter(p => p.category === 'Jewelry' && p.id !== product.id && p.stock > 0);
      
      if (product.title.toLowerCase().includes('kimono') || product.title.toLowerCase().includes('jacket') || product.title.toLowerCase().includes('hoodie')) {
        const techShoes = shoes.find(s => s.title.toLowerCase().includes('neo') || s.title.toLowerCase().includes('phantom') || s.title.toLowerCase().includes('rebound'));
        const techJewelry = jewelry.find(j => j.title.toLowerCase().includes('titanium') || j.title.toLowerCase().includes('smart'));
        if (techShoes) suits.push(techShoes);
        if (techJewelry) suits.push(techJewelry);
      } else {
        if (shoes[0]) suits.push(shoes[0]);
        if (jewelry[0]) suits.push(jewelry[0]);
      }
    } else if (product.category === 'Shoes' || product.category === 'Slippers') {
      const clothes = products.filter(p => p.category === 'Clothes' && p.id !== product.id && p.stock > 0);
      const jewelry = products.filter(p => p.category === 'Jewelry' && p.id !== product.id && p.stock > 0);
      
      if (product.title.toLowerCase().includes('rebound') || product.title.toLowerCase().includes('vortex') || product.title.toLowerCase().includes('neon')) {
        const matchingCl = clothes.find(c => c.title.toLowerCase().includes('anorak') || c.title.toLowerCase().includes('cyber') || c.title.toLowerCase().includes('kimono'));
        const matchingJw = jewelry.find(j => j.title.toLowerCase().includes('titanium') || j.title.toLowerCase().includes('cyber'));
        if (matchingCl) suits.push(matchingCl);
        if (matchingJw) suits.push(matchingJw);
      } else {
        if (clothes[0]) suits.push(clothes[0]);
        if (jewelry[0]) suits.push(jewelry[0]);
      }
    } else if (product.category === 'Jewelry') {
      const clothes = products.filter(p => p.category === 'Clothes' && p.id !== product.id && p.stock > 0);
      const shoes = products.filter(p => p.category === 'Shoes' && p.id !== product.id && p.stock > 0);
      
      if (clothes[0]) suits.push(clothes[0]);
      if (shoes[0]) suits.push(shoes[0]);
    }
    
    if (suits.length < 2) {
      const fallback = products.filter(p => p.category !== product.category && p.id !== product.id && p.stock > 0).slice(0, 2);
      return fallback;
    }
    return suits;
  };

  const suitingOutfitProducts = getSuitingOutfitProducts();

  // Interactive Coordinates states for Style Mixer (unique feature)
  const [coordItem1, setCoordItem1] = useState<Product | null>(null);
  const [coordItem2, setCoordItem2] = useState<Product | null>(null);

  // Sync initial parameters when a new product is selected
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : '');
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
      setQuantity(1);
      setActiveTab('desc');
      setCoordItem1(null);
      setCoordItem2(null);
    }
  }, [product]);

  if (!product) return null;

  // Dynamic pair coordinate categories
  let pairCategory1: ProductCategory = 'Shoes';
  let pairCategory2: ProductCategory = 'Jewelry';
  if (product.category === 'Shoes') {
    pairCategory1 = 'Clothes';
    pairCategory2 = 'Jewelry';
  } else if (product.category === 'Slippers') {
    pairCategory1 = 'Clothes';
    pairCategory2 = 'Jewelry';
  } else if (product.category === 'Jewelry') {
    pairCategory1 = 'Clothes';
    pairCategory2 = 'Shoes';
  }

  // Candidates lists (guaranteed to match the new subsets)
  const coordCandidates1 = products.filter(p => p.category === pairCategory1).slice(0, 8);
  const coordCandidates2 = products.filter(p => p.category === pairCategory2).slice(0, 8);

  // Compute Synergy Attributes based on titles & features deterministically
  let cohesionPercentage = 75;
  let synergyName = "Single Coordinate Signature";
  if (coordItem1 && coordItem2) {
    cohesionPercentage = 98;
    synergyName = `Futuristic ${product.title.split(' ')[0]} Fusion`;
  } else if (coordItem1 || coordItem2) {
    cohesionPercentage = 87;
    synergyName = `${product.title.split(' ')[0]} Twin Set`;
  }

  const handleAddSynergySet = () => {
    // Add primary anchor
    onAddToCart(product, 1, selectedColor, selectedSize);
    // Add matching items
    if (coordItem1) {
      onAddToCart(coordItem1, 1, coordItem1.colors?.[0] || '', coordItem1.sizes?.[0] || '');
    }
    if (coordItem2) {
      onAddToCart(coordItem2, 1, coordItem2.colors?.[0] || '', coordItem2.sizes?.[0] || '');
    }
    onClose();
  };

  // Render specifications
  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Math variables
  const originalPrice = product.price;
  const currentPrice = product.discountPrice || product.price;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize);
    onClose();
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize);
    // Let the checkout state handle page routing
    onClose();
    // Emitted via location trigger in App
  };

  return (
    <AnimatePresence>
      <div 
        id={`product-details-modal-${product.id}`}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Backdrop overlay locking the scroll path */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm"
        />

        {/* Modal Outer Container */}
        <div className="flex min-h-full items-center justify-center p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-5xl rounded-3xl glass-panel md:backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden text-white mx-auto"
          >
            {/* Close button float */}
            <button
              id="details-close-btn"
              onClick={onClose}
              className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-neutral-900 border border-white/10 hover:border-white/35 active:scale-95 transition-all text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Core Modal Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 md:p-8">
              
              {/* LEFT: Image Gallery (Span 5) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Main Active Image Frame */}
                <div className="relative aspect-square rounded-2xl bg-neutral-900 border border-white/5 overflow-hidden">
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedImage}
                    alt={product.title}
                    className="w-full h-full object-cover transition-all"
                  />
                  
                  {/* Floating tags */}
                  {product.discountPrice && (
                    <span className="absolute top-4 left-4 text-[10px] font-mono font-bold px-2 py-0.5 roundedbg rounded-gradient bg-gradient-to-r from-red-500 to-purple-600 text-white shadow shadow-purple-500/10">
                      Offer Active
                    </span>
                  )}
                </div>

                {/* Grid of gallery thumbs */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`aspect-square rounded-xl overflow-hidden bg-neutral-900 border-2 transition-colors cursor-pointer ${
                          selectedImage === img ? 'border-blue-500' : 'border-white/5 hover:border-white/20'
                        }`}
                      >
                        <img referrerPolicy="no-referrer" src={img} alt="Thumbnail view" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT: Content segments (Span 7) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                
                {/* Upper Headings */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase bg-blue-500/10 px-2.5 py-1 rounded-md">
                      {product.category}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">ID: {product.id}</span>
                  </div>

                  <h1 className="font-display font-bold text-xl md:text-2xl text-white leading-tight">
                    {product.title}
                  </h1>

                  {/* Rating Stars and short count */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4- h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-700'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-white font-mono">{product.rating} / 5</span>
                    <span className="text-xs text-neutral-500">({product.reviewsCount} verified purchases)</span>
                  </div>
                </div>

                {/* Price Display Block */}
                <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-between gap-4">
                  <div>
                    <span className="block text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Current Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-blue-400 font-mono">
                        {formatPrice(currentPrice)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-sm text-neutral-500 line-through font-mono">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] text-neutral-500 uppercase tracking-widest font-mono text-right">Delivery</span>
                    <div className="text-xs text-neutral-300 font-medium text-right flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-purple-400" />
                      Free Local Shipping
                    </div>
                  </div>
                </div>

                {/* Dynamic Configuration Swatches (Colors & Sizes) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Colors block */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-neutral-400 block">Select Color: <span className="text-white font-medium">{selectedColor}</span></span>
                      <div className="flex gap-2">
                        {product.colors.map((col, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedColor(col)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              selectedColor === col 
                                ? 'bg-white text-black border-white' 
                                : 'bg-neutral-900 border-white/10 hover:border-white/30 text-white'
                            }`}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sizes block */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-neutral-400 block">Select Size: <span className="text-white font-medium">{selectedSize}</span></span>
                      <div className="flex gap-2">
                        {product.sizes.map((sz, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedSize(sz)}
                            className={`w-9 h-9 rounded-lg text-xs font-bold border flex items-center justify-center transition-all cursor-pointer ${
                              selectedSize === sz 
                                ? 'bg-white text-black border-white' 
                                : 'bg-neutral-900 border-white/10 hover:border-white/30 text-white'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tabs Panel: Description, specs, reviews, Style Mixer */}
                <div className="border-b border-white/5 flex gap-4 text-xs font-medium">
                  {(['desc', 'specs', 'reviews', 'styler'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 capitalize relative transition-colors cursor-pointer ${
                        activeTab === tab ? 'text-white font-bold' : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      {tab === 'desc' ? 'Description' : tab === 'specs' ? 'Specifications' : tab === 'reviews' ? 'Trust Checks' : 'Style Mixer 🌌'}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab content frames */}
                <div className="text-xs text-neutral-300 leading-relaxed min-h-[140px]">
                  {activeTab === 'desc' && (
                    <p>{product.longDescription}</p>
                  )}

                  {activeTab === 'specs' && (
                    <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-2">
                      {Object.entries(product.specs).map(([k, v]) => (
                        <div key={k} className="p-2 rounded bg-neutral-900/50 border border-white/2">
                          <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">{k}</div>
                          <div className="font-semibold text-white block mt-0.5 font-mono">{v}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-white/5">
                        <span className="font-bold text-white">Latest Verified Reviews</span>
                        <div className="flex items-center gap-1 text-amber-400 font-bold text-[10px]">
                          <Star className="w-3 h-3 fill-current" />
                          98% Positive Feedback
                        </div>
                      </div>
                      <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                        <div className="p-2 rounded bg-neutral-900/30">
                          <div className="flex justify-between items-center text-[10px] text-neutral-400 mb-1">
                            <span className="font-bold text-white">Alex M.</span>
                            <span>Verified buyer</span>
                          </div>
                          <p className="text-[11px] text-neutral-300">"Build quality is mindblowing. Perfectly blends aesthetics and high premium reliability. Absolutely love it."</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'styler' && (
                    <div className="space-y-3 bg-neutral-900/60 p-3 rounded-2xl border border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-blue-400 font-mono">Cybernetic Set Planner</span>
                        <span className="text-[8px] bg-purple-500/15 text-purple-300 font-mono font-bold px-1.5 py-0.5 rounded-sm uppercase">Style Mixer</span>
                      </div>
                      
                      <p className="text-[10px] text-neutral-400 leading-normal">
                        Select matching catalog items to assemble a coordinated style set. Bundle coordinates together to save an <strong>automatic 15% discount</strong> on checkout.
                      </p>

                      <div className="grid grid-cols-3 gap-2 my-1.5">
                        {/* Anchor item slot */}
                        <div className="p-1.5 rounded-xl bg-blue-50/5 border border-blue-500/20 text-center space-y-1">
                          <span className="block text-[8px] font-mono text-blue-400 uppercase font-bold">Base piece</span>
                          <img referrerPolicy="no-referrer" src={product.image} className="w-8 h-8 mx-auto object-cover rounded-lg" />
                          <span className="block text-[9px] font-bold text-white truncate">{product.title}</span>
                          <span className="block text-[8px] text-neutral-500 font-mono">{product.category}</span>
                        </div>

                        {/* Coordinate Option 1 (Pairing category) */}
                        <div className="p-1.5 rounded-xl bg-neutral-950/60 border border-white/5 text-center space-y-1 flex flex-col justify-between">
                          <span className="block text-[8px] font-mono text-purple-400 uppercase font-bold">Matching {pairCategory1}</span>
                          {coordItem1 ? (
                            <>
                              <img referrerPolicy="no-referrer" src={coordItem1.image} className="w-8 h-8 mx-auto object-cover rounded-lg" />
                              <span className="block text-[9px] font-bold text-white truncate">{coordItem1.title}</span>
                              <button 
                                onClick={() => setCoordItem1(null)}
                                className="text-[8px] text-red-400 hover:text-red-300 font-bold uppercase block mx-auto cursor-pointer"
                              >
                                Remove
                              </button>
                            </>
                          ) : (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-1.5 py-1">
                              <span className="text-[8px] text-neutral-500">Unselected</span>
                              <select 
                                onChange={(e) => {
                                  const found = products.find(p => p.id === e.target.value);
                                  if (found) setCoordItem1(found);
                                }}
                                className="text-[9px] bg-neutral-900 border border-white/10 rounded px-1 max-w-full outline-none text-neutral-300 h-5"
                              >
                                <option value="">Match...</option>
                                {coordCandidates1.map(c => (
                                  <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                        {/* Coordinate Option 2 (Pairing category) */}
                        <div className="p-1.5 rounded-xl bg-neutral-950/60 border border-white/5 text-center space-y-1 flex flex-col justify-between">
                          <span className="block text-[8px] font-mono text-purple-400 uppercase font-bold">Matching {pairCategory2}</span>
                          {coordItem2 ? (
                            <>
                              <img referrerPolicy="no-referrer" src={coordItem2.image} className="w-8 h-8 mx-auto object-cover rounded-lg" />
                              <span className="block text-[9px] font-bold text-white truncate">{coordItem2.title}</span>
                              <button 
                                onClick={() => setCoordItem2(null)}
                                className="text-[8px] text-red-400 hover:text-red-300 font-bold uppercase block mx-auto cursor-pointer"
                              >
                                Remove
                              </button>
                            </>
                          ) : (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-1.5 py-1">
                              <span className="text-[8px] text-neutral-500">Unselected</span>
                              <select 
                                onChange={(e) => {
                                  const found = products.find(p => p.id === e.target.value);
                                  if (found) setCoordItem2(found);
                                }}
                                className="text-[9px] bg-neutral-900 border border-white/10 rounded px-1 max-w-full outline-none text-neutral-300 h-5"
                              >
                                <option value="">Match...</option>
                                {coordCandidates2.map(c => (
                                  <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Synergy Feedback metrics */}
                      <div className="p-2 rounded-xl bg-white/2 border border-white/5 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-[8px] text-neutral-500 uppercase tracking-widest block font-mono">Synergy Signature</span>
                          <span className="font-bold text-white block mt-0.5 font-sans truncate max-w-[120px]">{synergyName}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] text-neutral-500 uppercase tracking-widest block font-mono">Cohesion Index</span>
                          <span className="font-mono font-bold text-emerald-400 block mt-0.5">{cohesionPercentage}% Match</span>
                        </div>
                      </div>

                      {/* Add complete synergy combo set to cart */}
                      {(coordItem1 || coordItem2) && (
                        <button
                          onClick={handleAddSynergySet}
                          className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-[10px] uppercase tracking-wider text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/10"
                        >
                          <Layers className="w-3.5 h-3.5 text-pink-300" />
                          Add Coordinated Set to Bag
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Add to cart / Buy now Controls */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
                  {/* Quantity Counter */}
                  <div className="flex items-center rounded-xl bg-neutral-900 border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock}
                      className="px-3.5 py-2 hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 font-mono font-bold text-sm min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={isOutOfStock}
                      className="px-3.5 py-2 hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add To Cart */}
                  <button
                    id="modal-addtochat-btn"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 flex items-center justify-center gap-2 font-bold py-2.5 px-6 rounded-xl border cursor-pointer transition-all ${
                      isOutOfStock
                        ? 'bg-neutral-800 border-neutral-700 text-neutral-500 cursor-not-allowed'
                        : 'glowing-button text-white border-transparent'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
                  </button>

                  {/* Wishlist toggle icon */}
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      isWishlisted
                        ? 'bg-purple-600/20 text-purple-400 border-purple-500/30'
                        : 'bg-neutral-900 border-white/10 hover:border-white/30 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Similar Products Row */}
                {similarProducts.length > 0 && (
                  <div className="pt-4 border-t border-white/5">
                    <span className="block text-[10px] text-neutral-500 uppercase tracking-widest font-mono mb-2">Similar Trendzz Drops</span>
                    <div className="grid grid-cols-3 gap-3">
                      {similarProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => onSelectSimilarProduct(p)}
                          className="flex items-center gap-2 p-1.5 rounded-xl bg-white/2 border border-white/2 hover:border-white/10 cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          <img referrerPolicy="no-referrer" src={p.image} alt={p.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="block text-[10px] font-bold text-white truncate">{p.title}</span>
                            <span className="block text-[9px] text-neutral-500 font-mono">{formatPrice(p.discountPrice || p.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* COMPLETE THE LOOK DUAL GRID (SAME CATEGORY & MATCHING OUTFIT) */}
            <div className="p-6 md:p-8 border-t border-white/10 bg-neutral-950/40 relative overflow-hidden space-y-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B76E79]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="text-left border-b border-white/5 pb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B76E79]/10 text-[#B76E79] text-[9px] font-bold font-mono tracking-widest uppercase">
                  <Layers className="w-3 h-3 text-[#B76E79]" />
                  COORDINATED HARMONY
                </span>
                <h3 className="font-serif italic font-bold text-lg md:text-xl text-white tracking-widest uppercase mt-1">
                  COMPLETE YOUR LOOK
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Curated choices designed to increase options in the same category or coordinate outfit combinations that suit this product's image perfectly.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* SECTION 1: SAME-CATEGORY RELATED ITEMS (3-4 related items from the same category) */}
                {relatedSameCategoryItems.length > 0 && (
                  <div className="lg:col-span-6 space-y-4 text-left">
                    <h4 className="text-[11px] font-mono font-bold tracking-wider text-blue-400 uppercase flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      Related {product.category} Items (Same Category)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {relatedSameCategoryItems.map((item) => {
                        const isAdded = addedLookItemIds.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            className="p-3 rounded-2xl bg-neutral-900/60 border border-white/5 hover:border-[#B76E79]/30 transition-all flex flex-col justify-between"
                          >
                            <div 
                              onClick={() => onSelectSimilarProduct(item)}
                              className="flex gap-2 items-center cursor-pointer group"
                            >
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-950 border border-white/5 relative flex-shrink-0">
                                <img referrerPolicy="no-referrer" src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h5 className="font-sans font-bold text-xs text-white truncate group-hover:text-[#B76E79] transition-colors">{item.title}</h5>
                                <span className="text-[10px] font-mono text-neutral-400 mt-0.5 block">{formatPrice(item.discountPrice || item.price)}</span>
                              </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={() => onSelectSimilarProduct(item)}
                                className="flex-1 py-1 px-2.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-[9px] uppercase font-bold transition"
                              >
                                View Info
                              </button>
                              <button
                                onClick={() => handleAddLookItemToCart(item)}
                                className={`flex-1 py-1 px-2.5 rounded text-[9px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                  isAdded ? 'bg-green-600 text-white' : 'bg-[#B76E79] hover:bg-[#c97f8a] text-white'
                                }`}
                              >
                                {isAdded ? 'In Bag' : '+ Add'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SECTION 2: OUTFIT SUITABILITY FROM SOURCE IMAGE */}
                {suitingOutfitProducts.length > 0 && (
                  <div className="lg:col-span-6 space-y-4 text-left">
                    <h4 className="text-[11px] font-mono font-bold tracking-wider text-[#B76E79] uppercase flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#B76E79] rounded-full animate-pulse" />
                      Outfit Suited for this Product's Vibe
                    </h4>
                    
                    <div className="p-3 bg-neutral-900/40 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-[10px] text-neutral-400 leading-normal italic">
                        "Designed to coordinate with the core silhouette, material construction, and color tones represented in this product's photography:"
                      </p>

                      <div className="grid grid-cols-1 gap-2.5">
                        {suitingOutfitProducts.map((item) => {
                          const isAdded = addedLookItemIds.includes(item.id);
                          return (
                            <div
                              key={item.id}
                              className="p-2.5 rounded-xl bg-neutral-950/60 border border-white/5 flex items-center justify-between gap-3 group"
                            >
                              <div
                                onClick={() => onSelectSimilarProduct(item)}
                                className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                              >
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-950 border border-white/5 relative flex-shrink-0">
                                  <img referrerPolicy="no-referrer" src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="min-w-0">
                                  <span className="block text-[8px] font-mono font-bold text-neutral-500 uppercase">{item.category}</span>
                                  <h5 className="font-sans font-bold text-[11px] text-white truncate group-hover:text-[#B76E79] transition-colors">{item.title}</h5>
                                </div>
                              </div>
                              <button
                                onClick={() => handleAddLookItemToCart(item)}
                                className={`py-1.5 px-3 rounded-lg text-[9px] uppercase font-black tracking-wider transition duration-200 cursor-pointer flex-shrink-0 ${
                                  isAdded ? 'bg-green-600 text-white' : 'bg-white hover:bg-neutral-100 text-black'
                                }`}
                              >
                                {isAdded ? 'Added' : 'Combine Look'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
