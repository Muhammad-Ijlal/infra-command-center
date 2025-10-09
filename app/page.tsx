import { redirect } from "next/navigation"
import { isAuthenticated } from "@/src/lib/auth/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const authenticated = await isAuthenticated()

  if (authenticated) {
    redirect('/early-access-users')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="container flex max-w-4xl flex-col items-center gap-8 px-4 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Infra Command Center
          </h1>
          <p className="text-xl text-muted-foreground sm:text-2xl">
            Internal Administration Platform
          </p>
        </div>

        <p className="max-w-2xl text-lg text-muted-foreground">
          Manage early access users, monitor waitlist applications, and control platform access through a streamlined administrative interface.
        </p>

        <Button asChild size="lg">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    </div>
  )
}
 