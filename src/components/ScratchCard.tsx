import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Copy, Check, RefreshCw, Zap } from 'lucide-react';

interface CouponVoucher {
  code: string;
  discountPercent: number;
  description: string;
  minimumSpend: number;
}

export default function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Handpicked high-value active promotionals
  const vouchers: CouponVoucher[] = [
    { code: 'FUTURE50', discountPercent: 50, description: 'Supercharged! Instantly slashes 50% off of tech devices or footwear.', minimumSpend: 150 },
    { code: 'SUPREME30', discountPercent: 30, description: 'Street elite! Restores 30% discount store-wide on apparel.', minimumSpend: 75 },
    { code: 'GENZ20', discountPercent: 20, description: 'Community ticket! Trims 20% off all modern drops.', minimumSpend: 0 }
  ];

  const [currentVoucher, setCurrentVoucher] = useState<CouponVoucher>(vouchers[0]);

  // Paint the initial scratching foil layer
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset dimensions based on card container
    canvas.width = canvas.parentElement?.clientWidth || 280;
    canvas.height = canvas.parentElement?.clientHeight || 180;

    // Draw solid holographic silver/platinum gradient block
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#CBD5E1'); // Slate 300
    grad.addColorStop(0.3, '#F1F5F9'); // Slate 100 (sheen)
    grad.addColorStop(0.5, '#94A3B8'); // Slate 400
    grad.addColorStop(0.7, '#E2E8F0'); // Slate 200
    grad.addColorStop(1, '#64748B'); // Slate 500

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply some stylish cybernetic grids/noise textures
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 40, canvas.height);
    }
    ctx.stroke();

    // Paint decorative CTA texts on top of metallic grey
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#1E293B';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH COATING WITH CURSOR', canvas.width / 2, canvas.height / 2 - 8);
    ctx.font = '9px monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText('⚡ REVEAL SECRET RARE KEY ⚡', canvas.width / 2, canvas.height / 2 + 10);

    setIsRevealed(false);
    setScratchedPercent(0);
  };

  // Re-render and resize correctly
  useEffect(() => {
    initCanvas();
    // Watch resize
    const handleResize = () => {
      initCanvas();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentVoucher]);

  const drawScratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Throttled computation of cleared pixels to save rendering steps
    checkScratchProgress(ctx, canvas.width, canvas.height);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    drawScratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    drawScratch(e.clientX, e.clientY);
  };

  const handleMouseUpOrLeave = () => {
    setIsScratching(false);
  };

  // Touch Support for mobile viewports
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) return;
    setIsScratching(true);
    const touch = e.touches[0];
    drawScratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching || e.touches.length === 0) return;
    const touch = e.touches[0];
    drawScratch(touch.clientX, touch.clientY);
  };

  // Calculate percentage of transparent pixels
  const checkScratchProgress = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const pixels = imgData.data;
      let cleared = 0;

      // Sample every 16th pixel to preserve low latency counts
      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) {
          cleared++;
        }
      }

      const totalSamples = pixels.length / 16;
      const pct = (cleared / totalSamples) * 100;
      setScratchedPercent(Math.round(pct));

      if (pct > 40 && !isRevealed) {
        setIsRevealed(true);
        // Automatically clear remaining pixels
        ctx.clearRect(0, 0, w, h);
      }
    } catch (err) {
      console.warn("Could not read canvas pixels", err);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentVoucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cycleNewVoucher = () => {
    const currentIndex = vouchers.findIndex(v => v.code === currentVoucher.code);
    const nextIndex = (currentIndex + 1) % vouchers.length;
    setCurrentVoucher(vouchers[nextIndex]);
    setCopied(false);
  };

  return (
    <div className="rounded-3xl bg-neutral-950 text-white p-6 md:p-8 border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl" id="interactive-scratch-card">
      <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Copy typography description */}
      <div className="space-y-4 max-w-sm text-left relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-[10px] font-bold font-mono tracking-widest uppercase">
          <Zap className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
          GAMIFIED INTERACTIVE REWARD
        </span>
        <h3 className="font-display font-black text-xl md:text-2xl text-white leading-tight">
          Holographic Scratch & Win Voucher
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Grip your pointer and clear the digital aluminum layer on the right side. Reveal extreme rebate keys valid on checkout right now!
        </p>

        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-2 flex items-center gap-2"
          >
            <button
              onClick={cycleNewVoucher}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-neutral-900 border border-white/5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset & Polish New Card
            </button>
          </motion.div>
        )}
      </div>

      {/* Interactive Scratch-off canvas frame with highly unique color backings */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-[320px] aspect-[16/10] rounded-2.5xl overflow-hidden bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-650 flex items-center justify-center p-[2px] shadow-lg border border-white/10"
      >
        {/* Underlay revealed content (Holographic shiny discount card) */}
        <div className="w-full h-full rounded-2.2xl bg-[#09090C] p-4 flex flex-col justify-between text-left relative overflow-hidden">
          {/* Animated matrix rays */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="text-[9px] font-mono font-extrabold uppercase text-pink-400 tracking-wider bg-pink-500/10 px-2 py-0.5 rounded">
                SECRET SPECIAL SLOT REVEALED
              </span>
              <h4 className="font-display font-black text-3xl text-white mt-1 border-b border-white/5 pb-1 block">
                {currentVoucher.discountPercent}% OFF
              </h4>
            </div>
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          </div>

          <div className="space-y-3 relative z-10">
            <div className="text-neutral-400 text-[10px] leading-relaxed">
              <span className="block font-semibold text-white">Requirement details:</span>
              {currentVoucher.description} {currentVoucher.minimumSpend > 0 ? `Requires spend over $${currentVoucher.minimumSpend}.` : 'No minimum spend!'}
            </div>

            {/* Key Copy element */}
            <div className="flex gap-1.5 pt-1">
              <div className="flex-1 bg-white/5 border border-white/10 py-1.5 px-3 rounded-lg flex items-center justify-between">
                <span className="font-mono font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 tracking-wider select-all uppercase">
                  {currentVoucher.code}
                </span>
                <span className="text-[9px] font-mono text-neutral-500">Unlocked</span>
              </div>
              <button
                onClick={handleCopyCode}
                className={`py-1.5 px-3 rounded-lg font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  copied 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Canvas mask overlay (Silver metal scraping) */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full cursor-crosshair z-20 touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
          />
        )}
      </div>

    </div>
  );
}
