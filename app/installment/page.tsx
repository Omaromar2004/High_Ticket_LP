'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import InstallmentForm from '@/components/InstallmentForm';
import {
  Clock,
  Sparkles,
  ChevronDown,
  Check,
  ShieldCheck,
  Lock
} from 'lucide-react';

export default function InstallmentPage() {
  const [selectedPlan, setSelectedPlan] = useState<'installment' | 'full'>('installment');
  const [timeLeft, setTimeLeft] = useState<{ hours: string; mins: string; secs: string }>({
    hours: '18',
    mins: '42',
    secs: '19',
  });

  const [showDeliverables, setShowDeliverables] = useState(false);

  // 24-hour scarcity countdown
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = Math.max(0, endOfDay.getTime() - now.getTime());

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: String(h).padStart(2, '0'),
        mins: String(m).padStart(2, '0'),
        secs: String(s).padStart(2, '0'),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0B09] text-[#F5EFE6] selection:bg-[#E6CA85] selection:text-[#0A0908] relative flex flex-col justify-between py-6 px-4 sm:px-6 overflow-x-hidden">
      {/* Subtle Islamic Geometric / Girih Star Pattern Background with Low Transparency */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.09] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23E6CA85' stroke-width='0.75'%3E%3Cpath d='M40 0 L52 28 L80 40 L52 52 L40 80 L28 52 L0 40 L28 28 Z'/%3E%3Cpath d='M0 0 L15 15 M80 0 L65 15 M80 80 L65 65 M0 80 L15 65'/%3E%3Ccircle cx='40' cy='40' r='12' stroke='%23E6CA85' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      ></div>

      {/* Warm Ambient Glow Highlights */}
      <div
        className="fixed pointer-events-none rounded-full blur-[100px] opacity-40 z-0"
        style={{
          width: '550px',
          height: '550px',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(230, 202, 133, 0.35) 0%, transparent 70%)',
        }}
      ></div>
      <div
        className="fixed pointer-events-none rounded-full blur-[90px] opacity-25 z-0"
        style={{
          width: '400px',
          height: '400px',
          bottom: '0%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
        }}
      ></div>

      {/* Main Centered Minimalist Card Layout */}
      <div className="w-full max-w-[430px] mx-auto my-auto relative z-10">
        {/* Top Islamic Invocation & Logo Header */}
        <div className="text-center mb-5 space-y-3">
          <p className="ayah text-base sm:text-lg text-[#E6CA85] opacity-95 tracking-wide drop-shadow-sm">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>

          {/* FIQRTAALIM Official Logo */}
          <div className="flex justify-center items-center my-2">
            <div className="bg-[#FFFDF8] px-4 py-2 rounded-xl shadow-lg border border-[#E6CA85]/40 inline-flex items-center justify-center">
              <img
                src="/logo.png"
                alt="FIQRTAALIM Logo"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#E6CA85]/40 bg-[#E6CA85]/15 shadow-[0_0_15px_rgba(230,202,133,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-[10px] font-bold text-[#E6CA85] uppercase tracking-wider">
              24-Hour Special Offer · Limited Seats
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#FFFDF8] tracking-tight">
            Partnership Programme
          </h1>
          <p className="text-xs text-[#F5EFE6]/80 max-w-xs mx-auto leading-relaxed">
            Launch your Halal e-commerce brand with{' '}
            <strong className="text-[#E6CA85]">₹25,000 in free opening stock</strong> and 1-on-1 mentorship.
          </p>
        </div>

        {/* The Focused Checkout Card */}
        <div className="w-full rounded-2xl border border-[#E6CA85]/35 bg-[#120F0B]/95 backdrop-blur-xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9),0_0_35px_-5px_rgba(230,202,133,0.2)] overflow-hidden mb-4">
          {/* Top Deal Timer Strip */}
          <div className="bg-[#1C1712] border-b border-[#E6CA85]/25 py-2.5 px-4 flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#E6CA85] uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#E6CA85]" /> Special Offer Ends In
            </span>
            <div className="flex items-baseline gap-1 font-mono font-bold text-sm tabular-nums text-[#FFFDF8]">
              <span className="bg-[#0C0B09] px-1.5 py-0.5 rounded border border-[#E6CA85]/30">
                {timeLeft.hours}
              </span>
              <span className="text-[#E6CA85]">:</span>
              <span className="bg-[#0C0B09] px-1.5 py-0.5 rounded border border-[#E6CA85]/30">
                {timeLeft.mins}
              </span>
              <span className="text-[#E6CA85]">:</span>
              <span className="bg-[#0C0B09] px-1.5 py-0.5 rounded border border-[#E6CA85]/30 text-[#10B981]">
                {timeLeft.secs}
              </span>
            </div>
          </div>

          {/* Clean Pricing Breakdown: Only Amount to Pay Now */}
          <div className="p-4 sm:p-5 space-y-4">
            <div className="bg-[#18140F] p-3.5 rounded-xl border border-[#E6CA85]/20 shadow-inner flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#E6CA85] uppercase font-bold tracking-tight block">
                  Amount to Pay Now
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-[#FFFDF8] tracking-tight">
                  ₹{selectedPlan === 'installment' ? '15,000' : '29,899'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#10B981] font-bold uppercase tracking-wider block">
                  {selectedPlan === 'installment' ? 'Half Payment' : 'Full Payment'}
                </span>
                <span className="text-[11px] text-[#F5EFE6]/60">
                  {selectedPlan === 'installment' ? 'Confirms Seat & Stock' : 'Complete 1-Time Access'}
                </span>
              </div>
            </div>

            {/* Interactive Form Component with Plan Selector */}
            <div className="pt-1 border-t border-[#E6CA85]/20">
              <InstallmentForm
                selectedPlan={selectedPlan}
                onPlanChange={setSelectedPlan}
              />
            </div>
          </div>
        </div>

        {/* Collapsible Value Summary: What's included in this Amanah */}
        <div className="w-full rounded-xl border border-[#E6CA85]/25 bg-[#14100C]/80 p-3.5 mb-4 text-xs shadow-md">
          <button
            type="button"
            onClick={() => setShowDeliverables(!showDeliverables)}
            className="w-full flex items-center justify-between text-[#E6CA85] font-bold text-xs transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E6CA85]" /> What is included with your seat?
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 text-[#E6CA85] ${
                showDeliverables ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showDeliverables && (
            <div className="mt-3 pt-3 border-t border-[#E6CA85]/20 space-y-2 text-[#F5EFE6]/85 text-[11px] leading-relaxed animate-in fade-in duration-200">
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5 font-bold" />
                <span>
                  <strong className="text-[#FFFDF8]">₹25,000 Free Physical Stock:</strong> 25 Tayammum Kits + 25 Activity Books + 20 Dua Sticker Sets + Branded Packaging dispatched to your address.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5 font-bold" />
                <span>
                  <strong className="text-[#FFFDF8]">1-on-1 Dedicated Mentor:</strong> Alternate-day screen-share sessions where you build every part yourself.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5 font-bold" />
                <span>
                  <strong className="text-[#FFFDF8]">Complete Store Setup:</strong> Shopify store build, Savings account Razorpay gateway, and Shiprocket volume shipping rates.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5 font-bold" />
                <span>
                  <strong className="text-[#FFFDF8]">Formal Signed Legal Agreement:</strong> Signed by CEO Mohammed Omar with 80% refund protection.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Islamic Quote & Return Link */}
        <div className="text-center space-y-2 text-[11px] text-[#F5EFE6]/60">
          <p className="ayah text-sm text-[#E6CA85] opacity-90">
            وَأَحَلَّ ٱللَّهُ ٱلْبَيْعَ
          </p>
          <p className="text-[10px] text-[#F5EFE6]/50">
            &ldquo;And Allah has permitted trade&rdquo; · Al-Baqarah 2:275
          </p>
          <p className="pt-1">
            <Link href="/" className="text-[#E6CA85] hover:underline font-medium">
              ← Return to Main Page
            </Link>
          </p>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="text-center text-[10px] text-[#F5EFE6]/40 pt-6">
        © {new Date().getFullYear()} FIQRTAALIM · 100% Halal E-Commerce Partnership
      </footer>
    </div>
  );
}
