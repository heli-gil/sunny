import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  // Get distinct years from expenses table
  const { data, error } = await supabase
    .from('expenses')
    .select('date')
    .is('deleted_at', null)
    .order('date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Extract unique years from dates
  const allYears = (data || [])
    .map(d => new Date(d.date).getFullYear())
    .filter(y => !isNaN(y))
  const years = Array.from(new Set(allYears)).sort((a, b) => b - a) // Sort descending

  return NextResponse.json({ data: years })
}
