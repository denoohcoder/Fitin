import React, { useState, useEffect } from 'react';
import { FBCLogo } from './FBCLogo';
import { Headphones, ArrowLeft, AlertCircle, RotateCw } from 'lucide-react';
import { Footer } from './Footer';

interface Step4OtpVerificationProps {
  phoneNumber: string;
  onVerified: () => Promise<void>;
  onBack: () => void;
  onOpenSupport: () => void;
}

export const Step4OtpVerification: React.FC<Step4OtpVerificationProps> = ({
  phoneNumber,
  onVerified,
  onBack,
  onOpenSupport,
}) => {
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);
  const [isAutoVerifying, setIsAutoVerifying] = useState(false);
  const [referenceCode] = useState('9vXfk');

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validateOtp = (code: string): string | null => {
    const cleaned = code.replace(/\D/g, '');
    if (!cleaned) return 'Please enter the OTP verification code';
    if (cleaned.length < 4 || cleaned.length > 6) return 'OTP must be 4 to 6 numeric digits';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const validationError = validateOtp(otpCode);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsAutoVerifying(true);
    setError(null);
    try {
      // This project currently simulates OTP verification; it does not verify an SMS code.
      await new Promise((resolve) => setTimeout(resolve, 600));
      await onVerified();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Submission failed. Please try again.');
    } finally {
      setIsAutoVerifying(false);
    }
  };

  const handleResend = () => {
    setResendTimer(45);
    setOtpCode('');
    setError(null);
  };

  return (
    <div className="relative min-h-[calc(100vh-130px)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0047BA] via-[#0051cf] to-[#003893] text-white">
      <div className="absolute right-0 bottom-0 pointer-events-none z-0 w-full max-w-2xl opacity-95">
        <svg viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto ml-auto">
          <path d="M 500 120 C 380 180, 260 220, 160 350 L 500 350 Z" fill="white" fillOpacity="0.9" />
          <path d="M 500 190 C 400 230, 310 270, 240 350 L 500 350 Z" fill="#e2e8f0" fillOpacity="0.4" />
        </svg>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-8 pt-6 flex items-center justify-between">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Number</span>
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 w-full max-w-md mx-auto">
        <div className="mb-8 flex justify-center"><FBCLogo variant="white" size="xl" showSubtext={false} /></div>

        <form onSubmit={handleSubmit} className="w-full space-y-5 text-center">
          <h2 className="text-white text-xl sm:text-2xl font-bold tracking-tight">OTP Verification</h2>
          <p className="text-white/95 text-xs sm:text-sm leading-relaxed px-4">
            Demo only: this screen does not send or verify an SMS code. Do not enter a real security code.
          </p>

          <div className="pt-1">
            <span className="text-sm font-semibold tracking-wide text-white/90">Ref: <strong className="text-white underline decoration-white/40">{referenceCode}</strong></span>
            {phoneNumber && <span className="block text-[11px] text-blue-200 mt-0.5">Phone on application: {phoneNumber}</span>}
          </div>

          <div className="space-y-2 pt-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Any 4–6 digits (demo)"
              value={otpCode}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtpCode(cleaned);
                if (touched) setError(validateOtp(cleaned));
              }}
              onBlur={() => {
                setTouched(true);
                setError(validateOtp(otpCode));
              }}
              className="w-full text-center text-white placeholder-white/60 bg-transparent border-2 border-white/80 rounded-full px-6 py-3.5 text-lg sm:text-xl font-bold tracking-widest focus:outline-none focus:border-white"
              aria-label="Enter demo code"
              autoComplete="off"
            />
            {touched && error && (
              <div role="alert" className="bg-amber-400 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-md animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button type="submit" disabled={isAutoVerifying} className="w-full bg-white text-[#0047BA] hover:bg-slate-100 font-bold text-base sm:text-lg py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2">
            {isAutoVerifying ? <><RotateCw className="w-5 h-5 animate-spin" /><span>Submitting...</span></> : <span>Submit demo application</span>}
          </button>

          <div className="pt-2 flex flex-col items-center gap-2 text-xs">
            {resendTimer > 0 ? (
              <span className="text-white/70">Resend OTP in <strong className="text-white">{resendTimer}s</strong></span>
            ) : (
              <button type="button" onClick={handleResend} className="text-white underline hover:text-amber-200 transition-colors font-semibold cursor-pointer">Reset demo code</button>
            )}
          </div>
        </form>

        <div className="mt-12 sm:mt-16 mb-4 flex flex-col items-center justify-center">
          <button type="button" onClick={onOpenSupport} className="group flex flex-col items-center gap-1.5 text-white/90 hover:text-white transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-full border-2 border-white/60 group-hover:border-white bg-white/10 group-hover:bg-white/20 flex items-center justify-center backdrop-blur-xs transition-colors">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium tracking-wide">Get Support</span>
          </button>
        </div>
      </div>

      <Footer variant="blue" />
    </div>
  );
};
