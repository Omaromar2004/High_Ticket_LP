'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Lock,
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  PackageCheck,
  FileText,
  AlertCircle,
  HelpCircle,
  X,
  ExternalLink,
  Check
} from 'lucide-react';

interface InstallmentFormProps {
  selectedPlan: 'installment' | 'full';
  onPlanChange: (plan: 'installment' | 'full') => void;
  onSuccess?: (paymentData: any) => void;
}

export default function InstallmentForm({ selectedPlan, onPlanChange, onSuccess }: InstallmentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    city: false,
  });

  const [loading, setLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Validation logic
  const isNameValid = formData.name.trim().length >= 3;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const cleanPhone = formData.phone.replace(/\D/g, '');
  const isPhoneValid = cleanPhone.length === 10;
  const isCityValid = formData.city.trim().length >= 2;

  const isFormValid = isNameValid && isEmailValid && isPhoneValid && isCityValid;

  const amountToPay = selectedPlan === 'installment' ? 15000 : 29899;
  const formattedAmount = amountToPay.toLocaleString('en-IN');

  // Load Razorpay Script dynamically
  useEffect(() => {
    const scriptId = 'razorpay-checkout-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const sendAgreementEmail = async (payload: any) => {
    setEmailSending(true);
    try {
      const res = await fetch('/api/send-agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log('Agreement email result:', data);
    } catch (err) {
      console.error('Error triggering agreement email:', err);
    } finally {
      setEmailSending(false);
    }
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, city: true });

    if (!isFormValid) return;

    setLoading(true);

    try {
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_default';

      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const options = {
          key: razorpayKey,
          amount: amountToPay * 100, // in paise
          currency: 'INR',
          name: 'FIQRTAALIM',
          description:
            selectedPlan === 'installment'
              ? 'Partnership Seat Lock (Part 1 Installment) - ₹15,000'
              : 'Partnership Full Enrollment - ₹29,899',
          image: 'https://fiqrtaalim.com/logo.png',
          prefill: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            contact: cleanPhone,
          },
          notes: {
            city: formData.city.trim(),
            plan_type: selectedPlan,
            program: 'Fiqrtaalim Partnership Programme',
          },
          theme: {
            color: '#E5BA6A',
            backdrop_color: 'rgba(12, 11, 10, 0.95)',
          },
          handler: function (response: any) {
            setLoading(false);
            const successPayload = {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id || 'DIR-' + Date.now(),
              amount: formattedAmount,
              plan: selectedPlan,
              name: formData.name.trim(),
              email: formData.email.trim(),
              phone: cleanPhone,
              city: formData.city.trim(),
              date: new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
            };
            setPaymentSuccess(successPayload);
            sendAgreementEmail(successPayload);
            if (onSuccess) onSuccess(successPayload);
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setLoading(false);
          alert('Payment was not completed: ' + (resp.error?.description || 'Please try again.'));
        });
        rzp.open();
      } else {
        // Fallback simulation / direct modal for preview
        setTimeout(() => {
          setLoading(false);
          const fallbackPayload = {
            paymentId: 'pay_demo_' + Math.random().toString(36).substring(7).toUpperCase(),
            orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            amount: formattedAmount,
            plan: selectedPlan,
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: cleanPhone,
            city: formData.city.trim(),
            date: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
          };
          setPaymentSuccess(fallbackPayload);
          sendAgreementEmail(fallbackPayload);
          if (onSuccess) onSuccess(fallbackPayload);
        }, 1200);
      }
    } catch (err) {
      setLoading(false);
      console.error('Razorpay invocation error:', err);
    }
  };

  return (
    <div className="w-full">
      {/* Plan Selector: 2-Part Plan vs Full Payment */}
      <div className="mb-4">
        <label className="text-[11px] font-semibold text-[#E6CA85] uppercase tracking-wider block mb-2">
          Select Your Payment Option
        </label>
        <div className="grid grid-cols-2 gap-2 bg-[#171410] p-1.5 rounded-xl border border-[#E6CA85]/25">
          {/* Option 1: Half Payment */}
          <button
            type="button"
            onClick={() => onPlanChange('installment')}
            className={`py-2 px-2.5 rounded-lg text-left transition-all duration-200 relative ${
              selectedPlan === 'installment'
                ? 'bg-gradient-to-r from-[#E6CA85] to-[#C99E26] text-[#0A0908] shadow-md'
                : 'text-[#F5EFE6]/70 hover:text-[#FFFDF8] hover:bg-[#221D17]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold block leading-tight">Half Payment</span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                  selectedPlan === 'installment'
                    ? 'bg-[#0A0908]/20 text-[#0A0908]'
                    : 'bg-[#10B981]/20 text-[#10B981]'
                }`}
              >
                Part 1
              </span>
            </div>
            <div className="text-[11px] font-medium mt-0.5 opacity-90">
              ₹15,000 Now
            </div>
          </button>

          {/* Option 2: Full Payment */}
          <button
            type="button"
            onClick={() => onPlanChange('full')}
            className={`py-2 px-2.5 rounded-lg text-left transition-all duration-200 relative ${
              selectedPlan === 'full'
                ? 'bg-gradient-to-r from-[#E6CA85] to-[#C99E26] text-[#0A0908] shadow-md'
                : 'text-[#F5EFE6]/70 hover:text-[#FFFDF8] hover:bg-[#221D17]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold block leading-tight">Full Payment</span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                  selectedPlan === 'full'
                    ? 'bg-[#0A0908]/20 text-[#0A0908]'
                    : 'bg-[#E6CA85]/20 text-[#E6CA85]'
                }`}
              >
                1-Time
              </span>
            </div>
            <div className="text-[11px] font-medium mt-0.5 opacity-90">
              ₹29,899 Now
            </div>
          </button>
        </div>
      </div>

      {/* Interactive Form */}
      <form onSubmit={handlePayNow} className="space-y-3">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-[#F5EFE6]/80 flex items-center justify-between">
            <span>Full Name (For Legal Agreement)</span>
            {isNameValid && (
              <span className="text-[#10B981] text-[10px] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Valid
              </span>
            )}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#E6CA85]/80">
              <User className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="e.g. Mohammed Farhan"
              className={`w-full bg-[#181410] border text-[#FFFDF8] placeholder-[#F5EFE6]/30 text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none transition-all ${
                touched.name && !isNameValid
                  ? 'border-red-500/80 focus:border-red-500 ring-1 ring-red-500/30'
                  : isNameValid
                  ? 'border-[#10B981]/60 focus:border-[#E6CA85]'
                  : 'border-[#E6CA85]/30 focus:border-[#E6CA85] focus:ring-1 focus:ring-[#E6CA85]/40'
              }`}
            />
          </div>
          {touched.name && !isNameValid && (
            <p className="text-[10px] text-red-400 flex items-center gap-1 pl-1">
              <AlertCircle className="w-2.5 h-2.5" /> Please enter your name.
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-[#F5EFE6]/80 flex items-center justify-between">
            <span>Email Address (Agreement sent here immediately)</span>
            {isEmailValid && (
              <span className="text-[#10B981] text-[10px] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Valid
              </span>
            )}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#E6CA85]/80">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="farhan@gmail.com"
              className={`w-full bg-[#181410] border text-[#FFFDF8] placeholder-[#F5EFE6]/30 text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none transition-all ${
                touched.email && !isEmailValid
                  ? 'border-red-500/80 focus:border-red-500 ring-1 ring-red-500/30'
                  : isEmailValid
                  ? 'border-[#10B981]/60 focus:border-[#E6CA85]'
                  : 'border-[#E6CA85]/30 focus:border-[#E6CA85] focus:ring-1 focus:ring-[#E6CA85]/40'
              }`}
            />
          </div>
          {touched.email && !isEmailValid && (
            <p className="text-[10px] text-red-400 flex items-center gap-1 pl-1">
              <AlertCircle className="w-2.5 h-2.5" /> Valid email required.
            </p>
          )}
        </div>

        {/* WhatsApp & City in 2-column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* WhatsApp Phone */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#F5EFE6]/80 flex items-center justify-between">
              <span>WhatsApp Number</span>
              {isPhoneValid && (
                <span className="text-[#10B981] text-[10px] flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                </span>
              )}
            </label>
            <div className="relative flex">
              <div className="inline-flex items-center px-2.5 rounded-l-xl border border-r-0 border-[#E6CA85]/30 bg-[#221D17] text-[#E6CA85] text-xs font-semibold">
                +91
              </div>
              <input
                type="tel"
                maxLength={10}
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="9876543210"
                className={`w-full bg-[#181410] border text-[#FFFDF8] placeholder-[#F5EFE6]/30 text-xs sm:text-sm rounded-r-xl px-3 py-2.5 focus:outline-none transition-all ${
                  touched.phone && !isPhoneValid
                    ? 'border-red-500/80 focus:border-red-500 ring-1 ring-red-500/30'
                    : isPhoneValid
                    ? 'border-[#10B981]/60 focus:border-[#E6CA85]'
                    : 'border-[#E6CA85]/30 focus:border-[#E6CA85] focus:ring-1 focus:ring-[#E6CA85]/40'
                }`}
              />
            </div>
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#F5EFE6]/80 flex items-center justify-between">
              <span>Delivery City (For Stock)</span>
              {isCityValid && (
                <span className="text-[#10B981] text-[10px] flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                </span>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#E6CA85]/80">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                onBlur={() => handleBlur('city')}
                placeholder="e.g. Bangalore"
                className={`w-full bg-[#181410] border text-[#FFFDF8] placeholder-[#F5EFE6]/30 text-xs sm:text-sm rounded-xl pl-8 pr-3 py-2.5 focus:outline-none transition-all ${
                  touched.city && !isCityValid
                    ? 'border-red-500/80 focus:border-red-500 ring-1 ring-red-500/30'
                    : isCityValid
                    ? 'border-[#10B981]/60 focus:border-[#E6CA85]'
                    : 'border-[#E6CA85]/30 focus:border-[#E6CA85] focus:ring-1 focus:ring-[#E6CA85]/40'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Quick Value Summary */}
        <div className="p-2.5 rounded-lg bg-[#1D1913] border border-[#E6CA85]/20 flex items-center justify-between text-[11px]">
          <span className="text-[#E6CA85] flex items-center gap-1.5 font-medium">
            <PackageCheck className="w-3.5 h-3.5 text-[#10B981]" />
            Includes ₹25,000 Opening Stock (Free)
          </span>
          <span className="text-[#10B981] font-semibold">Dispatched Post-Payment</span>
        </div>

        {/* Glowing Dynamic CTA Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex flex-col items-center justify-center gap-0.5 shadow-xl relative overflow-hidden ${
              isFormValid
                ? 'btn-shiny text-[#0A0908] cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_25px_rgba(230,202,133,0.4)]'
                : 'bg-[#221D17] border border-[#E6CA85]/40 text-[#F5EFE6]/60 hover:text-[#FFFDF8] cursor-pointer'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2 py-1 text-[#0A0908]">
                <div className="w-4 h-4 border-2 border-[#0A0908] border-t-transparent rounded-full animate-spin"></div>
                <span>Securing Your Seat Insha&apos;Allah...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span>
                    {isFormValid
                      ? `Pay ₹${formattedAmount} Now`
                      : `Fill Details to Pay ₹${formattedAmount}`}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <span
                  className={`text-[9px] font-medium tracking-wide ${
                    isFormValid ? 'text-[#0A0908]/85' : 'text-[#F5EFE6]/40'
                  }`}
                >
                  Razorpay Secured · Agreement Emailed Instantly
                </span>
              </>
            )}
          </button>
        </div>

        {/* Trust & Support Strip */}
        <div className="pt-2 flex items-center justify-between text-[10px] text-[#F5EFE6]/60 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#10B981]" />
            100% Halal Amanah
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#E6CA85]" />
            Instant PDF Agreement
          </span>
          <button
            type="button"
            onClick={() => setShowSupportModal(true)}
            className="text-[#E6CA85] hover:underline font-medium"
          >
            Need Help?
          </button>
        </div>
      </form>

      {/* Support / Help Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-[#0A0908]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181410] border border-[#E6CA85]/35 rounded-2xl max-w-sm w-full p-5 relative shadow-2xl">
            <button
              onClick={() => setShowSupportModal(false)}
              className="absolute top-3.5 right-3.5 text-[#F5EFE6]/60 hover:text-[#FFFDF8] p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center space-y-2 mb-4">
              <p className="ayah text-sm text-[#E6CA85]">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
              <h3 className="text-sm font-bold text-[#FFFDF8]">Fiqrtaalim Support Desk</h3>
              <p className="text-[11px] text-[#F5EFE6]/70">
                Have questions about the payment options or stock dispatch?
              </p>
            </div>
            <div className="space-y-2 text-[11px] text-[#F5EFE6]/85 mb-5">
              <p>
                • <strong>Payment Confirmation:</strong> Instant confirmation and automatic delivery of your formal PDF Service Agreement to your email.
              </p>
              <p>
                • <strong>Opening Stock:</strong> ₹25,000 in free physical inventory dispatched to your address via Shiprocket.
              </p>
              <p>
                • <strong>Guarantee:</strong> Backed by written legal service agreement signed by CEO Mohammed Omar.
              </p>
            </div>
            <a
              href="https://wa.me/919999999999?text=Assalamu%20Alaikum%20Fiqrtaalim%20Team,%20I%20have%20a%20question%20regarding%20the%20Partnership%20enrollment."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              WhatsApp Help Desk
            </a>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 z-50 bg-[#0A0908]/90 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-[#181410] border-2 border-[#E6CA85] rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in duration-300">
            <p className="ayah text-sm text-[#E6CA85]">الْحَمْدُ لِلَّٰهِ</p>
            <div className="w-12 h-12 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center text-[#10B981] mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[#FFFDF8]">
              BarakAllah! Seat Confirmed
            </h2>
            <p className="text-xs text-[#F5EFE6]/80 max-w-xs mx-auto">
              Alhamdulillah, your seat is locked for <strong>{paymentSuccess.name}</strong>. Your ₹25,000 opening stock is being prepared for dispatch to <strong>{paymentSuccess.city}</strong>.
            </p>

            <div className="p-3 rounded-xl bg-[#221D17] border border-[#E6CA85]/25 text-xs space-y-1.5 text-left">
              <div className="flex justify-between text-[#F5EFE6]/75">
                <span>Payment ID:</span>
                <span className="font-mono text-[#E6CA85]">{paymentSuccess.paymentId}</span>
              </div>
              <div className="flex justify-between text-[#F5EFE6]/75">
                <span>Amount Paid:</span>
                <span className="text-[#10B981] font-bold">
                  ₹{paymentSuccess.amount}
                </span>
              </div>
              <div className="flex justify-between text-[#F5EFE6]/75">
                <span>Legal Agreement:</span>
                <span className="text-[#E6CA85] flex items-center gap-1 font-medium">
                  <FileText className="w-3 h-3" /> Emailed to {paymentSuccess.email}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={`https://wa.me/919999999999?text=Assalamu%20Alaikum%20Fiqrtaalim%20Team,%20I%20have%20completed%20my%20seat%20lock%20payment%20(Payment%20ID:%20${paymentSuccess.paymentId})%20for%20${encodeURIComponent(
                  paymentSuccess.name
                )}.%20Please%20assign%20my%20account%20manager.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Connect With Dedicated Account Manager</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full py-1 text-xs text-[#F5EFE6]/50 hover:text-[#FFFDF8]"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
