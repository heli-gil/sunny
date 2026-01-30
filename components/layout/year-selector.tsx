'use client'

import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR + i)

export function YearSelector() {
  const [selectedYear, setSelectedYear] = useState<string>(CURRENT_YEAR.toString())

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('sunny-selected-year')
    if (stored && YEARS.includes(parseInt(stored))) {
      setSelectedYear(stored)
    }
  }, [])

  // Save to localStorage on change
  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    localStorage.setItem('sunny-selected-year', year)
    // TODO: Trigger data refresh based on new year
  }

  return (
    <Select value={selectedYear} onValueChange={handleYearChange}>
      <SelectTrigger className="w-full bg-background border-border">
        <SelectValue placeholder="Select year" />
      </SelectTrigger>
      <SelectContent>
        {YEARS.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
