import { User, UserRound, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BeneficiaryType } from '@/types'

interface PartnerIconProps {
  type: BeneficiaryType
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function PartnerIcon({
  type,
  size = 'md',
  showLabel = false,
  className,
}: PartnerIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const config = {
    Heli: {
      icon: UserRound,
      color: 'text-heli',
      bgColor: 'bg-heli/10',
      label: 'Heli',
    },
    Shahar: {
      icon: User,
      color: 'text-shahar',
      bgColor: 'bg-shahar/10',
      label: 'Shahar',
    },
    Business: {
      icon: Briefcase,
      color: 'text-business',
      bgColor: 'bg-business/10',
      label: 'Business',
    },
  }

  const { icon: Icon, color, bgColor, label } = config[type]

  if (showLabel) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className={cn('p-1.5 rounded-md', bgColor)}>
          <Icon className={cn(sizeClasses[size], color)} />
        </div>
        <span className={cn('text-sm', color)}>{label}</span>
      </div>
    )
  }

  return (
    <div className={cn('p-1.5 rounded-md', bgColor, className)}>
      <Icon className={cn(sizeClasses[size], color)} />
    </div>
  )
}
