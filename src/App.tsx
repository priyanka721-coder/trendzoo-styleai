/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Trash2, Heart, ArrowRight, ArrowLeft, ShieldCheck, Truck, RefreshCw, 
  MapPin, Phone, Mail, Star, ExternalLink, Sparkles, Filter, CreditCard, 
  ChevronRight, BookmarkIcon, ClipboardCheck, MessageSquare, Clock, Globe,
  HelpCircle
} from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import AIChatBot from './components/AIChatBot';
import CheckoutModal from './components/CheckoutModal';
import RunwayStudio from './components/RunwayStudio';
import ScratchCard from './components/ScratchCard';
import LofiAuraMixer from './components/LofiAuraMixer';
import AIOutfitAdviser from './components/AIOutfitAdviser';

import { Product, CartItem, Order, UserProfile, ShippingAddress } from './types';
import { products, coupons, FAQData, reviews } from './data';
import { formatPrice } from './utils/currency';

export default function App() {
  // Navigation & UI States
  const [activePage, setActivePage] = useState<string>('home');
  const [pageHistory, setPageHistory] = useState<string[]>(['home']);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // User Authentication / Get Started welcome gate states
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [inputName, setInputName] = useState('');
  const [inputPref, setInputPref] = useState('Haute Luxury');

  // Back floating pop-up navigation states
  const [isBackPopupOpen, setIsBackPopupOpen] = useState(false);

  // Sync page navigation sequence
  useEffect(() => {
    setPageHistory(prev => {
      if (prev[prev.length - 1] === activePage) return prev;
      return [...prev, activePage];
    });
  }, [activePage]);

  const handleGoBack = () => {
    if (pageHistory.length > 1) {
      const updatedHistory = [...pageHistory];
      updatedHistory.pop(); // Pop current view
      const prevPage = updatedHistory[updatedHistory.length - 1];
      setPageHistory(updatedHistory);
      setActivePage(prevPage);
    } else {
      setActivePage('home');
    }
  };

  // Cart State (Persisted in LocalStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('trendzo_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist State (Persisted in LocalStorage)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('trendzo_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Order Records State (Persisted in LocalStorage with initial dummy order)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('trendzo_orders');
    if (saved) return JSON.parse(saved);
    
    // Initial dummy historic orders for rich visualization on startup
    const dummyOrder1: Order = {
      id: "TR-582931",
      date: "2026-06-02",
      items: [
        {
          productId: "prod-01",
          title: "AeroWeave Organic Carbon Kimono",
          price: 119.99,
          quantity: 1,
          color: "Stealth Black",
          image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=300&auto=format&fit=crop"
        }
      ],
      subtotal: 119.99,
      discountAmount: 20.00,
      shippingFee: 0,
      total: 107.99,
      status: 'Delivered',
      address: {
        fullName: "Alex Miller",
        addressLine1: "152 West Oak Street",
        city: "San Jose",
        state: "CA",
        zipCode: "95112",
        country: "United States",
        phone: "+1-555-0158"
      },
      paymentMethod: 'Credit/Debit Cards',
      trackingNumber: "TZ-91024823"
    };

    const dummyOrder2: Order = {
      id: "TR-942810",
      date: "2026-06-10",
      items: [
        {
          productId: "prod-04",
          title: "Velocity-9 Air Kushioned Sneakers",
          price: 159.99,
          quantity: 1,
          color: "Neon Crimson",
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop"
        }
      ],
      subtotal: 159.99,
      discountAmount: 0,
      shippingFee: 8.50,
      total: 168.49,
      status: 'Processing',
      address: {
        fullName: "Alex Miller",
        addressLine1: "152 West Oak Street",
        city: "San Jose",
        state: "CA",
        zipCode: "95112",
        country: "United States",
        phone: "+1-555-0158"
      },
      paymentMethod: 'Google Pay',
      trackingNumber: "TZ-48293021"
    };

    return [dummyOrder2, dummyOrder1];
  });

  // Active User Profile State (Editable)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('trendzo_profile');
    if (saved) return JSON.parse(saved);
    
    return {
      name: "Alex Miller",
      email: "alex.miller@gmail.com",
      phone: "+1-555-0158",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      addresses: [
        {
          fullName: "Alex Miller",
          addressLine1: "152 West Oak Street",
          city: "San Jose",
          state: "CA",
          zipCode: "95112",
          country: "United States",
          phone: "+1-555-0158"
        }
      ]
    };
  });

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Shop Filter States
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(350);
  const [sortOption, setSortOption] = useState<string>('featured');

  // Visual Countdown timer active state (for flash sale)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  // Page active scroll-to-top handler
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activePage]);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('trendzo_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('trendzo_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('trendzo_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('trendzo_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Flash sale countdown ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 24, minutes: 0, seconds: 0 }; // Loop back
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    const finalColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
    const finalSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    
    // Composite Key allows multiple configurations of the same item
    const compositeId = `${product.id}-${finalColor || 'none'}-${finalSize || 'none'}`;

    setCart(prev => {
      const exists = prev.find(item => item.id === compositeId);
      if (exists) {
        return prev.map(item => 
          item.id === compositeId 
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) } 
            : item
        );
      }
      return [...prev, { id: compositeId, product, quantity, selectedColor: finalColor, selectedSize: finalSize }];
    });
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta;
        if (nextQty <= 0) return item; // Handled via delete-icon trigger
        return { ...item, quantity: Math.min(item.product.stock, nextQty) };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => 
      prev.includes(product.id) 
        ? prev.filter(id => id !== product.id) 
        : [...prev, product.id]
    );
  };

  // Place Order completion
  const handlePlaceOrder = (completedOrder: Order) => {
    setOrders(prev => [completedOrder, ...prev]);
    setCart([]); // Reset Cart
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);
    setActivePage('dashboard');
    alert(`Order ${completedOrder.id} placed successfully! Thank you for shopping with Trendzo.`);
  };

  // Coupon evaluation
  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const query = couponCode.trim().toUpperCase();
    const found = coupons.find(c => c.code === query);

    if (!found) {
      setCouponError('Invalid coupon code.');
      return;
    }

    const sub = getCartSubtotal();
    if (found.minimumSpend && sub < found.minimumSpend) {
      setCouponError(`Minimum spend of ${formatPrice(found.minimumSpend)} required for this coupon.`);
      return;
    }

    setAppliedCoupon({ code: found.code, discountPercent: found.discountPercent });
    setCouponSuccess(`Coupon applied successfully! Slices ${found.discountPercent}% off.`);
  };

  // Numeric summary lookups
  const getCartSubtotal = () => {
    return Math.round(cart.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.price;
      return sum + (price * item.quantity);
    }, 0) * 100) / 100;
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    const sub = getCartSubtotal();
    return Math.round((sub * (appliedCoupon.discountPercent / 100)) * 100) / 100;
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Copied code: ${code}! Paste it at checkout to unlock your savings.`);
  };

  // Filtered Shop database
  const getFilteredProducts = () => {
    let list = [...products];

    // Search query match
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Category click tags
    if (categoryFilter !== 'All') {
      list = list.filter(p => p.category === categoryFilter);
    }

    // Max Price slide filter
    list = list.filter(p => (p.discountPrice || p.price) <= priceRange);

    // Sorting operations
    if (sortOption === 'low-high') {
      list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortOption === 'high-low') {
      list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortOption === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'trending') {
      list.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
    }

    return list;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-neutral-800 antialiased">
      
      {/* Sticky Header component */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onSearchProduct={(product) => setSelectedProduct(product)}
        onOpenProfile={() => setActivePage('dashboard')}
      />

      {/* Main viewport transitions */}
      <main className="flex-1 pt-24 pb-16">
        {activePage !== 'home' && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-6 bg-white border border-neutral-200 rounded-2xl shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGoBack}
                  className="group inline-flex items-center gap-2 py-2 px-4.5 bg-[#B76E79] hover:bg-[#c97f8a] text-white rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform" />
                  <span>Go Back</span>
                </button>
                <div className="h-6 w-px bg-neutral-200 hidden sm:block" />
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                  <span 
                    onClick={() => setActivePage('home')}
                    className="hover:text-[#B76E79] cursor-pointer hover:underline transition-all"
                  >
                    Home
                  </span>
                  <span>/</span>
                  <span className="text-[#B76E79] capitalize font-semibold">{activePage}</span>
                </div>
              </div>

              {/* Quick dynamic tips or tags */}
              <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ACTIVE ZONE: <strong className="text-neutral-700 capitalize font-sans text-xs">{activePage}</strong></span>
              </div>
            </div>
          </div>
        )}
        <AnimatePresence mode="wait">
          
          {/* VIEW: HOME PAGE */}
          {activePage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-16"
            >
              
              {/* HERO BANNER SECTION */}
              <section id="hero-segment" className="relative max-w-7xl mx-auto px-4 md:px-6">
                <div className="relative rounded-3xl bg-gradient-to-br from-neutral-50 via-white to-pink-50/10 border border-neutral-200 overflow-hidden py-16 md:py-24 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
                  {/* Decorative mesh glows */}
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-600/5 rounded-full blur-[120px] pointer-events-none" />

                  {/* Left typography */}
                  <div className="space-y-6 max-w-lg text-left z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-rose/10 text-brand-rose text-xs font-semibold tracking-wider uppercase">
                      <Sparkles className="w-3.5 h-3.5" />
                      NEW DROP INSPIRED BY STREET CULTURE
                    </div>
                    
                    <h1 className="font-serif italic font-bold text-4xl sm:text-5xl lg:text-6xl text-neutral-950 leading-[1.1] tracking-tight">
                      Wear Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-rose via-brand-beige to-brand-gold font-sans font-black uppercase tracking-tight">Vibe</span>. Own Your <span className="font-sans font-black uppercase text-brand-black tracking-tight">Style</span>.
                    </h1>

                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Discover the absolute zenith of technical streetwear apparel, elite sneakers, premium slides, and fine jewelry. Built exclusively for next-generation trendsetters.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => setActivePage('products')}
                        id="hero-shop-btn"
                        className="glowing-button text-xs font-bold py-3 px-8 rounded-xl text-white cursor-pointer"
                      >
                        Shop Collection
                      </button>
                      <button
                        onClick={() => setActivePage('offers')}
                        id="hero-deals-btn"
                        className="py-3 px-6 text-xs font-bold rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 hover:bg-neutral-200 transition-colors cursor-pointer"
                      >
                        View Active Banners
                      </button>
                    </div>
                  </div>

                  {/* Right Hero Product graphic carousel mock */}
                  <div className="relative w-full max-w-sm lg:max-w-md aspect-square z-10 flex items-center justify-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className="relative p-3 rounded-3xl bg-neutral-100/50 border border-neutral-200 shadow-sm w-[85%] aspect-square flex items-center justify-center overflow-hidden"
                    >
                      <img
                        referrerPolicy="no-referrer"
                        src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop"
                        alt="Featured Luxury Carbon Kimono Jacket"
                        className="rounded-2xl w-full h-full object-cover shadow-md"
                      />
                      
                      {/* Interactive Spec pop tags */}
                      <div className="absolute -bottom-4 right-4 p-3 rounded-2xl bg-white border border-neutral-200 backdrop-blur shadow-xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-900 text-brand-gold flex items-center justify-center font-bold text-xs">
                          HOT
                        </div>
                        <div className="text-left">
                          <span className="block text-[9px] text-neutral-400 uppercase tracking-widest font-mono">Top Picked</span>
                          <span className="block text-xs font-bold text-neutral-900">Carbon Kimono Jacket</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* FEATURES VALUE BAR */}
              <section id="features-value-bar" className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-neutral-900">Free Delivery</div>
                      <div className="text-[10px] text-neutral-500">On all checkout bills over {formatPrice(50)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <ShieldCheck className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-neutral-900">Secure Payments</div>
                      <div className="text-[10px] text-neutral-500">Fully encrypted direct gateways</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <RefreshCw className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-neutral-900">Free returns</div>
                      <div className="text-[10px] text-neutral-500">30-day swappable warranty</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-neutral-900">24/7 AI Advisor</div>
                      <div className="text-[10px] text-neutral-500">Conversational stylist droids</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* CATEGORIES GRID BLOCK */}
              <section id="categories-selector-segment" className="max-w-7xl mx-auto px-4 md:px-6 text-left space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-neutral-950">Browse Curated Aesthetics</h2>
                  <p className="text-xs text-neutral-500 mt-1">Select an icon to explore target product classes instantly.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Clothes', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=150', count: 30 },
                    { name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=150', count: 30 },
                    { name: 'Slippers', image: 'https://images.unsplash.com/photo-1603808033207-2476249d2974?q=80&w=150', count: 30 },
                    { name: 'Jewelry', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=150', count: 30 }
                  ].map((cat) => (
                    <div
                      key={cat.name}
                      onClick={() => {
                        setCategoryFilter(cat.name);
                        setActivePage('products');
                      }}
                      className="group cursor-pointer relative h-28 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100"
                    >
                      <img referrerPolicy="no-referrer" src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent flex flex-col justify-end p-3 flex-shrink-0">
                        <span className="font-display font-bold text-sm text-white block">{cat.name}</span>
                        <span className="text-[10px] text-neutral-300 font-mono block mt-0.5">{cat.count} unique products</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Ticking FLASH SALE SECTION */}
              <section id="flash-sale-segment" className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="rounded-3xl bg-neutral-50 p-6 md:p-8 border border-neutral-200 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
                  {/* Light light beams */}
                  <div className="absolute top-0 left-0 w-24 h-24 bg-red-500/[0.04] rounded-full blur-3xl" />
                  
                  {/* Left countdown labels */}
                  <div className="space-y-3 text-center md:text-left z-10">
                    <span className="inline-block text-[9px] font-mono tracking-widest bg-red-100 text-red-600 font-bold px-3 py-1 rounded-md uppercase">
                      CRITICAL PRICE DROPS
                    </span>
                    <h2 className="font-display font-extrabold text-xl md:text-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Trendzo Midnight Flash Sale</h2>
                    <p className="text-xs text-neutral-600 max-w-sm">Quantities are microscopic. Buy immediately before pricing resumes standard values.</p>
                  </div>

                  {/* Countdown Digital Timer */}
                  <div className="flex gap-4 z-10" id="sale-digital-clock">
                    {[
                      { l: 'Hrs', v: timeLeft.hours },
                      { l: 'Min', v: timeLeft.minutes },
                      { l: 'Sec', v: timeLeft.seconds }
                    ].map((clockItem, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center font-mono font-extrabold text-lg text-red-600">
                          {clockItem.v.toString().padStart(2, '0')}
                        </div>
                        <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono mt-1">{clockItem.l}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setCategoryFilter('All');
                      setSortOption('featured');
                      setActivePage('products');
                    }}
                    className="py-2.5 px-6 text-xs font-bold rounded-xl bg-red-500 hover:bg-red-600 transition-colors text-white cursor-pointer"
                  >
                    Enter sale floor
                  </button>
                </div>
              </section>

              {/* INTERACTIVE COMPONENT: RUNWAY STUDIO CONFIGURATOR */}
              <RunwayStudio
                products={products}
                onAddToCart={(p, q, col, sz) => handleAddToCart(p, q, col, sz)}
                onQuickView={(p) => setSelectedProduct(p)}
                onToggleWishlist={(p) => handleToggleWishlist(p)}
                wishlist={wishlist}
              />

              {/* TRENDING & BEST SELLERS CATALOG Segment */}
              <section id="trending-catalog-segment" className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
                  <div>
                    <h2 className="font-display font-bold text-2xl text-white">Trending Drops</h2>
                    <p className="text-xs text-neutral-500 mt-1">High-demand items generating massive global buzz right now.</p>
                  </div>
                  <button
                    onClick={() => {
                      setCategoryFilter('All');
                      setActivePage('products');
                    }}
                    className="text-xs font-bold text-blue-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    View entire inventory
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.slice(0, 4).map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAddToCart={(obj, qty) => handleAddToCart(obj, qty)}
                      onQuickView={(obj) => setSelectedProduct(obj)}
                      onToggleWishlist={(obj) => handleToggleWishlist(obj)}
                      isWishlisted={wishlist.includes(p.id)}
                    />
                  ))}
                </div>
              </section>

              {/* PREMIUM TESTIMONIALS SLIDER MOCK */}
              <section id="customer-testimonials" className="max-w-7xl mx-auto px-4 md:px-6 text-left space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-white">Stylist Testimonials</h2>
                  <p className="text-xs text-neutral-500 mt-1">Check out reviews from verified Trendzo shoppers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.slice(0, 2).map((rev) => (
                    <div key={rev.id} className="p-5 rounded-2xl glass-panel-light border border-white/5 space-y-4">
                      {/* Avatar & author info */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img referrerPolicy="no-referrer" src={rev.avatar} alt={rev.author} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <div className="text-xs font-bold text-white">{rev.author}</div>
                            <div className="text-[10px] text-neutral-500 font-mono">Verified buyer</div>
                          </div>
                        </div>

                        {/* Rating stars */}
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      {/* Comment text */}
                      <p className="text-xs text-neutral-300 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* GENZ NEWSLETTER EMAIL CONSOLE */}
              <section id="hero-newsletter-signup" className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="rounded-3xl bg-radial from-neutral-900 to-neutral-950 p-8 md:p-12 border border-white/5 text-center space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl" />
                  
                  <div className="max-w-lg mx-auto space-y-3">
                    <h2 className="font-display font-bold text-2xl text-white">Join the Smart Retail Circle</h2>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Receive early-bird slots on premium collaborations, streetwear collections, secret discount keys, and personalized AI selections.
                    </p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); alert("Successfully joined! Promo key GENZ20 is waiting for use."); }} className="flex flex-col sm:flex-row items-center gap-2 max-w-sm mx-auto">
                    <input
                      type="email"
                      required
                      placeholder="style.innovator@domain.com"
                      className="w-full text-xs py-3 px-4 rounded-xl glass-input placeholder-neutral-500"
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 font-bold text-xs rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </section>

            </motion.div>
          )}

          {/* VIEW: PRODUCT LISTING PAGE */}
          {activePage === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 md:px-6 space-y-6"
              id="shop-listing-viewport"
            >
              
              {/* Back navigation button */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleGoBack}
                  id="products-back-btn"
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 transition-colors bg-neutral-100 hover:bg-neutral-200 py-1.5 px-3 rounded-lg border border-neutral-200 font-semibold cursor-pointer shadow-3xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              </div>

              {/* UPPER BAR SEARCH CONTROLS */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-neutral-250 text-left">
                <div>
                  <h1 className="font-display font-bold text-2xl text-neutral-950">All Curated Drops</h1>
                  <p className="text-xs text-neutral-500 mt-1">Configure style parameters below to navigate our digital warehouse.</p>
                </div>

                {/* Inline search bar */}
                <div className="relative w-full max-w-sm">
                  <span className="absolute left-3 top-3"><Filter className="w-4 h-4 text-neutral-500" /></span>
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search titles, materials, tags..."
                    className="w-full text-xs py-2.5 pl-9 pr-4 rounded-xl glass-input placeholder-neutral-500"
                  />
                </div>
              </div>

              {/* CORE CATALOG GRID MATRIX */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* SIDEBAR: ACTIVE FACETS FILTERS */}
                <div className="space-y-6 lg:col-span-1 rounded-2xl bg-neutral-50 border border-neutral-200 p-5 text-left h-fit" id="desktop-shop-facets">
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                    <span className="font-display font-bold text-xs text-neutral-950 uppercase tracking-wider">Style Filters</span>
                    <button
                      onClick={() => {
                        setCategoryFilter('All');
                        setPriceRange(350);
                        setSortOption('featured');
                        setSearchFilter('');
                      }}
                      className="text-[10px] text-neutral-500 hover:text-neutral-950 font-mono font-bold uppercase transition-colors pointer-events-auto cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Category toggles */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">Class Category</span>
                    <div className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
                      {['All', 'Clothes', 'Shoes', 'Slippers', 'Jewelry'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`text-xs font-semibold py-1.5 px-3 rounded-lg text-left transition-colors cursor-pointer ${
                            categoryFilter === cat 
                              ? 'bg-blue-50 text-blue-600 font-bold border-none' 
                              : 'text-neutral-600 hover:text-neutral-950'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price sliders */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-[10px] font-mono uppercase text-neutral-500">
                      <span>Max Budget</span>
                      <span className="font-bold text-blue-650">{formatPrice(priceRange)}</span>
                    </div>
                    <input
                      type="range"
                      min={30}
                      max={350}
                      step={10}
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Sort options select */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">Sort Order</span>
                    <select
                      value={sortOption || "featured"}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full text-xs py-2 px-3 rounded-lg bg-white border border-neutral-300 text-neutral-800 outline-none focus:border-blue-600 cursor-pointer"
                    >
                      <option value="featured">Featured Picks</option>
                      <option value="low-high">Price: Low - High</option>
                      <option value="high-low">Price: High - Low</option>
                      <option value="rating">Top Rated Stars</option>
                      <option value="trending">Voted Trending</option>
                    </select>
                  </div>
                </div>

                {/* RIGHT: Grid containing filtered results */}
                <div className="lg:col-span-3 space-y-6">
                  {getFilteredProducts().length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getFilteredProducts().map((p) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          onAddToCart={(obj, qty) => handleAddToCart(obj, qty)}
                          onQuickView={(obj) => setSelectedProduct(obj)}
                          onToggleWishlist={(obj) => handleToggleWishlist(obj)}
                          isWishlisted={wishlist.includes(p.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/5 bg-white/2 py-20 text-center space-y-2">
                      <span className="block text-sm text-neutral-400 font-bold">No product matches.</span>
                      <p className="text-xs text-neutral-600">Try adjusting price range sliders or keyword searches.</p>
                    </div>
                  )}
                </div>

              </div>

            </motion.div>
          )}

          {/* VIEW: SHOPPING CART PAGE */}
          {activePage === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 md:px-6 space-y-6 text-left"
              id="cart-viewport"
            >
              
              {/* Back navigation button */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleGoBack}
                  id="cart-back-btn"
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 transition-colors bg-neutral-100 hover:bg-neutral-200 py-1.5 px-3 rounded-lg border border-neutral-200 font-semibold cursor-pointer shadow-3xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              </div>

              <div>
                <h1 className="font-display font-bold text-2xl text-neutral-950">Your Shopping Bag</h1>
                <p className="text-xs text-neutral-500 mt-1">Review items selected below to initialize delivery codes.</p>
              </div>

              {cart.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* LEFT: Items List (Span 8) */}
                  <div className="lg:col-span-8 divide-y divide-neutral-200 space-y-4">
                    {cart.map((item) => {
                      const currentPrice = item.product.discountPrice || item.product.price;
                      return (
                        <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 first:pt-0">
                          <div className="flex items-center gap-4">
                            <img
                              referrerPolicy="no-referrer"
                              src={item.product.image}
                              alt={item.product.title}
                              className="w-16 h-16 rounded-xl object-cover bg-neutral-100 border border-neutral-200 flex-shrink-0"
                            />
                            <div>
                              <h3 onClick={() => setSelectedProduct(item.product)} className="font-semibold text-sm text-neutral-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1">{item.product.title}</h3>
                              <span className="text-[10px] text-neutral-500 block uppercase font-mono mt-0.5">{item.product.category}</span>
                              <div className="flex gap-2 text-[10px] text-neutral-500 mt-1">
                                {item.selectedColor && <span>Color: <strong className="text-neutral-800">{item.selectedColor}</strong></span>}
                                {item.selectedSize && <span>Size: <strong className="text-neutral-800">{item.selectedSize}</strong></span>}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                            {/* Quantity buttons */}
                            <div className="flex items-center rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden">
                              <button
                                onClick={() => handleUpdateCartQty(item.id, -1)}
                                className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-mono font-bold text-neutral-900 min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateCartQty(item.id, 1)}
                                className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800 cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            {/* Item calculated INR */}
                            <span className="font-mono font-bold text-sm text-neutral-950 min-w-[70px] text-right">
                              {formatPrice(currentPrice * item.quantity)}
                            </span>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-650 transition-colors cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* RIGHT: Coupon and Order Total computation summary box (Span 4) */}
                  <div className="lg:col-span-4 rounded-3xl bg-neutral-50 border border-neutral-200 p-6 space-y-6 h-fit shadow-xs">
                    <h3 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-3">Bill Breakdown</h3>

                    {/* Promo input field */}
                    <form onSubmit={handleApplyCoupon} className="space-y-2">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Coupon Discount</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="e.g. GENZ20"
                          className="flex-1 text-xs py-2 px-3 rounded-lg bg-white border border-neutral-300 outline-none focus:border-blue-600 text-neutral-850 uppercase"
                        />
                        <button
                          type="submit"
                          className="py-2 px-4 text-xs font-bold rounded-lg bg-neutral-950 text-white hover:bg-neutral-850 cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      
                      {/* Feedback labels */}
                      {couponError && <span className="block text-[10px] text-red-600 font-bold">{couponError}</span>}
                      {couponSuccess && <span className="block text-[10px] text-green-600 font-bold">{couponSuccess}</span>}
                    </form>

                    {/* Breakdown totals list */}
                    <div className="divide-y divide-neutral-200 space-y-3 pt-3 text-xs text-neutral-600">
                      <div className="flex justify-between pb-1">
                        <span>Items Subtotal</span>
                        <span className="text-neutral-900 font-mono">{formatPrice(getCartSubtotal())}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between py-1 text-green-600 font-bold">
                          <span>Rebate ({appliedCoupon.code})</span>
                          <span className="font-mono">-{formatPrice(getDiscountAmount())}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-1">
                        <span>Delivery fee</span>
                        <span className="text-neutral-900 font-mono">{getCartSubtotal() > 50 ? "FREE" : formatPrice(9.99)}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Est. Sales Tax (8%)</span>
                        <span className="text-neutral-900 font-mono">{formatPrice(getCartSubtotal() * 0.08)}</span>
                      </div>
                      <div className="h-[1px] bg-neutral-200 my-2" />
                      <div className="flex justify-between text-neutral-950 text-sm font-extrabold">
                        <span>Total grand bill</span>
                        <span className="text-blue-600 font-mono">
                          {formatPrice(getCartSubtotal() - getDiscountAmount() + (getCartSubtotal() > 50 ? 0 : 9.99) + (getCartSubtotal() * 0.08))}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsCheckoutOpen(true)}
                      className="w-full glowing-button font-bold text-xs py-3 rounded-xl text-white cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      Initialize Secure Checkout
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ) : (
                <div className="rounded-3xl border border-neutral-200 bg-neutral-50 py-24 text-center space-y-4 shadow-3xs">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-250 flex items-center justify-center mx-auto text-neutral-500 shadow-2xs">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-sm font-bold text-neutral-900">Your bag is empty.</span>
                    <p className="text-xs text-neutral-500">Add trending techwear, devices, or footwear sneakers to begin.</p>
                  </div>
                  <button
                    onClick={() => setActivePage('products')}
                    className="py-2 px-6 rounded-lg bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-850 cursor-pointer shadow-3xs"
                  >
                    Browse Catalog
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* VIEW: USER ACCOUNT DASHBOARD */}
          {activePage === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 md:px-6 space-y-8 text-left"
              id="dashboard-viewport"
            >
              <div>
                <h1 className="font-display font-bold text-2xl text-white">Your Account Center</h1>
                <p className="text-xs text-neutral-500 mt-1">Review active delivery tracks, edit profile elements, or view your saved wishlists.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN: Profile overview cards & Setting options */}
                <div className="lg:col-span-4 space-y-6">
                  {/* User Profile avatar box */}
                  <div className="p-6 rounded-2xl glass-panel-light border border-white/5 text-center space-y-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-blue-500">
                      <img referrerPolicy="no-referrer" src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-white">{userProfile.name}</h3>
                      <span className="text-[10px] text-neutral-500 font-mono">{userProfile.email}</span>
                    </div>
                  </div>

                  {/* Settings quick-edit form fields */}
                  <div className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-2">Edit Credentials</span>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] text-neutral-500 font-mono">User Name</label>
                      <input
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                        className="w-full text-xs py-2 px-3 rounded-lg bg-neutral-900 border border-white/15 outline-none text-white focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-neutral-500 font-mono">Email Address</label>
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                        className="w-full text-xs py-2 px-3 rounded-lg bg-neutral-900 border border-white/15 outline-none text-white focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-neutral-500 font-mono">Phone</label>
                      <input
                        type="text"
                        value={userProfile.phone}
                        onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                        className="w-full text-xs py-2 px-3 rounded-lg bg-neutral-900 border border-white/15 outline-none text-white focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Tab displays for Order Logs, Wishlists */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* segment track 1: Order history */}
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      Order Shipment Registry
                    </h3>

                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((o) => (
                          <div key={o.id} className="p-5 rounded-2xl glass-panel border border-white/5 space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-3 text-xs leading-relaxed">
                              <div>
                                <span className="font-bold text-white font-mono block">{o.id}</span>
                                <span className="text-neutral-500 font-mono text-[10px]">Placed Date: {o.date}</span>
                              </div>
                              <div className="text-right sm:text-right">
                                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                                  o.status === 'Delivered' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-blue-500/20 text-blue-400 animate-pulse'
                                }`}>
                                  {o.status}
                                </span>
                                <span className="block text-[10px] text-neutral-400 font-bold mt-1">Total Bill: {formatPrice(o.total)}</span>
                              </div>
                            </div>

                            {/* VISUAL SHIPMENT PROGRESS TRACKER */}
                            <div className="py-4 border-b border-white/5 space-y-4">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block text-left">
                                Shipment Track Journey
                              </span>
                              
                              <div className="relative pt-1">
                                {/* Connector Line */}
                                <div className="absolute top-[18px] left-[12%] right-[12%] h-[3px] bg-neutral-800 rounded-full">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                                    style={{
                                      width: 
                                        o.status === 'Returned' ? '0%' :
                                        o.status === 'Delivered' ? '100%' :
                                        o.status === 'Shipped' ? '66%' :
                                        o.status === 'Processing' ? '33%' : '0%' // Ordered
                                    }}
                                  />
                                </div>

                                {/* Milestones Row */}
                                <div className="flex justify-between relative z-10">
                                  {[
                                    { name: 'Ordered', step: 1 },
                                    { name: 'Processing', step: 2 },
                                    { name: 'Shipped', step: 3 },
                                    { name: 'Delivered', step: 4 }
                                  ].map((milestone) => {
                                    // Calculate active state
                                    const statusSteps: Record<string, number> = {
                                      'Ordered': 1,
                                      'Processing': 2,
                                      'Shipped': 3,
                                      'Delivered': 4,
                                      'Returned': 0
                                    };
                                    const currentStep = statusSteps[o.status] || 1;
                                    const isActive = milestone.step <= currentStep;
                                    const isCurrent = milestone.step === currentStep;

                                    return (
                                      <div key={milestone.name} className="flex flex-col items-center flex-1">
                                        <div 
                                          className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 border ${
                                            isCurrent 
                                              ? 'bg-blue-600 text-white border-blue-400 scale-110 shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10' 
                                              : isActive
                                                ? 'bg-neutral-900 text-emerald-400 border-emerald-500/50'
                                                : 'bg-neutral-950 text-neutral-600 border-neutral-800'
                                          }`}
                                        >
                                          {milestone.step}
                                        </div>
                                        <span 
                                          className={`text-[9px] font-mono mt-1.5 transition-colors duration-300 font-bold uppercase tracking-wider ${
                                            isCurrent 
                                              ? 'text-blue-400' 
                                              : isActive 
                                                ? 'text-neutral-300' 
                                                : 'text-neutral-600'
                                          }`}
                                        >
                                          {milestone.name}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Item breakdowns thumb logs */}
                            <div className="space-y-2">
                              {o.items.map((it, idx) => (
                                <div key={idx} className="flex gap-3 text-xs items-center">
                                  <img referrerPolicy="no-referrer" src={it.image} alt={it.title} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-white truncate">{it.title}</div>
                                    <div className="text-[10px] text-neutral-500 mt-0.5">Qty: {it.quantity} {it.color ? `| ${it.color}` : ''}</div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Tracking codes logs */}
                            {o.trackingNumber && (
                              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-400">
                                <div>
                                  <span className="block font-mono">Carrier: TRENDZO EXPRESS</span>
                                  <span className="block font-sans">Tracking: <strong className="text-white font-mono">{o.trackingNumber}</strong></span>
                                </div>
                                <span className="text-blue-400 hover:text-white transition-colors cursor-pointer text-right flex items-center gap-1 font-bold">
                                  Track delivery
                                  <ExternalLink className="w-3 h-3" />
                                </span>
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 rounded-2xl bg-white/2 border border-white/5 text-center text-neutral-500 text-xs">
                        No transactions registered yet.
                      </div>
                    )}
                  </div>

                  {/* segment track 2: Favorited items lists */}
                  <div className="space-y-4 pt-4">
                    <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                      <BookmarkIcon className="w-4 h-4 text-blue-400" />
                      Saved Wishlisted Items ({wishlist.length})
                    </h3>

                    {wishlist.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products
                          .filter(p => wishlist.includes(p.id))
                          .map(p => (
                            <div key={p.id} className="p-3 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <img referrerPolicy="no-referrer" src={p.image} alt={p.title} className="w-12 h-12 object-cover rounded-xl" />
                                <div className="text-left">
                                  <h4 onClick={() => setSelectedProduct(p)} className="text-xs font-bold text-white truncate max-w-[120px] hover:text-blue-400 cursor-pointer">{p.title}</h4>
                                  <span className="text-[10px] font-mono text-neutral-500 mt-0.5">{formatPrice(p.discountPrice || p.price)}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAddToCart(p, 1)}
                                  className="py-1.5 px-3 text-[10px] font-bold rounded-lg bg-white text-black hover:bg-neutral-200 cursor-pointer"
                                >
                                  + Bag
                                </button>
                                <button
                                  onClick={() => handleToggleWishlist(p)}
                                  className="p-1.5 rounded-lg hover:bg-red-500/15 text-neutral-500 hover:text-red-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="p-8 rounded-2xl bg-white/2 border border-white/5 text-center text-neutral-500 text-xs">
                        No wishlisted items cataloged.
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* VIEW: OFFERS AND DEALS PAGE */}
          {activePage === 'offers' && (
            <motion.div
              key="offers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 md:px-6 space-y-8"
              id="offers-viewport"
            >
              <div className="text-center max-w-xl mx-auto space-y-3">
                <h1 className="font-display font-extrabold text-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Trendzo Seasonal Drops & Coupons</h1>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Unlock supreme discounts. Below are copyable code slots and limited-time promotional bundles configured store-wide.
                </p>
              </div>

              {/* GAMIFIED DIGITALLY INTERACTIVE CARD */}
              <ScratchCard />

              {/* Grid of Coupons cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 shadow-sm space-y-4 text-left relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-2xl" />
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-extrabold text-neutral-950 font-mono">{c.discountPercent}% OFF</span>
                      <span className="text-[9px] font-mono uppercase bg-purple-50 text-purple-600 font-bold px-2 py-0.5 rounded">Promo Key</span>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed min-h-[40px]">{c.description}</p>
                    {c.minimumSpend && c.minimumSpend > 0 && (
                      <span className="block text-[9px] text-neutral-500 font-mono">*Min spend required: {formatPrice(c.minimumSpend)}</span>
                    )}

                    <button
                      onClick={() => handleCopyCoupon(c.code)}
                      className="w-full py-2 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-850 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      Copy Code: {c.code}
                    </button>
                  </div>
                ))}
              </div>

              {/* Combo Offers banners */}
              <div className="rounded-3xl bg-gradient-to-br from-neutral-50 via-white to-pink-50/10 p-8 md:p-12 border border-neutral-200 text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="space-y-3 max-w-lg">
                  <span className="text-[10px] font-mono uppercase tracking-widest bg-brand-rose/15 text-brand-rose font-bold px-2.5 py-1 rounded">TRENDZO Style Mixers</span>
                  <h3 className="font-serif italic font-bold text-xl md:text-2xl text-neutral-950">Synergy Coordinate Bundle</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Elevate your fashion identity! Customize a set using our Style Mixer on any product. Bundle matching Clothes, Shoes, and Jewelry together to enjoy a <strong>flat 15% discount</strong> on checkout instantly.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCategoryFilter('All');
                    setActivePage('products');
                  }}
                  className="py-3 px-6 rounded-xl bg-neutral-950 hover:bg-neutral-900 font-bold text-xs text-white cursor-pointer"
                >
                  Open Style Mixer
                </button>
              </div>
            </motion.div>
          )}

          {/* VIEW: ABOUT US PAGE */}
          {activePage === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 md:px-6 space-y-12"
              id="about-viewport"
            >
              {/* Story Banner */}
              <section className="relative rounded-3xl bg-neutral-50 p-8 md:p-16 border border-neutral-200 text-center space-y-4 overflow-hidden shadow-xs">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-600/5 opacity-50" />
                <div className="max-w-2xl mx-auto space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded">Our Story</span>
                  <h1 className="font-display font-extrabold text-3xl md:text-4xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight animate-pulse">About Trendzo.</h1>
                  <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                    Founded in 2026, Trendzo represents a bold visual reimagining of dynamic internet retail. We identify that modern, digitally-native buyers value speed, transparency, and high aesthetic cohesion equally. Our catalog rejects clunky options to showcase and deliver premium accessories, functional outerwear, and advanced acoustics designed for trendsetters.
                  </p>
                </div>
              </section>

              {/* Stat Boxes */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                  { n: '100% Verified Stock', p: 'Authentic drops' },
                  { n: '12h Dispatch', p: 'Instant tracking' },
                  { n: 'SSL Secured', p: 'Proxied payments' },
                  { n: 'AI Dynamic matching', p: 'Smart Stylist advice' }
                ].map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 shadow-2xs">
                    <div className="text-base font-extrabold text-blue-600 font-mono">{stat.n}</div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1 block">{stat.p}</span>
                  </div>
                ))}
              </section>

              {/* FAQs section */}
              <section className="max-w-3xl mx-auto text-left space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="font-display font-bold text-xl text-neutral-950">Trust & Security FAQs</h3>
                  <p className="text-xs text-neutral-500">Frequently queried metrics about our e-commerce flow.</p>
                </div>

                <div className="space-y-4">
                  {FAQData.map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 shadow-2xs">
                      <div className="text-xs font-bold text-neutral-950 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-purple-600" />
                        {faq.question}
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed pl-6">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* VIEW: CONTACT PAGE */}
          {activePage === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 md:px-6 space-y-12"
              id="contact-viewport"
            >
              <div className="text-center max-w-xl mx-auto space-y-3">
                <h1 className="font-display font-extrabold text-3xl text-white">Connect with Support</h1>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Have inquiries regarding target orders, business drops, or custom configurations? Reach our agents below instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Contact support details options (Col 5) */}
                <div className="lg:col-span-5 space-y-6 text-left" id="contact-info-panel">
                  <div className="p-5 rounded-2xl glass-panel-light border border-white/5 space-y-4">
                    <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">Store Desks</h3>
                    
                    <ul className="space-y-4 text-xs text-neutral-400">
                      <li className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span>100 Cyber Boulevard, Silicon Ridge, CA 94025</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span>+1 (800) 873-6396</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span>support@trendzo.com</span>
                      </li>
                    </ul>
                  </div>

                  {/* Mock Google maps frame */}
                  <div className="rounded-2xl border border-white/5 bg-neutral-900/60 aspect-video overflow-hidden relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-neutral-950/40 opacity-70" />
                    {/* Simulated digital grid map graphics */}
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
                    
                    <div className="z-10 text-center space-y-1 cursor-pointer">
                      <Globe className="w-8 h-8 text-blue-500 mx-auto animate-spin" style={{ animationDuration: '30s' }} />
                      <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Trendzo Global Headquarter</span>
                      <p className="text-[9px] text-neutral-600 font-mono">Latitude: 37°23'34\" N | Longitude: 122°01'02\" W</p>
                    </div>
                  </div>
                </div>

                {/* Direct email support message sheet (Col 7) */}
                <div className="lg:col-span-7" id="contact-support-form">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Message successfully logged! Support ticket ID generated. We reply within 2 hours.");
                    }}
                    className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-4 text-left"
                  >
                    <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-3">Email Ticket Submission</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Your name</label>
                        <input type="text" required placeholder="Sienna Vance" className="w-full text-xs py-2.5 px-3 rounded-lg glass-input" />
                      </div>
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Email address</label>
                        <input type="email" required placeholder="sienna@domain.com" className="w-full text-xs py-2.5 px-3 rounded-lg glass-input" />
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Inquiry Topic</label>
                        <select className="w-full text-xs py-2.5 px-3 rounded-lg bg-neutral-900 border border-white/15 text-white outline-none">
                          <option>Delivery Logistics & Tracking</option>
                          <option>Sizing & Outfit coordination</option>
                          <option>Electronics Warranty claims</option>
                          <option>Business Drops & Press relations</option>
                        </select>
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Message description</label>
                        <textarea required h-32 placeholder="Type details about your requirements here..." className="w-full text-xs py-2.5 px-3 rounded-lg glass-input min-h-[100px]"></textarea>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full glowing-button font-bold text-xs py-3 rounded-xl text-white cursor-pointer"
                    >
                      Log Support Ticket
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: AI COUTURE SCANNER PAGE */}
          {activePage === 'ai-stylist' && (
            <motion.div
              key="ai-stylist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AIOutfitAdviser
                products={products}
                onAddToCart={(p, qty, col, sz) => handleAddToCart(p, qty, col, sz)}
                onQuickView={(p) => setSelectedProduct(p)}
                wishlist={wishlist}
                onToggleWishlist={(p) => handleToggleWishlist(p)}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER component */}
      <Footer 
        onNavigate={(page) => setActivePage(page)} 
        onOpenChat={() => setIsChatOpen(true)} 
      />

      {/* CONVERSATIONAL AI SHOPPING ASSISTANT COMPONENT */}
      <AIChatBot
        onSelectProduct={(p) => {
          setSelectedProduct(p);
        }}
        onAddToCart={(p, qty) => {
          handleAddToCart(p, qty);
        }}
        isOpen={isChatOpen}
        onCloseToggle={() => setIsChatOpen(!isChatOpen)}
      />

      {/* DOCK SPECIFICATIONS DETAILS MODALS Overlay popup */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product, qty, color, size) => handleAddToCart(product, qty, color, size)}
          onToggleWishlist={(product) => handleToggleWishlist(product)}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onSelectSimilarProduct={(similar) => setSelectedProduct(similar)}
        />
      )}

      {/* SECURE CHECKOUT MULTI STEP WIZARD Overlay popup */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        subtotal={getCartSubtotal()}
        discountAmount={getDiscountAmount()}
        onPlaceOrder={(orderObj) => handlePlaceOrder(orderObj)}
        savedAddress={userProfile.addresses[0]}
      />

      {/* AMBIENT RETRO LOFI MUSIC CORE SYNTHESISER */}
      <LofiAuraMixer />



      {/* FULL SCREEN WELCOME LOGIN GATE ("GET STARTED") */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-tr from-[#1B1214] via-[#111111] to-[#221B19] flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Ambient luxury vector blurs - Rose gold and Beige Nude tones */}
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#B76E79]/15 rounded-full blur-[150px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#D6C3B3]/10 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '7s' }} />
            
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative w-full max-w-md bg-[#1C1618]/90 border border-white/10 rounded-3xl p-8 text-center text-white shadow-2xl backdrop-blur-xl"
            >
              {/* Luxury Logo Indicator */}
              <div className="mx-auto w-12 h-12 rounded-full bg-[#B76E79]/20 flex items-center justify-center border border-[#B76E79]/30 mb-5 animate-bounce" style={{ animationDuration: '3s' }}>
                <Sparkles className="w-5 h-5 text-[#B76E79]" />
              </div>

              {/* Title & Slogan */}
              <h1 className="font-serif italic font-bold text-4xl text-white tracking-tight uppercase">
                Trendzo
              </h1>
              <p className="text-[10px] text-[#B76E79] mt-2 font-mono uppercase tracking-widest font-black">
                Wear Your Vibe. Own Your Style.
              </p>

              <div className="my-5 border-b border-white/5 pb-3">
                <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
                  Welcome to Trendzo's luxury catalog. Establish your identity below to access the streetwear floor and unlock advanced custom coordinate tools.
                </p>
              </div>

              {/* Form entries */}
              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-[9px] font-mono tracking-widest uppercase text-neutral-400 mb-1.5 font-black">
                    1. STYLE HANDLE (FULL NAME)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={30}
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="e.g. Alexis Carter"
                    className="w-full text-xs font-semibold py-3 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#B76E79] outline-none placeholder-neutral-500 text-white transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono tracking-widest uppercase text-neutral-400 mb-1.5 font-black">
                    2. PREFERRED VIBE AESTHETIC
                  </label>
                  <div className="grid grid-cols-2 gap-3.5">
                    {[
                      { val: 'Haute Luxury', label: '👑 Haute Luxury' },
                      { val: 'Cyber Techwear', label: '⚙️ Cyber Techwear' },
                      { val: 'Minimal Premium', label: '🐚 Minimal Lux' },
                      { val: 'Streetwear Retro', label: '🛹 Street Retro' }
                    ].map((v) => (
                      <button
                        key={v.val}
                        type="button"
                        onClick={() => setInputPref(v.val)}
                        className={`py-2.5 px-3 rounded-lg border text-[10px] font-black uppercase text-center transition-all cursor-pointer ${
                          inputPref === v.val
                            ? 'bg-[#B76E79] border-[#B76E79] text-white shadow'
                            : 'bg-white/5 border-white/5 text-neutral-400 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit trigger button */}
                <button
                  type="button"
                  onClick={() => {
                    const finalName = inputName.trim() || 'VIP Trendsetter';
                    setUserProfile(prev => ({
                      ...prev,
                      name: finalName,
                      email: `${finalName.toLowerCase().replace(/\s+/g, '')}@trendzo.com`
                    }));
                    localStorage.setItem('trendzo_started', 'true');
                    setHasStarted(true);
                  }}
                  className="w-full mt-6 py-3.5 rounded-xl bg-[#B76E79] hover:bg-[#c97f8a] text-white font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-lg active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Confirm & Get Started
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 text-[9px] font-mono text-neutral-400 flex items-center justify-center gap-3">
                <span>SSL Secured</span>
                <span>•</span>
                <span>Original Wear Guarantee</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
