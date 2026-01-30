import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PartnersPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Partner Balance & Withdrawals</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PartnerCard
          name="Heli"
          color="heli"
          available={0}
        />
        <PartnerCard
          name="Shahar"
          color="shahar"
          available={0}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Withdrawal History</h2>
        <div className="glass-card p-8 text-center">
          <p className="text-muted-foreground">
            No withdrawals recorded yet.
          </p>
        </div>
      </div>
    </div>
  )
}

function PartnerCard({
  name,
  color,
  available
}: {
  name: string
  color: 'heli' | 'shahar'
  available: number
}) {
  const colorClass = color === 'heli' ? 'text-heli' : 'text-shahar'

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className={`text-xl ${colorClass}`}>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Available to Withdraw
          </p>
          <p className={`text-hero font-bold ${available >= 0 ? 'text-green' : 'text-red'}`}>
            ₪{available.toLocaleString()}
          </p>
        </div>

        <Button variant="outline" className="w-full">
          Record New Withdrawal
        </Button>
      </CardContent>
    </Card>
  )
}
