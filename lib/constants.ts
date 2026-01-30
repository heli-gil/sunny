// Allowed email addresses for authentication
export const ALLOWED_EMAILS = [
  'heli@automationsflow.com',
  'shahar@automationsflow.com',
] as const

// VAT rate in Israel
export const VAT_RATE = 0.18

// Currency display options
export const CURRENCIES = {
  ILS: { symbol: '₪', name: 'Israeli Shekel' },
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
} as const

// Beneficiary options
export const BENEFICIARIES = ['Business', 'Heli', 'Shahar'] as const

// Invoice statuses with colors
export const INVOICE_STATUSES = {
  Draft: { color: 'gray', label: 'Draft' },
  Sent: { color: 'blue', label: 'Sent' },
  Overdue: { color: 'red', label: 'Overdue' },
  Paid: { color: 'green', label: 'Paid' },
} as const

// Parent categories with colors
export const PARENT_CATEGORIES = {
  COGS: { color: 'cogs', label: 'COGS' },
  OPEX: { color: 'opex', label: 'OPEX' },
  Financial: { color: 'financial', label: 'Financial' },
} as const

// Withdrawal methods
export const WITHDRAWAL_METHODS = [
  { value: 'Bank_Transfer', label: 'Bank Transfer' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Check', label: 'Check' },
] as const

// Account types
export const ACCOUNT_TYPES = {
  Business_Credit: { label: 'Business Credit Card' },
  Private_Credit: { label: 'Private Credit Card' },
  Bank_Transfer: { label: 'Bank Transfer' },
} as const

// Business info
export const BUSINESS_INFO = {
  name: 'Automation Flow',
  website: 'www.automationsflow.com',
  startDate: '2026-01-01',
  fiscalYearStart: 'January',
} as const
