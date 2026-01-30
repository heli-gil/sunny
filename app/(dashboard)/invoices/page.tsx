import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Button className="bg-blue hover:bg-blue/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Invoice
        </Button>
      </div>

      <div className="glass-card p-12 text-center">
        <p className="text-muted-foreground">
          No invoices created yet. Add your first invoice to get started.
        </p>
      </div>
    </div>
  )
}
