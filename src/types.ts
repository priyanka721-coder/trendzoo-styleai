/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProductCategory = 
  | 'Clothes'
  | 'Shoes'
  | 'Slippers'
  | 'Jewelry';

export interface Product {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  discountPrice?: number; // Price after discount, if any
  rating: number;
  reviewsCount: number;
  category: ProductCategory;
  image: string; // Primary image URL
  images: string[]; // Additional display gallery images
  specs: Record<string, string>; // Key-Value specifications
  stock: number;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isFlashSale?: boolean;
  colors?: string[];
  sizes?: string[];
}

export interface CartItem {
  id: string; // composite key: productId-color-size
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  minimumSpend?: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  date: string;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    color?: string;
    size?: string;
    image: string;
  }[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Returned';
  address: ShippingAddress;
  paymentMethod: string;
  trackingNumber?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: ShippingAddress[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}
