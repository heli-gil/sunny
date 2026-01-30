import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils/currency'
import type { CurrencyCode } from '@/types'

interface CurrencyDisplayProps {
  amount: number
  currency?: CurrencyCode
  originalAmount?: number
  originalCurrency?: CurrencyCode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'hero'
  showSign?: boolean
}

export function CurrencyDisplay({
  amount,
  currency = 'ILS',
  originalAmount,
  originalCurrency,
  className,
  size = 'md',
  showSign = false,
}: CurrencyDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl font-bold',
    hero: 'text-hero font-bold',
  }

  const colorClass = showSign
    ? amount >= 0
      ? 'text-green'
      : 'text-red'
    : ''

  const sign = showSign && amount > 0 ? '+' : ''

  return (
    <div className={cn(sizeClasses[size], colorClass, className)}>
      <span>
        {sign}
        {formatCurrency(amount, currency)}
      </span>
      {originalAmount !== undefined &&
        originalCurrency &&
        originalCurrency !== currency && (
          <span className="text-muted-foreground text-xs ml-2">
            ({formatCurrency(originalAmount, originalCurrency)})
          </span>
        )}
    </div>
  )
}
