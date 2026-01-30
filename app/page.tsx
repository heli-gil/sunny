import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-12 text-center max-w-md">
        <Image
          src="/logo.png"
          alt="Sunny"
          width={80}
          height={80}
          className="mx-auto mb-6 rounded-xl"
        />
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Sunny
        </h1>
        <p className="text-muted-foreground mb-8">
          Automation Flow&apos;s CFO
        </p>
        <p className="text-sm text-muted-foreground">
          Setting up... Dashboard coming soon.
        </p>
      </div>
    </main>
  )
}
