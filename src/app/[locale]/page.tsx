"use client"

import { Link } from "@/i18n/routing"
import Image from "next/image"
import { useTranslations } from 'next-intl'
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { LogoVolindo } from "@/components/logo-volindo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { LocaleDebug } from "@/components/locale-debug"
import LogosMarquee from "@/components/sections/logos/marquee"
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
    { icon: Brain, label: t('aiRecognition') },
    { icon: Building2, label: t('assetManagement') },
    { icon: Users, label: t('contractors') },
    { icon: FileText, label: t('contracts') },
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
              <LogoVolindo width={140} height={140} color="#E07A3F" />
            </div>

            {/* Title */}
            <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-4xl font-semibold leading-tight text-balance text-transparent drop-shadow-2xl opacity-0 delay-100 sm:text-6xl sm:leading-tight md:text-7xl md:leading-tight">
              {t('title')}
            </h1>

            {/* Subtitle */}
            <p className="animate-appear text-xl font-semibold opacity-0 delay-200 sm:text-2xl">
              {t('subtitle')}
            </p>

            {/* Description */}
            <p className="text-md animate-appear text-muted-foreground relative z-10 max-w-[740px] font-medium text-balance opacity-0 delay-300 sm:text-xl">
              {t('description')}
            </p>

            {/* CTA Button */}
            <div className="animate-appear relative z-10 flex justify-center gap-4 opacity-0 delay-500">
              <Button size="lg" variant="default" asChild>
                <Link href="/dashboard">
                  {tc('launchDemo')}
                </Link>
              </Button>
            </div>

            {/* Feature Icons Grid */}
            <div className="animate-appear relative z-10 mt-8 grid w-full max-w-3xl grid-cols-2 gap-6 opacity-0 delay-700 md:grid-cols-3">
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
          <Glow variant="top" className="animate-appear-zoom opacity-0 delay-1000" />
        </div>
      </Section>

      {/* Logo Marquee Section */}
      <LogosMarquee title={t('trustedBy')} />

      {/* Debug Component */}
      <LocaleDebug />

      {/* Footer */}
      <footer className="border-border/15 bg-background border-t py-12">
        <div className="max-w-container mx-auto px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <LogoVolindo width={28} height={28} color="#E07A3F" />
              <span className="text-lg font-semibold">Peak&Peek</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Infrastructure Management Platform for Vision 2030
            </p>
            <p className="text-muted-foreground text-xs">
              © 2025 Peak&Peek. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
 