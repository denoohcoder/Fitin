export interface LoanState {
  amount: number;
  periodMonths: number;
  interestRateAnnual: number; // 5% per annum
  currency: 'USD' | 'ZiG';
}

export interface PersonalDetails {
  fullName: string;
  nationalId: string;
  phoneNumber: string;
  email: string;
  loanPurpose: string;
  monthlyIncome: string;
}

export interface ValidationErrors {
  fullName?: string;
  nationalId?: string;
  phoneNumber?: string;
  email?: string;
  loanPurpose?: string;
  monthlyIncome?: string;
  loginPhone?: string;
  otpCode?: string;
}

export type StepNumber = 1 | 2 | 3 | 4 | 5;

export interface LoanCalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
  interestRate: number;
  months: number;
  currency: 'USD' | 'ZiG';
}

export function calculateLoan(
  amount: number,
  months: number,
  annualRate: number = 0.05,
  currency: 'USD' | 'ZiG' = 'USD'
): LoanCalculation {
  const principal = Math.max(100, amount);
  const n = Math.max(1, months);
  const monthlyRate = annualRate / 12;

  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = principal / n;
  } else {
    monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
      (Math.pow(1 + monthlyRate, n) - 1);
  }

  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    principal,
    interestRate: annualRate,
    months: n,
    currency,
  };
}
