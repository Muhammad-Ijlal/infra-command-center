'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useSupabase } from '@/lib/providers/supabase-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Shield, TrendingUp, Clock, BarChart3 } from 'lucide-react'

export function LoginForm() {
  const { signIn, loading } = useSupabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding and Features */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo_light.png"
                alt="TRAGS"
                width={200}
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Command Center
            </h1>
            <p className="text-lg text-gray-600">
              Simplify the full maintenance lifecycle — with AI identification of issues, automated mapping of asset and a simple resource allocation and resolution flow
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <Shield className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">AI Detection</h3>
                <p className="text-sm text-gray-600">Automated defect identification</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Predictive Analytics</h3>
                <p className="text-sm text-gray-600">Upcoming defect prediction</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <Clock className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">SLA Management</h3>
                <p className="text-sm text-gray-600">Fulfillment and tracking tools</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <BarChart3 className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">Real-time insights and reporting</p>
              </div>
            </div>
          </div>

          <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4">
            <p className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wider">
              Built to Meet Standards
            </p>
            <div className="flex flex-wrap gap-2" dir="ltr">
              <div className="bg-white/50 border-gray-200 flex items-center gap-1 rounded border px-2 py-1">
                <span className="text-primary text-xs font-bold">ISO</span>
                <span className="text-muted-foreground text-xs">55001</span>
              </div>
              <div className="bg-white/50 border-gray-200 flex items-center gap-1 rounded border px-2 py-1">
                <span className="text-primary text-xs font-bold">ISO</span>
                <span className="text-muted-foreground text-xs">9001</span>
              </div>
              <div className="bg-white/50 border-gray-200 flex items-center gap-1 rounded border px-2 py-1">
                <span className="text-primary text-xs font-bold">ISO</span>
                <span className="text-muted-foreground text-xs">27001</span>
              </div>
              <div className="bg-white/50 border-gray-200 flex items-center gap-1 rounded border px-2 py-1">
                <span className="text-primary text-xs font-bold">QCS</span>
                <span className="text-muted-foreground text-xs">Ready</span>
              </div>
              <div className="bg-white/50 border-gray-200 flex items-center gap-1 rounded border px-2 py-1">
                <span className="text-xs">🇶🇦</span>
                <span className="text-muted-foreground text-xs">Vision 2030</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2">
              <div className="flex justify-center lg:hidden mb-4">
                <Image
                  src="/logo_light.png"
                  alt="TRAGS"
                  width={150}
                  height={45}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to access your command center
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </Button>
              </form>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
