import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Income"
          value="₪0"
          trend="+0%"
          trendUp={true}
        />
        <StatsCard
          title="COGS"
          value="₪0"
        />
        <StatsCard
          title="OPEX"
          value="₪0"
        />
        <StatsCard
          title="Gross Margin"
          value="0%"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Net Profit"
          value="₪0"
        />
        <StatsCard
          title="Partner Difference"
          value="Even"
        />
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No open invoices
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({
  title,
  value,
  trend,
  trendUp
}: {
  title: string
  value: string
  trend?: string
  trendUp?: boolean
}) {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trendUp ? 'text-green' : 'text-red'}`}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
