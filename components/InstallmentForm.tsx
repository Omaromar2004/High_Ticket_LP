'use client';

import React, { useState } from 'react';
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
  Check,
  ScrollText
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

  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
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
  const razorpayUrl = selectedPlan === 'installment'
    ? 'https://rzp.io/rzp/db1qFEB8'
    : 'https://rzp.io/rzp/M32rMCs9';

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const triggerAgreementEmail = (payload: any) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/api/send-agreement.php', blob);
      } else {
        fetch('/api/send-agreement.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Email dispatch background error:', err);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, city: true });

    if (!isFormValid) return;

    // 1. Instantly capture lead data in the background (irrespective of payment)
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: cleanPhone,
      city: formData.city.trim(),
      plan: selectedPlan,
      amount: formattedAmount,
      date: todayFormatted,
    };
    triggerAgreementEmail(payload);

    // 2. Open the official Agreement Review modal
    setShowAgreementModal(true);
  };

  const handleAcceptAndProceedToPayment = () => {
    if (!agreementAccepted) return;

    setRedirecting(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: cleanPhone,
      city: formData.city.trim(),
      plan: selectedPlan,
      amount: formattedAmount,
      date: todayFormatted,
    };

    // Ensure email/lead trigger
    triggerAgreementEmail(payload);

    if (onSuccess) onSuccess(payload);

    // Redirect directly to the Razorpay Payment Link
    setTimeout(() => {
      window.location.href = razorpayUrl;
    }, 400);
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
      <form onSubmit={handleFormSubmit} className="space-y-3">
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
              <AlertCircle className="w-2.5 h-2.5" /> Please enter your full name.
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-[#F5EFE6]/80 flex items-center justify-between">
            <span>Email Address (Agreement sent here)</span>
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

        {/* WhatsApp & City */}
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
            className={`w-full py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex flex-col items-center justify-center gap-0.5 shadow-xl relative overflow-hidden ${
              isFormValid
                ? 'btn-shiny text-[#0A0908] cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_25px_rgba(230,202,133,0.4)]'
                : 'bg-[#221D17] border border-[#E6CA85]/40 text-[#F5EFE6]/60 hover:text-[#FFFDF8] cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>
                {isFormValid
                  ? `Review Agreement & Pay ₹${formattedAmount}`
                  : `Fill Details to Pay ₹${formattedAmount}`}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <span
              className={`text-[9px] font-medium tracking-wide ${
                isFormValid ? 'text-[#0A0908]/85' : 'text-[#F5EFE6]/40'
              }`}
            >
              Includes Formal Legal Agreement · Razorpay Secured
            </span>
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
            Official PDF Agreement
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

      {/* OFFICIAL LEGAL AGREEMENT MODAL */}
      {showAgreementModal && (
        <div className="fixed inset-0 z-50 bg-[#0A0908]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#14110C] border border-[#E6CA85]/40 rounded-2xl max-w-xl w-full my-auto flex flex-col max-h-[92vh] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(230,202,133,0.25)] relative overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-[#1C1712] border-b border-[#E6CA85]/30 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E6CA85]/15 border border-[#E6CA85]/40 flex items-center justify-center text-[#E6CA85]">
                  <ScrollText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#FFFDF8] tracking-tight uppercase">
                    Official Service Agreement
                  </h3>
                  <p className="text-[10px] text-[#E6CA85]">
                    FIQRTAALIM Partnership Programme
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAgreementModal(false)}
                className="text-[#F5EFE6]/60 hover:text-[#FFFDF8] p-1.5 rounded-lg hover:bg-[#2A231B] transition-colors"
                aria-label="Close Agreement"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Agreement Document */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-[#F5EFE6]/90 bg-[#120F0B]/80 select-text">
              {/* Bismillah Header */}
              <div className="text-center pb-2 border-b border-[#E6CA85]/20 space-y-1">
                <p className="ayah text-sm sm:text-base text-[#E6CA85]">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                <h2 className="text-sm sm:text-base font-serif font-bold text-[#FFFDF8] uppercase tracking-wider">
                  FIQRTAALIM SERVICE AGREEMENT
                </h2>
                <p className="text-[10px] text-[#F5EFE6]/60">Date of Agreement: <strong>{todayFormatted}</strong></p>
              </div>

              {/* Parties */}
              <div className="bg-[#1A1510] p-3 rounded-xl border border-[#E6CA85]/20 space-y-1 text-[11px]">
                <p>This Service Agreement (“Agreement”) is made and entered into on this <strong>{todayFormatted}</strong>, by and between:</p>
                <p><strong>Company Name:</strong> FIQRTAALIM (Hereinafter referred to as “Service Provider”)</p>
                <p><strong>Client Name:</strong> <strong className="text-[#E6CA85]">{formData.name}</strong> (Hereinafter referred to as “Client”)</p>
                <p className="text-[10px] text-[#F5EFE6]/70">
                  Together referred to as the “Parties. ” · Email: {formData.email} · Phone: +91 {cleanPhone} · Delivery City: {formData.city}
                </p>
              </div>

              {/* Section 1: Scope of Services */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#E6CA85] uppercase tracking-wider flex items-center gap-1.5">
                  <span>1. Scope of Services</span>
                </h4>
                <p className="text-[11px] text-[#F5EFE6]/75">
                  The Service Provider agrees to provide the following services to the Client under this Agreement:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#F5EFE6]/80">
                  <li>Designing and building a Shopify website.</li>
                  <li>Setting up Instagram &amp; Facebook business accounts.</li>
                  <li>Creating and configuring Meta Ad Manager with tracking pixels.</li>
                  <li>Setting up WhatsApp Business account &amp; sales funnel.</li>
                  <li>Consultation for pricing strategy.</li>
                  <li>Consultation &amp; guidance for legal documents (KYC for Razorpay &amp; Shiprocket).</li>
                  <li>Complete setup of Razorpay payment gateway and Shiprocket logistics account.</li>
                  <li>Connecting Instagram, WhatsApp Business, and Meta Business Manager.</li>
                  <li>Running initial advertising campaigns (ad budget borne by Client).</li>
                  <li>Providing 1-to-1 mentorship until Client achieves confirmed sales.</li>
                  <li>
                    <strong className="text-[#FFFDF8]">Supplying product inventory, consisting of:</strong>
                    <ul className="list-circle pl-4 mt-0.5 space-y-0.5 text-[#E6CA85]/90">
                      <li>40 sets of Traceable Kits</li>
                      <li>10 sets of Hindi Dua Stickers</li>
                      <li>10 sets of English Dua Stickers</li>
                      <li>With Packaging material and cargo charges included in this.</li>
                    </ul>
                  </li>
                </ul>
              </div>

              {/* Section 2: Fees & Payment Terms */}
              <div className="space-y-1.5 bg-[#17130E] p-3 rounded-xl border border-[#E6CA85]/25">
                <h4 className="text-xs font-bold text-[#E6CA85] uppercase tracking-wider">
                  2. Fees &amp; Payment Terms
                </h4>
                <p className="text-[11px] text-[#F5EFE6]/90">
                  {selectedPlan === 'installment' ? (
                    <>
                      The Client agrees to pay a service fee of ₹29,899/- (Twenty-Nine Thousand Eight Hundred Ninety-Nine Only). This fee includes the above-mentioned product inventory. Advertising budget is not included and shall be borne solely by the Client. The payment shall be made in two installments:
                      <br />
                      • <strong className="text-[#10B981]">Initial Payment: ₹15,000/- (Fifteen Thousand Only)</strong> has been paid upon signing this Agreement, in order to confirm the Client’s seat and dispatch the opening inventory kit.
                      <br />
                      • <strong>Remaining Balance: ₹14,899/- (Fourteen Thousand Eight Hundred Ninety-Nine Only)</strong> to be paid by the Client before live ad campaign launch. Services shall commence upon confirmation of initial payment.
                    </>
                  ) : (
                    <>
                      The Client agrees to pay a one-time service fee of <strong className="text-[#10B981]">₹29,899/- (Twenty-Nine Thousand Eight Hundred Ninety-Nine Only)</strong>. This fee includes the above-mentioned product inventory. Advertising budget is not included and shall be borne solely by the Client. Payment must be made in full in advance before commencement of services.
                    </>
                  )}
                </p>
              </div>

              {/* Section 3: Service Guarantee */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#E6CA85] uppercase tracking-wider">
                  3. Service Guarantee
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#F5EFE6]/80">
                  <li>The Service Provider guarantees to mentor and assist the Client until the Client achieves confirmed sales through their online store.</li>
                  <li>Upon initiation of sales, the Service Provider’s obligation under this Agreement shall be deemed fulfilled, and the Service Provider shall exit the project.</li>
                </ul>
              </div>

              {/* Section 4: Refund Policy */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#E6CA85] uppercase tracking-wider">
                  4. Refund Policy
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#F5EFE6]/80">
                  <li>If the Service Provider fails to help the Client achieve sales, the Client shall be entitled to an 80% refund of the service fee.</li>
                  <li>
                    The refund is strictly subject to the following conditions:
                    <ul className="list-circle pl-4 mt-0.5 space-y-0.5 text-[#F5EFE6]/70">
                      <li>The Client must follow all strategies, mentorship guidelines, and instructions provided.</li>
                      <li>The Client must allocate and spend the minimum agreed ad budget as instructed.</li>
                      <li>The Client must not make unauthorized changes to the website, ads, pricing, or setup.</li>
                      <li>The Client must provide all necessary documents, approvals, and access credentials on time.</li>
                    </ul>
                  </li>
                  <li>If the Client fails to comply with the above conditions, the refund clause shall be considered null and void.</li>
                </ul>
              </div>

              {/* Section 5: Client Responsibilities */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#E6CA85] uppercase tracking-wider">
                  5. Client Responsibilities
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#F5EFE6]/80">
                  <li>Provide accurate business details, documents, and KYC information on time.</li>
                  <li>Bear all costs related to advertising &amp; shipping.</li>
                  <li>Not misuse, resell, or duplicate the mentorship services provided under this Agreement.</li>
                  <li>Maintain transparency in all communications with the Service Provider.</li>
                </ul>
              </div>

              {/* Section 6: Limitation of Liability */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#E6CA85] uppercase tracking-wider">
                  6. Limitation of Liability
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#F5EFE6]/80">
                  <li>The Service Provider shall not be held liable for delays, losses, or failures caused by third-party platforms (Shopify, Razorpay, Shiprocket, Meta, etc.).</li>
                  <li>The Service Provider shall not be responsible for product quality issues, delivery failures, or customer disputes once the provided inventory is handed over to the Client.</li>
                </ul>
              </div>

              {/* Section 7: Termination */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#E6CA85] uppercase tracking-wider">
                  7. Termination
                </h4>
                <p className="text-[11px] text-[#F5EFE6]/80">
                  This Agreement may be terminated by either Party under the following conditions:
                  <br />• By mutual written consent of both Parties.
                  <br />• In case of breach of obligations by either Party.
                  <br />If termination occurs due to the Client’s non-compliance, no refund shall be issued.
                </p>
              </div>

              {/* Section 8: Dispute Resolution */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#E6CA85] uppercase tracking-wider">
                  8. Dispute Resolution
                </h4>
                <p className="text-[11px] text-[#F5EFE6]/80">
                  Any disputes arising under this Agreement shall first be resolved through mutual discussion. If unresolved, the matter shall fall under the jurisdiction of the courts in Mysore, Karnataka, India.
                </p>
              </div>

              {/* Acknowledgment & Signature Seal */}
              <div className="pt-3 border-t border-[#E6CA85]/20 space-y-2 text-[11px]">
                <p className="font-bold text-[#E6CA85]">Acknowledgment &amp; Acceptance</p>
                <p className="text-[10px] text-[#F5EFE6]/75 leading-relaxed text-justify">
                  By making a successful payment of the service fee, the Client acknowledges that they have read, understood, and agreed to the terms and conditions outlined in this Agreement. The payment shall be deemed as full acceptance of this Agreement. All fees paid are strictly non-refundable under any circumstances except those mentioned under section 4. (Refund Policy), and the Client acknowledges that no refund, reversal, or cancellation request will be entertained once the payment is successfully processed. Agreement, and services shall commence thereafter.
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#FFFDF8]">FIQRTAALIM</p>
                    <p className="text-[10px] text-[#F5EFE6]/60">Mysuru, Karnataka.</p>
                    <div className="mt-1">
                      <svg className="h-8 w-auto" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 28 58 Q 38 12, 48 42 Q 54 8, 60 52 Q 68 28, 78 46 Q 88 18, 98 48 Q 118 42, 138 50" stroke="#E6CA85" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M 38 64 C 60 62, 90 60, 125 64" stroke="#E6CA85" strokeWidth="1.8" strokeLinecap="round"/>
                        <circle cx="130" cy="64" r="2" fill="#E6CA85" />
                      </svg>
                    </div>
                    <p className="text-[10px] font-bold text-[#E6CA85] uppercase mt-0.5">MOHAMMED OMAR</p>
                    <p className="text-[9px] text-[#F5EFE6]/60">Co founder &amp; CEO, Fiqrtaalim</p>
                  </div>
                  <div className="text-right border border-[#E6CA85]/30 rounded-lg p-2 bg-[#17130E]/60">
                    <span className="text-[9px] font-bold text-[#10B981] uppercase block">
                      ✓ Verified Legal Amanah
                    </span>
                    <span className="text-[10px] text-[#F5EFE6]/80 font-mono">
                      Client: {formData.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="bg-[#1C1712] border-t border-[#E6CA85]/30 p-4 shrink-0 space-y-3">
              {/* Acceptance Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-[#F5EFE6]/90 select-none">
                <input
                  type="checkbox"
                  checked={agreementAccepted}
                  onChange={(e) => setAgreementAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[#E6CA85] text-[#E6CA85] focus:ring-0 focus:ring-offset-0 bg-[#0C0B09] cursor-pointer"
                />
                <span>
                  I, <strong className="text-[#E6CA85]">{formData.name}</strong>, have read and agreed to all terms of this Service Agreement and authorize payment of <strong className="text-[#10B981]">₹{formattedAmount}</strong>.
                </span>
              </label>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setShowAgreementModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-[#E6CA85]/30 text-[#F5EFE6]/70 hover:text-[#FFFDF8] hover:bg-[#261F17] text-xs font-semibold transition-colors order-2 sm:order-1 text-center"
                >
                  ← Edit Details
                </button>

                <button
                  type="button"
                  disabled={!agreementAccepted || redirecting}
                  onClick={handleAcceptAndProceedToPayment}
                  className={`flex-1 py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-xl order-1 sm:order-2 ${
                    agreementAccepted && !redirecting
                      ? 'btn-shiny text-[#0A0908] cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_20px_rgba(230,202,133,0.4)]'
                      : 'bg-[#2A231B] text-[#F5EFE6]/40 cursor-not-allowed'
                  }`}
                >
                  {redirecting ? (
                    <div className="flex items-center gap-2 text-[#0A0908]">
                      <div className="w-4 h-4 border-2 border-[#0A0908] border-t-transparent rounded-full animate-spin"></div>
                      <span>Redirecting to Razorpay...</span>
                    </div>
                  ) : (
                    <>
                      <span>Accept & Pay ₹{formattedAmount} via Razorpay</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[9px] text-[#F5EFE6]/50">
                <span className="flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-[#E6CA85]" /> 256-Bit SSL Encrypted
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5 text-[#10B981]" /> Official PDF Copy Emailed
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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
                Have questions about payment options or inventory dispatch?
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
              href="https://wa.me/919945891650?text=Assalamu%20Alaikum%20Fiqrtaalim%20Team,%20I%20have%20a%20question%20regarding%20the%20Partnership%20enrollment."
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
    </div>
  );
}
