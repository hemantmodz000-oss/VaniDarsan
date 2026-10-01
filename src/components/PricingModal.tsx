import React, { useState } from 'react';
import { X, Check, Sparkles, Zap, Crown, Shield, CreditCard, ArrowRight } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isProUser: boolean;
  onUpgradeToPro: () => void;
}

const INSTAGRAM_URL = 'https://www.instagram.com/hemant_yt__?stkn=cWlqdjM4emwyZmUw';

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  isProUser,
  onUpgradeToPro,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSimulatedCheckout = (tierName: string) => {
    onUpgradeToPro();
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0f1118] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30">
                Subscription & Commercial License
              </span>
              {isProUser && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  PRO ACTIVATED
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-cinzel mt-1">
              Vaani Darshan Membership Plans
            </h3>
            <p className="text-xs text-neutral-400">
              Scale from personal creation to commercial YouTube/Reel monetization & agency voiceovers
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {checkoutSuccess && (
          <div className="my-3 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Success! Your Pro Creator membership is now activated. Enjoy unlimited priority voice generation!</span>
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex justify-center my-4">
          <div className="bg-neutral-950/90 p-1 rounded-xl border border-white/10 flex items-center gap-1 text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Yearly (Save 30%)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 font-bold">
                HOT
              </span>
            </button>
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto pr-1 flex-1 py-1">
          {/* Plan 1: Free Starter */}
          <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Free Starter</span>
              <div className="mt-2 mb-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">₹0</span>
                <span className="text-xs text-neutral-500"> / forever</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Great for testing and casual listening to Hindi philosophy and quotes.
              </p>

              <ul className="text-xs space-y-2 text-neutral-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Standard Daily Voice Limits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Access to all 15+ Core Personas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Standard .WAV Download</span>
                </li>
                <li className="flex items-center gap-2 text-neutral-500">
                  <X className="w-3.5 h-3.5" />
                  <span>Commercial Rights for YouTube/Reels</span>
                </li>
              </ul>
            </div>

            <button
              disabled
              className="w-full py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-semibold text-neutral-400"
            >
              Current Active Plan
            </button>
          </div>

          {/* Plan 2: Pro Creator (Recommended) */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-b from-amber-950/40 via-neutral-900/90 to-[#10121a] border-2 border-amber-500/60 shadow-xl shadow-amber-500/10 flex flex-col justify-between space-y-4">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md">
              Most Popular
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Crown className="w-4 h-4 fill-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Pro Creator</span>
              </div>

              <div className="mt-2 mb-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {billingCycle === 'monthly' ? '₹299' : '₹199'}
                </span>
                <span className="text-xs text-neutral-400"> / month</span>
                {billingCycle === 'yearly' && (
                  <p className="text-[10px] text-emerald-400 font-medium">Billed annually (₹2,388/yr)</p>
                )}
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                Full power for YouTube creators, podcasters, motivational channels & audiobook makers.
              </p>

              <ul className="text-xs space-y-2 text-neutral-200">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-white">Unlimited Voiceover Generations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Commercial Monetization Rights (100% Royalty Free)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>High-Priority GPU Speech Synthesis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lossless Studio HD 24kHz .WAV Master</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Philosophy Script Generator (Unlimited)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSimulatedCheckout('Pro Creator')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer hover:scale-102"
            >
              <span>{isProUser ? 'Renew Pro Plan' : 'Upgrade to Pro'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Plan 3: Studio / Agency */}
          <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Studio & Agency</span>
              <div className="mt-2 mb-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {billingCycle === 'monthly' ? '₹999' : '₹799'}
                </span>
                <span className="text-xs text-neutral-500"> / month</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                For production houses, marketing agencies, and automated content pipelines.
              </p>

              <ul className="text-xs space-y-2 text-neutral-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Everything in Pro Creator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Multi-Speaker Screenplay Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>API Access Key for Batch Synthesis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Custom Persona Acoustic Voice Design</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSimulatedCheckout('Studio & Agency')}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Select Studio
            </button>
          </div>
        </div>

        {/* Footer info & Contact */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-neutral-400">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure Checkout • UPI, GooglePay, Cards & NetBanking via Razorpay / Stripe</span>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
          >
            Custom Enterprise Inquiries with Hemant →
          </a>
        </div>
      </div>
    </div>
  );
};
