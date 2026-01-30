/**
 * Format a date for display
 */
export function formatDate(
  date: string | Date,
  options?: {
    format?: 'short' | 'medium' | 'long'
    includeYear?: boolean
  }
): string {
  const { format = 'medium', includeYear = true } = options || {}
  const d = typeof date === 'string' ? new Date(date) : date

  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        ...(includeYear && { year: 'numeric' }),
      })
    case 'medium':
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: includeYear ? 'numeric' : undefined,
      })
    case 'long':
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    default:
      return d.toLocaleDateString()
  }
}

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

/**
 * Get the current date as YYYY-MM-DD
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Get quarter from date (Q1, Q2, Q3, Q4)
 */
export function getQuarter(date: string | Date): number {
  const d = typeof date === 'string' ? new Date(date) : date
  return Math.floor(d.getMonth() / 3) + 1
}

/**
 * Get quarter label (e.g., "Q1 2026")
 */
export function getQuarterLabel(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const quarter = getQuarter(d)
  const year = d.getFullYear()
  return `Q${quarter} ${year}`
}

/**
 * Check if a date is overdue (past today)
 */
export function isOverdue(date: string | Date): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  return d < today
}

/**
 * Calculate days until a date (negative if past)
 */
export function daysUntil(date: string | Date): number {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  const diffTime = d.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Get start and end dates for a year
 */
export function getYearRange(year: number): { start: string; end: string } {
  return {
    start: `${year}-01-01`,
    end: `${year}-12-31`,
  }
}

/**
 * Get start and end dates for a quarter
 */
export function getQuarterRange(
  year: number,
  quarter: number
): { start: string; end: string } {
  const startMonth = (quarter - 1) * 3
  const endMonth = startMonth + 2
  const endDay = new Date(year, endMonth + 1, 0).getDate()

  return {
    start: `${year}-${String(startMonth + 1).padStart(2, '0')}-01`,
    end: `${year}-${String(endMonth + 1).padStart(2, '0')}-${endDay}`,
  }
}
