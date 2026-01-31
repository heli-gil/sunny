/**
 * Exchange Rate Utility
 * Fetches historical exchange rates to ILS for a given date
 * Uses exchangerate.host API (free, no API key required)
 */

interface ExchangeRateCache {
  [key: string]: { rate: number; timestamp: number }
}

// In-memory cache to avoid repeated API calls for same date/currency
const cache: ExchangeRateCache = {}
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Get exchange rate to ILS for a specific currency and date
 * @param currency - Source currency code (USD, EUR, GBP, etc.)
 * @param date - Date string in YYYY-MM-DD format
 * @returns Exchange rate to ILS
 */
export async function getExchangeRate(currency: string, date: string): Promise<number> {
  // ILS to ILS is always 1
  if (currency === 'ILS') {
    return 1.0
  }

  const cacheKey = `${currency}_${date}`
  const now = Date.now()

  // Check cache first
  if (cache[cacheKey] && (now - cache[cacheKey].timestamp) < CACHE_TTL) {
    return cache[cacheKey].rate
  }

  try {
    // Use exchangerate.host API for historical rates
    // Format: https://api.exchangerate.host/convert?from=USD&to=ILS&date=2026-01-15
    const response = await fetch(
      `https://api.exchangerate.host/convert?from=${currency}&to=ILS&date=${date}&amount=1`
    )

    if (!response.ok) {
      console.error(`Exchange rate API error: ${response.status}`)
      return getFallbackRate(currency)
    }

    const data = await response.json()

    if (data.success && data.result) {
      const rate = data.result
      // Cache the result
      cache[cacheKey] = { rate, timestamp: now }
      return rate
    }

    // If the primary API fails, try the alternative
    return await getExchangeRateAlternative(currency, date)
  } catch (error) {
    console.error('Exchange rate fetch error:', error)
    // Try alternative API
    return await getExchangeRateAlternative(currency, date)
  }
}

/**
 * Alternative exchange rate source using Frankfurter API
 * Note: Frankfurter uses ECB rates which may not have ILS directly
 */
async function getExchangeRateAlternative(currency: string, date: string): Promise<number> {
  try {
    // Frankfurter API - uses ECB data
    // We need to get rate via EUR as intermediate
    const response = await fetch(
      `https://api.frankfurter.app/${date}?from=${currency}&to=EUR`
    )

    if (!response.ok) {
      return getFallbackRate(currency)
    }

    const data = await response.json()
    const rateToEur = data.rates?.EUR

    if (!rateToEur) {
      return getFallbackRate(currency)
    }

    // Get EUR to ILS rate (approximate, updated periodically)
    // As of late 2025/early 2026, EUR/ILS is around 3.9-4.0
    const eurToIls = 3.95
    const rate = rateToEur * eurToIls

    // Cache it
    const cacheKey = `${currency}_${date}`
    cache[cacheKey] = { rate, timestamp: Date.now() }

    return rate
  } catch (error) {
    console.error('Alternative exchange rate fetch error:', error)
    return getFallbackRate(currency)
  }
}

/**
 * Fallback rates when API is unavailable
 * These are approximate rates and should only be used as last resort
 */
function getFallbackRate(currency: string): number {
  const fallbackRates: Record<string, number> = {
    USD: 3.65,
    EUR: 3.95,
    GBP: 4.55,
    CHF: 4.10,
    CAD: 2.70,
    AUD: 2.40,
    JPY: 0.024,
  }

  console.warn(`Using fallback rate for ${currency}`)
  return fallbackRates[currency] || 3.65 // Default to USD rate if unknown
}

/**
 * Get exchange rate with today's date as default
 */
export async function getCurrentExchangeRate(currency: string): Promise<number> {
  const today = new Date().toISOString().split('T')[0]
  return getExchangeRate(currency, today)
}
