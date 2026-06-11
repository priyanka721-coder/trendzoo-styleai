/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, CreditCard, Landmark, Truck, Check, HelpCircle, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem, ShippingAddress, Order } from '../types';
import { formatPrice } from '../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  discountAmount: number;
  onPlaceOrder: (order: Order) => void;
  savedAddress?: ShippingAddress;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  discountAmount,
  onPlaceOrder,
  savedAddress
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Address State
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: savedAddress?.fullName || '',
    addressLine1: savedAddress?.addressLine1 || '',
    addressLine2: savedAddress?.addressLine2 || '',
    city: savedAddress?.city || '',
    state: savedAddress?.state || '',
    zipCode: savedAddress?.zipCode || '',
    country: savedAddress?.country || 'United States',
    phone: savedAddress?.phone || ''
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Cards');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [upiId, setUpiId] = useState('');

  // Shipping details lookup
  const shippingFee = subtotal > 50 ? 0 : 9.99;
  const taxAmount = Math.round((subtotal * 0.08) * 100) / 100;
  const grandTotal = Math.round((subtotal - discountAmount + shippingFee + taxAmount) * 100) / 100;

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.addressLine1 || !formData.city || !formData.zipCode || !formData.phone) {
        alert("Please completely fill all mandatory shipping address items.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (paymentMethod === 'Credit/Debit Cards' && (!cardNumber || !cardExpiry || !cardCVV)) {
        alert("Please configure bank card credentials.");
        return;
      }
      if (paymentMethod === 'UPI' && !upiId) {
        alert("Please set a valid UPI index (e.g. user@oauth).");
        return;
      }
      setStep(3);
    }
  };

  const handlePlaceOrder = () => {
    // Compile active order
    const completedOrder: Order = {
      id: `TR-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      items: cartItems.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.discountPrice || item.product.price,
        quantity: item.quantity,
        color: item.selectedColor,
        size: item.selectedSize,
        image: item.product.image
      })),
      subtotal: subtotal,
      discountAmount: discountAmount,
      shippingFee: shippingFee,
      total: grandTotal,
      status: 'Processing',
      address: formData,
      paymentMethod: paymentMethod,
      trackingNumber: `TZ-${Math.floor(10000000 + Math.random() * 90000000)}`
    };

    onPlaceOrder(completedOrder);
    setStep(1); // resettable
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="checkout-modal-container"
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md"
        />

        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-4xl rounded-3xl glass-panel border border-white/10 shadow-3xl overflow-hidden text-white mx-auto flex flex-col md:flex-row h-full min-h-[500px]"
          >
            {/* Close button */}
            <button
              id="checkout-close-btn"
              onClick={onClose}
              className="absolute top-5 right-5 z-20 p-2 rounded-full bg-neutral-900 border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* LEFT SIDE: Active Checkout Form Wizard (Span 7) */}
            <div className="flex-1 p-6 md:p-8 space-y-6">
              
              {/* Wizard Nav Trackers */}
              <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-neutral-800 text-neutral-500'}`}>1</span>
                  <span className={`text-[11px] font-bold ${step === 1 ? 'text-white' : 'text-neutral-500'}`}>Shipping</span>
                </div>
                <div className="h-[1px] w-8 bg-neutral-800" />
                <div className="flex items-center gap-1.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-neutral-800 text-neutral-500'}`}>2</span>
                  <span className={`text-[11px] font-bold ${step === 2 ? 'text-white' : 'text-neutral-500'}`}>Payment</span>
                </div>
                <div className="h-[1px] w-8 bg-neutral-800" />
                <div className="flex items-center gap-1.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-neutral-800 text-neutral-500'}`}>3</span>
                  <span className={`text-[11px] font-bold ${step === 3 ? 'text-white' : 'text-neutral-500'}`}>Confirm</span>
                </div>
              </div>

              {/* STEP 1: SHIPPING ADDRESS */}
              {step === 1 && (
                <div className="space-y-4" id="address-step-pane">
                  <h2 className="font-display font-bold text-lg text-white">Delivery Coordinates</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        id="checkout-fullname"
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        placeholder="John Doe"
                        className="w-full text-xs py-2.5 px-3 rounded-xl glass-input"
                      />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Street Address</label>
                      <input
                        type="text"
                        value={formData.addressLine1}
                        id="checkout-address1"
                        onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                        required
                        placeholder="Apt, Suite, Street name"
                        className="w-full text-xs py-2.5 px-3 rounded-xl glass-input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        id="checkout-city"
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        placeholder="San Jose"
                        className="w-full text-xs py-2.5 px-3 rounded-xl glass-input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">State / Region</label>
                      <input
                        type="text"
                        value={formData.state}
                        id="checkout-state"
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                        placeholder="CA"
                        className="w-full text-xs py-2.5 px-3 rounded-xl glass-input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">ZIP / Code</label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        id="checkout-zip"
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        required
                        placeholder="95112"
                        className="w-full text-xs py-2.5 px-3 rounded-xl glass-input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Phone</label>
                      <input
                        type="text"
                        value={formData.phone}
                        id="checkout-phone"
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        placeholder="+1-555-0158"
                        className="w-full text-xs py-2.5 px-3 rounded-xl glass-input"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleNextStep}
                    className="w-full font-bold py-2.5 rounded-xl bg-blue-500 hover:opacity-95 text-white mt-6 cursor-pointer flex items-center justify-center gap-1"
                  >
                    Configure Payment
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: PAYMENT CHOICES */}
              {step === 2 && (
                <div className="space-y-4" id="payment-step-pane">
                  <h2 className="font-display font-bold text-lg text-white">Secure Encrypted Gateways</h2>
                  
                  {/* Grid selector buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {['Credit/Debit Cards', 'UPI', 'Net Banking', 'Net Wallets', 'Cash on Delivery'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`text-xs py-2.5 px-3 rounded-xl border font-bold text-left cursor-pointer transition-all ${
                          paymentMethod === method 
                            ? 'bg-blue-600/10 text-blue-400 border-blue-500/40 shadow-sm' 
                            : 'bg-neutral-900 border-white/5 hover:border-white/15'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic choices detail entries */}
                  {paymentMethod === 'Credit/Debit Cards' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4111 2222 3333 4444"
                          className="w-full text-xs py-2.5 px-3 rounded-xl glass-input font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="08/29"
                            className="w-full text-xs py-2.5 px-3 rounded-xl glass-input font-mono"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">CVV</label>
                          <input
                            type="password"
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value)}
                            maxLength={3}
                            placeholder="***"
                            className="w-full text-xs py-2.5 px-3 rounded-xl glass-input font-mono"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === 'UPI' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 pt-2">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">UPI Identifier</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="john.doe@okaxis"
                        className="w-full text-xs py-3 px-3 rounded-xl glass-input"
                      />
                    </motion.div>
                  )}

                  {paymentMethod === 'Cash on Delivery' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>An extra processing fee of {formatPrice(3)} is waived. Standard COD transactions are validated over phone OTP dispatch.</span>
                    </motion.div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="w-1/3 py-2.5 text-xs font-bold rounded-xl bg-neutral-900 border border-white/10 hover:border-white/20 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-blue-500 hover:opacity-95 cursor-pointer flex items-center justify-center gap-1"
                    >
                      Verify Order
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: ORDER REVIEW AND SUBMIT */}
              {step === 3 && (
                <div className="space-y-4" id="review-step-pane">
                  <h2 className="font-display font-bold text-lg text-white">Final Trust Inspection</h2>
                  
                  <div className="divide-y divide-white/5 space-y-3 leading-relaxed text-xs">
                    <div className="pb-3 text-neutral-400">
                      <span className="block font-bold text-white mb-1 uppercase tracking-wider text-[10px] font-mono">Recipient Details:</span>
                      <div>{formData.fullName} ({formData.phone})</div>
                      <div>{formData.addressLine1}, {formData.city}, {formData.state} - {formData.zipCode}</div>
                    </div>
                    <div className="py-3 text-neutral-400">
                      <span className="block font-bold text-white mb-1 uppercase tracking-wider text-[10px] font-mono">Secured Payment routing:</span>
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-blue-400" />
                        {paymentMethod} Gateway
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-neutral-300 flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span>Clicking Place Order commits your address routing safely. Transaction is fully insured.</span>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="w-1/3 py-2.5 text-xs font-bold rounded-xl bg-neutral-900 border border-white/10 hover:border-white/20 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-1 glowing-button py-2.5 text-xs font-bold rounded-xl text-white cursor-pointer"
                    >
                      Place Secure Order ({formatPrice(grandTotal)})
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT SIDE: Visual Order Recap column (Span 5) */}
            <div className="w-full md:w-[320px] bg-neutral-950/50 p-6 md:p-8 border-l border-white/5 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-sm text-neutral-400 mb-4 block uppercase tracking-widest">Order Summary</h3>
                
                {/* Scrollable grid representing checkout bag items */}
                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs">
                      <img referrerPolicy="no-referrer" src={item.product.image} alt={item.product.title} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white truncate">{item.product.title}</div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">Qty: {item.quantity} {item.selectedColor ? `| ${item.selectedColor}` : ''}</div>
                      </div>
                      <div className="font-semibold text-white font-mono">{formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Computations segment */}
              <div className="mt-6 pt-4 border-t border-white/5 space-y-2 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-white font-mono">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Coupon Promo rebate</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-white font-mono">{shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-white font-mono">{formatPrice(taxAmount)}</span>
                </div>
                <div className="h-[1px] bg-neutral-800 my-2" />
                <div className="flex justify-between text-white text-sm font-extrabold">
                  <span>Total Amount</span>
                  <span className="text-blue-400 font-mono">{formatPrice(grandTotal)}</span>
                </div>
              </div>

            </div>

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
