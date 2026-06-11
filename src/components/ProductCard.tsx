/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isWishlisted
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      id={`product-card-${product.id}`}
      layout
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl bg-white border border-neutral-200/80 overflow-hidden flex flex-col justify-between h-full transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_15px_30px_-15px_rgba(59,130,246,0.12)]"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-square overflow-hidden bg-neutral-50 cursor-pointer" onClick={() => onQuickView(product)}>
        
        {/* Promotional Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.isFlashSale && (
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-red-500 text-white shadow-md">
              Flash Offer
            </span>
          )}
          {product.isBestSeller && (
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-purple-600 text-white shadow-md">
              Best Seller
            </span>
          )}
          {product.isTrending && (
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-blue-500 text-white shadow-md">
              Trending
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 z-10 text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow">
            -{discountPercent}%
          </div>
        )}

        {/* Product Image */}
        <img
          referrerPolicy="no-referrer"
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Hover Micro-Actions Overlay */}
        <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            id={`quickview-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            title="Quick View"
          >
            <Eye className="w-5 h-5" />
          </button>
          
          <button
            id={`addcart-instant-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, 1);
            }}
            className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Heart Button */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute bottom-3 right-3 p-2 rounded-xl backdrop-blur-md z-10 border hover:scale-105 active:scale-95 transition-all duration-250 cursor-pointer ${
            isWishlisted 
              ? 'bg-purple-600 border-purple-500 text-white' 
              : 'bg-white/80 border-neutral-200 text-neutral-600 hover:text-neutral-900 shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Content Segment */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Category */}
          <span className="text-[10px] font-mono text-neutral-500 tracking-wider uppercase">
            {product.category}
          </span>

          {/* Product Title */}
          <h3 className="font-display font-medium text-sm text-neutral-900 group-hover:text-blue-600 cursor-pointer transition-colors duration-200 line-clamp-1" onClick={() => onQuickView(product)}>
            {product.title}
          </h3>

          {/* Star Ratings */}
          <div className="flex items-center gap-1">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-3 h-3 ${
                    idx < Math.floor(product.rating) 
                      ? 'fill-current' 
                      : 'text-neutral-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing Segment */}
        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-blue-600 font-mono">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="text-[10px] text-neutral-400 line-through font-mono">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-sm font-extrabold text-neutral-900 font-mono">
                {formatPrice(product.price)}
              </span>
            )}
            
            {/* Inventory Status indicator */}
            <span className={`text-[9px] font-medium mt-0.5 ${
              product.stock < 10 
                ? 'text-red-500' 
                : product.stock < 20 
                  ? 'text-amber-500 animate-pulse' 
                  : 'text-neutral-500'
            }`}>
              {product.stock === 0 
                ? 'Out of Stock' 
                : product.stock < 15 
                  ? `Only ${product.stock} left!` 
                  : 'In Stock'
              }
            </span>
          </div>

          {/* Quick-add bag action */}
          <button
            id={`addcart-btn-${product.id}`}
            onClick={() => onAddToCart(product, 1)}
            disabled={product.stock === 0}
            className={`flex items-center gap-1 text-[10px] font-bold py-1.5 px-3 rounded-lg border transition-all duration-200 cursor-pointer ${
              product.stock === 0
                ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'border-neutral-200 text-neutral-800 hover:bg-neutral-950 hover:text-white hover:border-neutral-950'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            + Bag
          </button>
        </div>
      </div>
    </motion.div>
  );
}
