import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Store, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { BazaarLogo } from './BazaarLogo';

interface IntroSplashProps {
  onComplete: (selectedRole?: 'customer' | 'vendor') => void;
}

export const DynamicIntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [progress, setProgress] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: 'Traditional Mandis & Kirana Heritage',
      subtitle: 'Connecting local vegetable vendors, grain merchants & spice grinders directly to homes',
      icon: Store,
      tag: 'Local Bazaar',
    },
    {
      title: 'Modern Retail & Supermarket Brands',
      subtitle: 'Compare prices, discover hypermarket provisions & order branded FMCG essentials',
      icon: ShoppingBag,
      tag: 'Modern Retail',
    },
    {
      title: 'Smart AI Shopping & Weekly Budgeting',
      subtitle: 'Automated daily kitchen checklists, family meal planning & verified digital invoices',
      icon: Zap,
      tag: 'AI Intelligence',
    },
  ];

  useEffect(() => {
    // 5 seconds total duration, with updates every 50ms for buttery smooth progress
    const totalDurationMs = 5000;
    const intervalMs = 50;
    const step = (intervalMs / totalDurationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, intervalMs);

    // Countdown seconds display
    const countdown = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Slide cycler
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 1600);

    return () => {
      clearInterval(timer);
      clearInterval(countdown);
      clearInterval(slideInterval);
    };
  }, [onComplete, slides.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950 text-white overflow-hidden select-none">
      {/* Background Indian aesthetic illumination */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#43131F] via-[#1A0A0E] to-[#0A140F] opacity-90" />

      {/* Decorative radial glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-bazaar-saffron/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-bazaar-maroon-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Traditional Indian grid motifs */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#F4A340_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Center Cinematic Card */}
      <div className="relative z-10 max-w-xl w-full mx-4 p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center space-y-6">
        {/* Glowing App Emblem */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-bazaar-maroon via-bazaar-saffron to-amber-300 p-1 shadow-2xl shadow-bazaar-saffron/25 animate-fade-in flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-stone-900/90 flex items-center justify-center p-3">
              <BazaarLogo className="w-full h-full object-contain filter drop-shadow-md" />
            </div>
          </div>
          {/* Subtle spinning glow ring */}
          <div className="absolute -inset-2 rounded-3xl border border-bazaar-saffron/40 animate-spin [animation-duration:12s] pointer-events-none" />
        </div>

        {/* Brand Title with Golden-Maroon Shimmer */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bazaar-saffron/20 border border-bazaar-saffron/40 text-bazaar-saffron text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Bharat Commerce</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white">
            BAZAAR<span className="text-bazaar-saffron">ONE</span>
          </h1>

          <p className="text-sm sm:text-base font-semibold text-bazaar-cream-300 tracking-wide">
            "Your Local Bazaar. Your Modern Marketplace."
          </p>

          <p className="text-xs text-stone-400 font-medium max-w-md mx-auto pt-1">
            भारत का अपना डिजिटल बाज़ार • Bridging traditional kirana stores, fresh vegetable mandis and modern retail
          </p>
        </div>

        {/* Dynamic cycling feature slide */}
        <div className="w-full h-20 flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.04] border border-white/5 transition-all">
          <div className="flex items-center gap-2 text-xs font-bold text-bazaar-saffron">
            {React.createElement(slides[activeSlide].icon, { className: 'w-4 h-4' })}
            <span>{slides[activeSlide].title}</span>
          </div>
          <p className="text-[11px] text-stone-300 mt-1 max-w-sm line-clamp-2">
            {slides[activeSlide].subtitle}
          </p>
        </div>

        {/* 5-Second Circular/Bar Transition Indicator */}
        <div className="w-full space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-stone-400 font-medium px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Launching Experience in {secondsLeft}s...</span>
            </span>
            <span className="font-mono text-bazaar-saffron font-bold">{Math.round(progress)}%</span>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-bazaar-maroon via-bazaar-saffron to-emerald-400 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Direct Action Choices (Consumer vs Shop Owner or Skip) */}
        <div className="w-full pt-2 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => onComplete('customer')}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-bazaar-maroon to-bazaar-maroon-700 hover:from-bazaar-maroon-600 hover:to-bazaar-maroon-800 text-white font-bold text-xs shadow-lg shadow-bazaar-maroon/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <ShoppingBag className="w-4 h-4 text-bazaar-saffron" />
            <span>Enter as Shopper (ग्राहक)</span>
          </button>

          <button
            onClick={() => onComplete('vendor')}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Store className="w-4 h-4 text-bazaar-cream" />
            <span>Enter as Shop Owner (दुकानदार)</span>
          </button>
        </div>

        <button
          onClick={() => onComplete()}
          className="text-xs text-stone-400 hover:text-white transition-colors underline underline-offset-4"
        >
          Skip Introduction →
        </button>
      </div>
    </div>
  );
};
