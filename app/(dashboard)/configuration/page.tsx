import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Configuration</h1>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="bg-background-secondary">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="lob">Lines of Business</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Expense Categories</h2>
            <Button size="sm" className="bg-blue hover:bg-blue/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground">
              Categories will be loaded from the database.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Payment Accounts</h2>
            <Button size="sm" className="bg-blue hover:bg-blue/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </div>
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground">
              Accounts will be loaded from the database.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="lob" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Lines of Business</h2>
            <Button size="sm" className="bg-blue hover:bg-blue/90">
              <Plus className="w-4 h-4 mr-2" />
              Add LOB
            </Button>
          </div>
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground">
              Lines of Business will be loaded from the database.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
