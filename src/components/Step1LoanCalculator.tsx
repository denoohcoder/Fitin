import React, { useState } from 'react';
import { LoanState, calculateLoan } from '../types/loan';
import { FBCLogo } from './FBCLogo';
import {
  DollarSign,
  Calendar,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Step1LoanCalculatorProps {
  loan: LoanState;
  onUpdateLoan: (partial: Partial<LoanState>) => void;
  onProceed: () => void;
}

export const Step1LoanCalculator: React.FC<Step1LoanCalculatorProps> = ({
  loan,
  onUpdateLoan,
  onProceed,
}) => {
  const [showAmortization, setShowAmortization] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'ZiG'>(loan.currency);

  const calc = calculateLoan(
    loan.amount,
    loan.periodMonths,
    loan.interestRateAnnual,
    currency
  );

  const currencySymbol = currency === 'USD' ? '$' : 'ZiG ';

  const presetAmounts = [
    { label: `${currencySymbol}500`, value: 500 },
    { label: `${currencySymbol}1,500`, value: 1500 },
    { label: `${currencySymbol}3,000`, value: 3000 },
    { label: `${currencySymbol}5,000`, value: 5000 },
    { label: `${currencySymbol}10,000`, value: 10000 },
    { label: `${currencySymbol}20,000`, value: 20000 },
  ];

  const presetPeriods = [
    { label: '6 Months', value: 6 },
    { label: '12 Months', value: 12 },
    { label: '24 Months', value: 24 },
    { label: '36 Months', value: 36 },
    { label: '48 Months', value: 48 },
    { label: '60 Months', value: 60 },
  ];

  const handleCurrencyChange = (newCurr: 'USD' | 'ZiG') => {
    setCurrency(newCurr);
    onUpdateLoan({ currency: newCurr });
  };

  const sampleSchedule = Array.from({ length: Math.min(6, loan.periodMonths) }).map(
    (_, index) => {
      const monthNum = index + 1;
      const interestPart = (calc.principal * (0.05 / 12)).toFixed(2);
      const principalPart = (calc.monthlyPayment - parseFloat(interestPart)).toFixed(2);
      const remainingBalance = Math.max(
        0,
        calc.principal - parseFloat(principalPart) * monthNum
      ).toFixed(2);

      return {
        month: monthNum,
        payment: calc.monthlyPayment.toFixed(2),
        principalPart,
        interestPart,
        balance: remainingBalance,
      };
    }
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Clean Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <FBCLogo size="lg" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Low interest rate of 5%
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
              Apply loan to help cater for your festive season needs.
            </p>
          </div>
        </div>

        {/* Currency Toggle */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleCurrencyChange('USD')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currency === 'USD'
                ? 'bg-[#0047BA] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            USD ($)
          </button>
          <button
            type="button"
            onClick={() => handleCurrencyChange('ZiG')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currency === 'ZiG'
                ? 'bg-[#0047BA] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ZiG
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
          {/* Loan Amount Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="loan-amount-slider"
                className="text-sm font-semibold text-slate-700 flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4 text-[#0047BA]" />
                Loan Amount
              </label>
              <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5">
                <span className="text-xs font-bold text-[#0047BA]">{currencySymbol}</span>
                <input
                  type="number"
                  min={100}
                  max={50000}
                  step={100}
                  value={loan.amount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    onUpdateLoan({ amount: Math.min(50000, Math.max(100, val || 100)) });
                  }}
                  className="w-24 text-right font-bold text-slate-900 text-base bg-transparent focus:outline-none"
                  aria-label="Loan amount"
                />
              </div>
            </div>

            <input
              id="loan-amount-slider"
              type="range"
              min={100}
              max={50000}
              step={100}
              value={loan.amount}
              onChange={(e) => onUpdateLoan({ amount: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0047BA]"
            />

            <div className="flex justify-between text-xs text-slate-400">
              <span>{currencySymbol}100</span>
              <span>{currencySymbol}50,000</span>
            </div>

            {/* Quick Amounts */}
            <div className="flex flex-wrap gap-2 pt-1">
              {presetAmounts.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => onUpdateLoan({ amount: p.value })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    loan.amount === p.value
                      ? 'border-[#0047BA] bg-blue-50 text-[#0047BA]'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loan Period Slider */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label
                htmlFor="loan-period-slider"
                className="text-sm font-semibold text-slate-700 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#0047BA]" />
                Loan Period
              </label>
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5">
                <span className="text-base font-bold text-slate-900">{loan.periodMonths}</span>
                <span className="text-xs font-bold text-[#0047BA] ml-1">Months</span>
              </div>
            </div>

            <input
              id="loan-period-slider"
              type="range"
              min={3}
              max={60}
              step={1}
              value={loan.periodMonths}
              onChange={(e) => onUpdateLoan({ periodMonths: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0047BA]"
            />

            <div className="flex justify-between text-xs text-slate-400">
              <span>3 Months</span>
              <span>60 Months</span>
            </div>

            {/* Quick Periods */}
            <div className="flex flex-wrap gap-2 pt-1">
              {presetPeriods.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => onUpdateLoan({ periodMonths: p.value })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    loan.periodMonths === p.value
                      ? 'border-[#0047BA] bg-blue-50 text-[#0047BA]'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculation Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900">
            Repayment Summary
          </h2>

          {/* Monthly Repayment Box */}
          <div className="bg-blue-50/70 rounded-2xl p-6 border border-blue-100 text-center">
            <span className="text-xs font-semibold text-[#0047BA] uppercase tracking-wider block mb-1">
              Monthly Repayment
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {currencySymbol}
              {calc.monthlyPayment.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              For {calc.months} months
            </span>
          </div>

          {/* Breakdown Rows */}
          <div className="space-y-3 text-xs border-b border-slate-100 pb-5">
            <div className="flex justify-between items-center text-slate-600">
              <span>Loan Amount</span>
              <span className="font-bold text-slate-900 text-sm">
                {currencySymbol}{calc.principal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Interest Rate</span>
              <span className="font-bold text-[#0047BA] text-sm">5% per year</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Total Interest</span>
              <span className="font-bold text-slate-900 text-sm">
                {currencySymbol}{calc.totalInterest.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Total Repayment</span>
              <span className="font-extrabold text-slate-900 text-sm">
                {currencySymbol}{calc.totalPayment.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Amortization schedule toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowAmortization(!showAmortization)}
              className="w-full text-xs font-semibold text-[#0047BA] flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <span>View Amortization Schedule</span>
              {showAmortization ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showAmortization && (
              <div className="mt-3 overflow-x-auto text-[11px] bg-slate-50 rounded-xl p-3 border border-slate-200">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400">
                      <th className="pb-1.5">Mth</th>
                      <th className="pb-1.5">Payment</th>
                      <th className="pb-1.5">Principal</th>
                      <th className="pb-1.5">Interest</th>
                      <th className="pb-1.5">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {sampleSchedule.map((row) => (
                      <tr key={row.month}>
                        <td className="py-1 font-medium">{row.month}</td>
                        <td className="py-1 font-bold text-slate-900">
                          {currencySymbol}{row.payment}
                        </td>
                        <td className="py-1">
                          {currencySymbol}{row.principalPart}
                        </td>
                        <td className="py-1 text-emerald-600">
                          {currencySymbol}{row.interestPart}
                        </td>
                        <td className="py-1">
                          {currencySymbol}{row.balance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <button
            type="button"
            onClick={onProceed}
            className="w-full bg-[#0047BA] hover:bg-[#003893] text-white py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
