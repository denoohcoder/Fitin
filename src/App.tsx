import React, { useState } from 'react';
import { LoanState, PersonalDetails, StepNumber } from './types/loan';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Step1LoanCalculator } from './components/Step1LoanCalculator';
import { Step2PersonalDetails } from './components/Step2PersonalDetails';
import { Step3Login } from './components/Step3Login';
import { Step4OtpVerification } from './components/Step4OtpVerification';
import { Step5ApprovalConfirmation } from './components/Step5ApprovalConfirmation';
import { SupportModal } from './components/SupportModal';

export default function App() {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Step 1: Loan calculator
  const [loan, setLoan] = useState<LoanState>({
    amount: 2500,
    periodMonths: 12,
    interestRateAnnual: 0.05,
    currency: 'USD',
  });

  // Step 2: Personal & financial details (empty by default)
  const [details, setDetails] = useState<PersonalDetails>({
    fullName: '',
    nationalId: '',
    phoneNumber: '',
    email: '',
    loanPurpose: '',
    monthlyIncome: '',
  });

  // Step 3: Mobile phone login
  const [loginPhone, setLoginPhone] = useState<string>('');

  const handleUpdateLoan = (partial: Partial<LoanState>) => {
    setLoan((prev) => ({ ...prev, ...partial }));
  };

  const handleUpdateDetails = (partial: Partial<PersonalDetails>) => {
    setDetails((prev) => ({ ...prev, ...partial }));
    if (partial.phoneNumber && !loginPhone) {
      setLoginPhone(partial.phoneNumber);
    }
  };

  const handleStep1Proceed = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Proceed = () => {
    if (!loginPhone && details.phoneNumber) {
      setLoginPhone(details.phoneNumber);
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep3Proceed = (verifiedPhone: string) => {
    setLoginPhone(verifiedPhone);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep4Verified = () => {
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-[#0047BA] selection:text-white">
      <Header
        onOpenSupport={() => setIsSupportOpen(true)}
        onGoHome={handleRestart}
      />

      <main className="flex-1 flex flex-col">
        {currentStep === 1 && (
          <Step1LoanCalculator
            loan={loan}
            onUpdateLoan={handleUpdateLoan}
            onProceed={handleStep1Proceed}
          />
        )}

        {currentStep === 2 && (
          <Step2PersonalDetails
            details={details}
            loan={loan}
            onUpdateDetails={handleUpdateDetails}
            onProceed={handleStep2Proceed}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3Login
            initialPhone={loginPhone || details.phoneNumber}
            onProceed={handleStep3Proceed}
            onBack={() => setCurrentStep(2)}
            onOpenSupport={() => setIsSupportOpen(true)}
          />
        )}

        {currentStep === 4 && (
          <Step4OtpVerification
            phoneNumber={loginPhone || details.phoneNumber}
            onVerified={handleStep4Verified}
            onBack={() => setCurrentStep(3)}
            onOpenSupport={() => setIsSupportOpen(true)}
          />
        )}

        {currentStep === 5 && (
          <Step5ApprovalConfirmation
            loan={loan}
            details={details}
            phoneNumber={loginPhone || details.phoneNumber}
            onRestart={handleRestart}
            onOpenSupport={() => setIsSupportOpen(true)}
          />
        )}
      </main>

      {(currentStep === 1 || currentStep === 2 || currentStep === 5) && (
        <Footer
          variant="light"
          onOpenSupport={() => setIsSupportOpen(true)}
        />
      )}

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
}
