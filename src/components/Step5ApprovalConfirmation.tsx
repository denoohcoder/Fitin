import React, { useState } from 'react';
import { LoanState, PersonalDetails, calculateLoan } from '../types/loan';
import { FBCLogo } from './FBCLogo';
import { Printer, Copy, Check, RotateCcw } from 'lucide-react';

interface Step5ApprovalConfirmationProps {
  loan: LoanState;
  details: PersonalDetails;
  phoneNumber: string;
  referenceNumber: string;
  onRestart: () => void;
  onOpenSupport: () => void;
}

export const Step5ApprovalConfirmation: React.FC<Step5ApprovalConfirmationProps> = ({
  loan,
  details,
  phoneNumber,
  referenceNumber,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);
  const calc = calculateLoan(loan.amount, loan.periodMonths, loan.interestRateAnnual, loan.currency);
  const currencySymbol = loan.currency === 'USD' ? '$' : 'ZiG ';

  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <FBCLogo size="lg" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Application received</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">This demo request is pending review; it is not an approval or loan offer.</p>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 self-start sm:self-auto">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Reference</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-800">{referenceNumber}</span>
              <button type="button" onClick={handleCopyRef} className="text-slate-400 hover:text-slate-600 cursor-pointer" title="Copy reference" aria-label="Copy reference">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-800">Demo application details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Requested amount</span>
              <span className="text-lg font-bold text-slate-900">{currencySymbol}{calc.principal.toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Term</span>
              <span className="text-lg font-bold text-slate-900">{calc.months} Months</span>
            </div>
            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 col-span-2 sm:col-span-1">
              <span className="text-xs text-[#0047BA] font-semibold block mb-1">Estimated monthly repayment</span>
              <span className="text-lg font-bold text-[#0047BA]">{currencySymbol}{calc.monthlyPayment.toFixed(2)}</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs pt-2">
            <div className="py-2.5 flex justify-between items-center text-slate-600"><span>Illustrative interest rate</span><span className="font-semibold text-slate-900">5% per year</span></div>
            <div className="py-2.5 flex justify-between items-center text-slate-600"><span>Estimated total repayment</span><span className="font-bold text-slate-900">{currencySymbol}{calc.totalPayment.toFixed(2)}</span></div>
            <div className="py-2.5 flex justify-between items-center text-slate-600"><span>Applicant name (shown only in this browser)</span><span className="font-semibold text-slate-900">{details.fullName || 'N/A'}</span></div>
            <div className="py-2.5 flex justify-between items-center text-slate-600"><span>Phone (shown only in this browser)</span><span className="font-semibold text-slate-900">{phoneNumber || details.phoneNumber || 'N/A'}</span></div>
            <div className="py-2.5 flex justify-between items-center text-slate-600"><span>Loan purpose</span><span className="font-semibold text-slate-900">{details.loanPurpose || 'N/A'}</span></div>
          </div>
          <p className="text-xs text-slate-500">Only the requested amount, term, currency, and loan purpose are sent to the configured Telegram admin. Personal details, national ID, phone, email, and income are not sent by this notification endpoint.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button type="button" onClick={onRestart} className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer">
            <RotateCcw className="w-4 h-4" /><span>New Application</span>
          </button>
          <button type="button" onClick={() => window.print()} className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#0047BA] hover:bg-[#003893] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer">
            <Printer className="w-4 h-4" /><span>Print Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
};
