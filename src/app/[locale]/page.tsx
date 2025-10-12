"use client"

import { Link } from "@/i18n/routing"
import Image from "next/image"
import { useTranslations } from 'next-intl'
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { LanguageSwitcher } from "@/components/language-switcher"
import LogosGrid from "@/components/sections/logos/grid"
import StickyNavbar from "@/components/sections/navbar/sticky"
import Glow from "@/components/ui/glow"
import { 
  Brain, 
  Building2, 
  Users, 
  FileText, 
  Bell, 
  LayoutDashboard 
} from "lucide-react"

export default function Home() {
  const t = useTranslations('landing')
  const tc = useTranslations('common')
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine which logo to show
  const logoSrc = mounted && (resolvedTheme === "dark" || theme === "dark")
    ? "/logo_dark.png"
    : "/logo_light.png"

  const features = [
    { icon: Brain, label: t('aiDetections') },
    { icon: Building2, label: t('assetManagement') },
    { icon: Users, label: t('contractors') },
    { icon: FileText, label: t('commandCenter') },
    { icon: Bell, label: t('notifications') },
    { icon: LayoutDashboard, label: t('dashboard') },
  ]
  
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Sticky Navbar */}
      <StickyNavbar
        logo={
          <Image
            src={logoSrc}
            alt="Peak&Peek"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        }
        homeUrl="/"
        customActions={
          <>
            <LanguageSwitcher />
            <Button variant="default" asChild>
              <Link href="/dashboard">
                {tc('launchDemo')}
              </Link>
            </Button>
          </>
        }
      />

      {/* Hero Section */}
      <Section className="relative flex-1 overflow-hidden pb-0 sm:pb-0 md:pb-0">
        <div className="max-w-container relative z-10 mx-auto flex flex-col gap-12 pt-16 sm:gap-16">
          <div className="flex flex-col items-center gap-6 text-center sm:gap-10">
            {/* Logo */}
            <div className="animate-appear opacity-0">
              <Image
                src={logoSrc}
                alt="Peak&Peek"
                width={300}
                height={100}
                className="h-auto w-[250px] object-contain sm:w-[300px] md:w-[350px]"
                priority
              />
            </div>

            {/* Subtitle */}
            <p className="animate-appear text-xl font-semibold opacity-0 delay-100 sm:text-2xl">
              {t('subtitle')}
            </p>

            {/* Description */}
            <p className="text-md animate-appear text-muted-foreground relative z-10 max-w-[740px] font-medium text-balance opacity-0 delay-200 sm:text-xl">
              {t('description')}
            </p>

            {/* CTA Button */}
            <div className="animate-appear relative z-10 flex justify-center gap-4 opacity-0 delay-300">
              <Button size="lg" variant="default" asChild>
                <Link href="/dashboard">
                  {tc('launchDemo')}
                </Link>
              </Button>
            </div>

            {/* Feature Icons Grid */}
            <div className="animate-appear relative z-10 mt-8 grid w-full max-w-3xl grid-cols-2 gap-6 opacity-0 delay-500 md:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card/50 border-border/50 hover:border-primary/20 hover:bg-card/80 flex flex-col items-center gap-3 rounded-lg border p-6 backdrop-blur-sm transition-all duration-200"
                >
                  <feature.icon className="text-primary size-8" />
                  <span className="text-muted-foreground text-sm font-medium">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Glow */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
          <Glow variant="top" className="animate-appear-zoom opacity-0 delay-700" />
        </div>
      </Section>

      {/* Logo Marquee Section */}
      <LogosGrid title={t('trustedBy')} />

      {/* Footer */}
      <footer className="border-border/15 bg-background border-t pb-12">
        <div className="max-w-container mx-auto px-4">
          <div className="flex flex-col items-center gap-6 text-center">
            <Image
              src={logoSrc}
              alt="Peak&Peek"
              width={150}
              height={50}
              className="h-auto w-[120px] object-contain"
            />
            
            {/* Standards & Compliance Targets */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                Built to Meet Standards
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="bg-card/50 border-border/50 flex items-center gap-2 rounded-md border px-3 py-1.5">
                  <span className="text-primary text-xs font-bold">ISO</span>
                  <span className="text-muted-foreground text-xs">55001</span>
                </div>
                <div className="bg-card/50 border-border/50 flex items-center gap-2 rounded-md border px-3 py-1.5">
                  <span className="text-primary text-xs font-bold">ISO</span>
                  <span className="text-muted-foreground text-xs">9001</span>
                </div>
                <div className="bg-card/50 border-border/50 flex items-center gap-2 rounded-md border px-3 py-1.5">
                  <span className="text-primary text-xs font-bold">ISO</span>
                  <span className="text-muted-foreground text-xs">27001</span>
                </div>
                <div className="bg-card/50 border-border/50 flex items-center gap-2 rounded-md border px-3 py-1.5">
                  <span className="text-primary text-xs font-bold">QCS</span>
                  <span className="text-muted-foreground text-xs">Ready</span>
                </div>
                <div className="bg-card/50 border-border/50 flex items-center gap-2 rounded-md border px-3 py-1.5">
                  <span className="text-primary text-xs font-bold">🇸🇦</span>
                  <span className="text-muted-foreground text-xs">Vision 2030</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-xs">
              © 2025 Peak&Peek. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
 