/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, Search, User, Menu, X, Tag, Sparkles, HelpCircle } from 'lucide-react';
import { Product } from '../types';
import { products } from '../data';
import { formatPrice } from '../utils/currency';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  cartCount: number;
  wishlistCount: number;
  onSearchProduct: (product: Product) => void;
  onOpenProfile: () => void;
}

export default function Header({
  activePage,
  setActivePage,
  cartCount,
  wishlistCount,
  onSearchProduct,
  onOpenProfile
}: HeaderProps) {
  const [scrollSolid, setScrollSolid] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBagAnimating, setIsBagAnimating] = useState(false);

  // Trigger shopping cart shake/scale animation when items are added
  useEffect(() => {
    if (cartCount > 0) {
      setIsBagAnimating(true);
      const timer = setTimeout(() => setIsBagAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // Monitor scroll to transform transparent navbar into semi-solid glass
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrollSolid(true);
      } else {
        setScrollSolid(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter products based on search input
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = products.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
    setSearchResults(filtered.slice(0, 5)); // Limit to top 5 suggestions
  }, [searchQuery]);

  const handleSearchResultClick = (product: Product) => {
    onSearchProduct(product);
    setSearchQuery('');
    setSearchResults([]);
    setSearchFocused(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Shop' },
    { id: 'ai-stylist', label: 'AI Outfit Adviser' },
    { id: 'offers', label: 'Offers' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <>
      <header
        id="trendzo-header"
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrollSolid 
            ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200/80 py-3 shadow-xs' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            id="brand-logo"
            onClick={() => setActivePage('home')}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <span className="text-2xl font-black tracking-tighter italic bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity duration-300">
              TRENDZoo
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-${link.id}`}
                onClick={() => setActivePage(link.id)}
                className={`relative font-medium text-sm tracking-wide transition-colors duration-300 px-1 py-1 cursor-pointer ${
                  activePage === link.id ? 'text-neutral-950 font-bold' : 'text-neutral-500 hover:text-neutral-950'
                }`}
              >
                {link.label}
                {activePage === link.id && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 to-purple-600"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Center Search Bar with Dynamic Suggestions */}
          <div className="hidden lg:block relative flex-1 max-w-sm" id="search-container">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                id="search-input-desktop"
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search clothes, shoes, jewelry..."
                className="w-full text-xs font-medium py-2 pl-9 pr-4 rounded-xl bg-white border border-neutral-200 outline-none focus:border-blue-500 placeholder-neutral-400 text-neutral-900"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            </div>

            {/* suggestions drop-down */}
            <AnimatePresence>
              {searchFocused && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 top-full mt-2 w-full rounded-xl bg-white p-2 shadow-2xl z-50 border border-neutral-200"
                >
                  <div className="text-[10px] font-mono tracking-widest text-neutral-400 px-3 py-1 uppercase">
                    Smart Suggestions
                  </div>
                  <div className="divide-y divide-neutral-100">
                    {searchResults.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSearchResultClick(p)}
                        className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg cursor-pointer transition-colors duration-200"
                      >
                        <img 
                          referrerPolicy="no-referrer" 
                          src={p.image} 
                          alt={p.title} 
                          className="w-10 h-10 rounded-md object-cover flex-shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-neutral-900 truncate">{p.title}</div>
                          <div className="text-[10px] text-neutral-500 capitalize">{p.category}</div>
                        </div>
                        <div className="text-xs font-bold text-blue-600">
                          {formatPrice(p.discountPrice || p.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Wishlist Button */}
            <button
              id="wishlist-header-btn"
              onClick={() => setActivePage('dashboard')}
              aria-label="Wishlist"
              className="relative p-2 text-neutral-500 hover:text-neutral-950 transition-colors duration-200 cursor-pointer"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-purple-600 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              id="cart-header-btn"
              onClick={() => setActivePage('cart')}
              aria-label="Shopping Cart"
              className="relative p-2 text-neutral-500 hover:text-neutral-950 transition-colors duration-200 cursor-pointer"
            >
              <motion.div
                animate={isBagAnimating ? {
                  scale: [1, 1.3, 0.9, 1.15, 1],
                  rotate: [0, -12, 12, -8, 8, 0],
                } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.div>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-600 text-[9px] font-bold text-white flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Profile Dashboard Button */}
            <button
              id="profile-header-btn"
              onClick={onOpenProfile}
              aria-label="User Dashboard"
              className="p-2 text-neutral-500 hover:text-neutral-950 transition-colors duration-200 cursor-pointer flex items-center gap-1"
            >
              <User className="w-5 h-5" />
              <span className="hidden lg:inline text-xs font-medium">Dashboard</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-500 hover:text-neutral-950 transition-colors duration-200 md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation Hamburger */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[60px] z-30 bg-white md:hidden p-6 flex flex-col justify-between shadow-2xl border-t border-neutral-100"
          >
            <div className="space-y-6">
              {/* Mobile Search input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full text-xs py-3 pl-10 pr-4 rounded-xl bg-neutral-50 border border-neutral-200 outline-none text-neutral-900 placeholder-neutral-400"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />

                {/* Mobile instant search outcome */}
                {searchResults.length > 0 && (
                  <div className="absolute left-0 top-full mt-2 w-full rounded-xl bg-white p-2 z-50 shadow-2xl max-h-[250px] overflow-y-auto border border-neutral-200">
                    {searchResults.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          handleSearchResultClick(p);
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg cursor-pointer"
                      >
                        <img referrerPolicy="no-referrer" src={p.image} alt={p.title} className="w-8 h-8 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-semibold text-neutral-900 truncate">{p.title}</span>
                          <span className="block text-[10px] text-neutral-500 font-mono">{formatPrice(p.discountPrice || p.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Navigation links list */}
              <div className="space-y-4">
                <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                  Explore Menu
                </div>
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActivePage(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left font-display font-medium text-lg py-2 transition-colors duration-200 ${
                      activePage === link.id ? 'text-blue-600 font-bold' : 'text-neutral-800'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Promo banner inline mobile menu */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">First order discount</div>
                  <div className="text-[10px] text-neutral-500">Unlock 20% flat rebate</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setActivePage('offers');
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold py-2 px-3 rounded-lg bg-neutral-950 text-white hover:bg-neutral-850 hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                Code: GENZ20
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
