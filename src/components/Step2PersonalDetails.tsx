import React, { useState } from 'react';
import { PersonalDetails, ValidationErrors, LoanState } from '../types/loan';
import { FBCLogo } from './FBCLogo';
import {
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface Step2PersonalDetailsProps {
  details: PersonalDetails;
  loan: LoanState;
  onUpdateDetails: (partial: Partial<PersonalDetails>) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const Step2PersonalDetails: React.FC<Step2PersonalDetailsProps> = ({
  details,
  loan,
  onUpdateDetails,
  onProceed,
  onBack,
}) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const currencySymbol = loan.currency === 'USD' ? '$' : 'ZiG ';

  const validate = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!details.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (details.fullName.trim().length < 3) {
      errors.fullName = 'Minimum 3 characters required';
    }

    if (!details.nationalId.trim()) {
      errors.nationalId = 'National ID or Passport is required';
    } else if (details.nationalId.trim().length < 6) {
      errors.nationalId = 'Enter a valid National ID';
    }

    const cleanPhone = details.phoneNumber.replace(/[\s\-()]/g, '');
    if (!cleanPhone) {
      errors.phoneNumber = 'Phone number is required';
    } else if (cleanPhone.length < 9) {
      errors.phoneNumber = 'Enter a valid phone number';
    }

    if (!details.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) {
      errors.email = 'Enter a valid email address';
    }

    if (!details.loanPurpose) {
      errors.loanPurpose = 'Please select loan purpose';
    }

    const incomeNum = parseFloat(details.monthlyIncome.replace(/[^0-9.]/g, ''));
    if (!details.monthlyIncome || isNaN(incomeNum) || incomeNum <= 0) {
      errors.monthlyIncome = 'Monthly income is required';
    }

    return errors;
  };

  const errors = validate();
  const isFormValid = Object.keys(errors).length === 0;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: keyof PersonalDetails, value: string) => {
    onUpdateDetails({ [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      nationalId: true,
      phoneNumber: true,
      email: true,
      loanPurpose: true,
      monthlyIncome: true,
    });

    if (isFormValid) {
      onProceed();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <FBCLogo size="lg" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Personal Details
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Please enter your details to proceed
            </p>
          </div>
        </div>

        <div className="bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-100 text-xs self-start sm:self-auto">
          <span className="text-slate-500">Loan: </span>
          <strong className="text-[#0047BA] font-bold">
            {currencySymbol}{loan.amount.toLocaleString()} ({loan.periodMonths} Mos @ 5%)
          </strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Names <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter full name"
                value={details.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                className={`w-full text-sm px-4 py-3 rounded-2xl border bg-slate-50/50 transition-colors focus:bg-white focus:outline-none ${
                  touched.fullName && errors.fullName
                    ? 'border-red-400 focus:border-red-500'
                    : touched.fullName && !errors.fullName
                    ? 'border-emerald-500'
                    : 'border-slate-200 focus:border-[#0047BA]'
                }`}
              />
              {touched.fullName && !errors.fullName && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3.5" />
              )}
            </div>
            {touched.fullName && errors.fullName && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* National ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              National ID / Passport Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter National ID"
                value={details.nationalId}
                onChange={(e) => handleChange('nationalId', e.target.value.toUpperCase())}
                onBlur={() => handleBlur('nationalId')}
                className={`w-full text-sm px-4 py-3 rounded-2xl border bg-slate-50/50 transition-colors focus:bg-white focus:outline-none ${
                  touched.nationalId && errors.nationalId
                    ? 'border-red-400 focus:border-red-500'
                    : touched.nationalId && !errors.nationalId
                    ? 'border-emerald-500'
                    : 'border-slate-200 focus:border-[#0047BA]'
                }`}
              />
              {touched.nationalId && !errors.nationalId && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3.5" />
              )}
            </div>
            {touched.nationalId && errors.nationalId && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.nationalId}
              </p>
            )}
          </div>

          {/* Mobile Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4 text-[#0047BA]" />
              </div>
              <input
                type="tel"
                placeholder="e.g. 0771234567"
                value={details.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                onBlur={() => handleBlur('phoneNumber')}
                className={`w-full text-sm pl-10 pr-10 py-3 rounded-2xl border bg-slate-50/50 transition-colors focus:bg-white focus:outline-none ${
                  touched.phoneNumber && errors.phoneNumber
                    ? 'border-red-400 focus:border-red-500'
                    : touched.phoneNumber && !errors.phoneNumber
                    ? 'border-emerald-500'
                    : 'border-slate-200 focus:border-[#0047BA]'
                }`}
              />
              {touched.phoneNumber && !errors.phoneNumber && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3.5" />
              )}
            </div>
            {touched.phoneNumber && errors.phoneNumber && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4 text-[#0047BA]" />
              </div>
              <input
                type="email"
                placeholder="name@example.com"
                value={details.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full text-sm pl-10 pr-10 py-3 rounded-2xl border bg-slate-50/50 transition-colors focus:bg-white focus:outline-none ${
                  touched.email && errors.email
                    ? 'border-red-400 focus:border-red-500'
                    : touched.email && !errors.email
                    ? 'border-emerald-500'
                    : 'border-slate-200 focus:border-[#0047BA]'
                }`}
              />
              {touched.email && !errors.email && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3.5" />
              )}
            </div>
            {touched.email && errors.email && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Loan Purpose */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Loan Purpose <span className="text-red-500">*</span>
            </label>
            <select
              value={details.loanPurpose}
              onChange={(e) => handleChange('loanPurpose', e.target.value)}
              onBlur={() => handleBlur('loanPurpose')}
              className={`w-full text-sm px-4 py-3 rounded-2xl border bg-slate-50/50 transition-colors focus:bg-white focus:outline-none cursor-pointer ${
                touched.loanPurpose && errors.loanPurpose
                  ? 'border-red-400 focus:border-red-500'
                  : touched.loanPurpose && !errors.loanPurpose
                  ? 'border-emerald-500'
                  : 'border-slate-200 focus:border-[#0047BA]'
              }`}
            >
              <option value="">-- Select Purpose --</option>
              <option value="Home Improvement">Home Improvement</option>
              <option value="Business Working Capital">Business Working Capital</option>
              <option value="Education & School Fees">Education & School Fees</option>
              <option value="Vehicle Purchase">Vehicle Purchase</option>
              <option value="Agriculture & Farming">Agriculture & Farming</option>
              <option value="Medical Expenses">Medical Expenses</option>
              <option value="Personal / Other">Personal / Other</option>
            </select>
            {touched.loanPurpose && errors.loanPurpose && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.loanPurpose}
              </p>
            )}
          </div>

          {/* Monthly Net Income */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Monthly Income ({loan.currency}) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3.5 font-bold text-xs text-[#0047BA]">
                {currencySymbol}
              </div>
              <input
                type="text"
                placeholder="Enter monthly income"
                value={details.monthlyIncome}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.,]/g, '');
                  handleChange('monthlyIncome', val);
                }}
                onBlur={() => handleBlur('monthlyIncome')}
                className={`w-full text-sm pl-9 pr-10 py-3 rounded-2xl border bg-slate-50/50 transition-colors focus:bg-white focus:outline-none ${
                  touched.monthlyIncome && errors.monthlyIncome
                    ? 'border-red-400 focus:border-red-500'
                    : touched.monthlyIncome && !errors.monthlyIncome
                    ? 'border-emerald-500'
                    : 'border-slate-200 focus:border-[#0047BA]'
                }`}
              />
              {touched.monthlyIncome && !errors.monthlyIncome && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3.5" />
              )}
            </div>
            {touched.monthlyIncome && errors.monthlyIncome && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.monthlyIncome}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#0047BA] hover:bg-[#003893] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
