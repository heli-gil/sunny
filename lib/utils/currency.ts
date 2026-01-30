import { CURRENCIES, VAT_RATE } from '@/lib/constants'
import type { CurrencyCode } from '@/types'

/**
 * Format a number as currency with the appropriate symbol
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'ILS',
  options?: {
    showDecimals?: boolean
    compact?: boolean
  }
): string {
  const { showDecimals = true, compact = false } = options || {}
  const { symbol } = CURRENCIES[currency]

  if (compact && Math.abs(amount) >= 1000) {
    const formatted = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount)
    return `${symbol}${formatted}`
  }

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount)

  return `${symbol}${formatted}`
}

/**
 * Format ILS specifically (most common use case)
 */
export function formatILS(amount: number, compact = false): string {
  return formatCurrency(amount, 'ILS', { compact })
}

/**
 * Convert amount from foreign currency to ILS
 */
export function convertToILS(
  amount: number,
  currency: CurrencyCode,
  exchangeRate: number
): number {
  if (currency === 'ILS') return amount
  return amount * exchangeRate
}

/**
 * Calculate VAT breakdown
 */
export function calculateVATBreakdown(
  amount: number,
  includesVat: boolean,
  vatRate: number = VAT_RATE
): {
  total: number
  beforeVat: number
  vat: number
} {
  if (includesVat) {
    const beforeVat = amount / (1 + vatRate)
    const vat = amount - beforeVat
    return { total: amount, beforeVat, vat }
  } else {
    const vat = amount * vatRate
    return { total: amount + vat, beforeVat: amount, vat }
  }
}

/**
 * Parse a currency string back to number
 */
export function parseCurrency(value: string): number {
  // Remove currency symbols and commas
  const cleaned = value.replace(/[₪$€£,\s]/g, '')
  return parseFloat(cleaned) || 0
}
