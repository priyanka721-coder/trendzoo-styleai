/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mail, Phone, MapPin, MessageSquare, ShieldCheck, Heart, Github, Send } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenChat: () => void;
}

export default function Footer({ onNavigate, onOpenChat }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerCategories = [
    { label: "Designer Clothes", filter: "Clothes" },
    { label: "Elite Shoes", filter: "Shoes" },
    { label: "Premium Slippers", filter: "Slippers" },
    { label: "Luxury Jewelry", filter: "Jewelry" }
  ];

  const quickLinks = [
    { label: "About TRENDZOOO", page: "about" },
    { label: "Trending Deals", page: "offers" },
    { label: "Contact Support", page: "contact" },
    { label: "User Dashboard", page: "dashboard" }
  ];

  const policyLinks = [
    { label: "Free 30-Day Returns", info: "Easy swapping procedures" },
    { label: "Secure Payments SSL", info: "Encrypted direct proxy checkouts" },
    { label: "Authentic Designer Wear", info: "Certified curated quality" },
    { label: "24/7 Live AI Stylist Support", info: "Always available styling advice" }
  ];

  return (
    <footer id="trendzo-footer" className="bg-neutral-950 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Top Segment: Newsletter and Trust Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-white/5">
          {/* Newsletter Box */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Join the TRENDZOOO Club</h3>
            <p className="text-sm text-neutral-400">
              Get 20% off on your first order. Subscribe for limited edition drops, flash sale alerts, and AI styling updates!
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 max-w-sm">
              <input
                type="email"
                required
                placeholder="Enter email address"
                className="flex-1 text-xs py-2.5 px-4 rounded-xl glass-input placeholder-neutral-500"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 active:scale-95 transition-all duration-200 text-white cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick Value Propositions */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {policyLinks.map((p, idx) => (
              <div key={idx} className="flex gap-3 p-3 rounded-xl bg-white/2 border border-white/5 items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{p.label}</div>
                  <div className="text-[10px] text-neutral-500">{p.info}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Segment: Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 py-12 border-b border-white/5">
          
          {/* Company Intro */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => onNavigate('home')}>
              <span className="text-2xl font-black tracking-tighter italic bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity duration-300">
                TRENDZOOO.
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              TRENDZOOO is the definitive luxury fashion hub bringing premium streetwear, elite footwear, therapeutic slippers, and fine jewelry under one ultra-modern e-commerce checkout experience. Crafted specifically for style-conscious individuals.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenChat}
                className="flex items-center gap-2 text-xs font-bold py-2 px-4 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 active:scale-98 transition-all duration-200 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Live AI Chat
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-sm text-white tracking-widest uppercase mb-2">Categories</h4>
            <ul className="space-y-2">
              {footerCategories.map((c, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate('products')}
                    className="text-xs text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer text-left"
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-display font-bold text-sm text-white tracking-widest uppercase mb-2">Company</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-xs text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-sm text-white tracking-widest uppercase mb-2">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-neutral-400">100 Cyber Boulevard, Silicon Ridge, CA 94025</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-xs text-neutral-400">+1 (800) 873-6396</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-xs text-neutral-400">support@trendzooo.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Segment: Copyright & Secure Badges */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-xs text-neutral-500">
          <div>
            &copy; {currentYear} TRENDZOOO Inc. All rights reserved. Designed to wear your vibe.
          </div>
          
          {/* Secure Badges & Payment options */}
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-wider font-mono">Secure Gateway:</span>
            <div className="flex gap-2">
              <div className="px-1.5 py-0.5 bg-neutral-900 border border-white/5 rounded font-mono font-bold text-[9px] text-neutral-400">VISA</div>
              <div className="px-1.5 py-0.5 bg-neutral-900 border border-white/5 rounded font-mono font-bold text-[9px] text-neutral-400">MASTERCARD</div>
              <div className="px-1.5 py-0.5 bg-neutral-900 border border-white/5 rounded font-mono font-bold text-[9px] text-neutral-400">UPI</div>
              <div className="px-1.5 py-0.5 bg-neutral-900 border border-white/5 rounded font-mono font-bold text-[9px] text-neutral-400">PAYPAL</div>
              <div className="px-1.5 py-0.5 bg-neutral-900 border border-white/5 rounded font-mono font-bold text-[9px] text-neutral-400">COD</div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
