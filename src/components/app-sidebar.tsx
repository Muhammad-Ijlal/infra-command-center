"use client"

import * as React from "react"
import { useTranslations, useLocale } from 'next-intl'
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import {
  LayoutDashboard,
  Brain,
  Building2,
  Users,
  Wrench,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { LanguageSwitcher } from "@/components/language-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ side = "left", ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations('common')
  const locale = useLocale()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Determine which logo to show
  const logoSrc = mounted && (resolvedTheme === "dark" || theme === "dark")
    ? "/logo_dark.png"
    : "/logo_light.png"
  
  const navMainData = [
    {
      title: t('dashboard'),
      url: `/${locale}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: t('aiDetections'),
      url: `/${locale}/ai-detections`,
      icon: Brain,
    },
    {
      title: t('engineers'),
      url: `/${locale}/engineers`,
      icon: Wrench,
    },
    {
      title: t('contractors'),
      url: `/${locale}/contractors`,
      icon: Users,
    },
    {
      title: t('assets'),
      url: `/${locale}/assets`,
      icon: Building2,
    },
  ]

  return (
    <Sidebar collapsible="icon" side={side} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={`/${locale}/dashboard`}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:size-8 hidden">
                  <Image
                    src={logoSrc}
                    alt="TRAGS"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <Image
                    src={logoSrc}
                    alt="TRAGS"
                    width={100}
                    height={32}
                    className="object-contain mb-1"
                  />
                  <span className="text-xs text-muted-foreground">{t('infrastructureManagement')}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainData} />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <LanguageSwitcher />
        </div>        
        <NavUser />
        {/* Standards & Compliance */}
        <div className="border-sidebar-border group-data-[collapsible=icon]:hidden border-t px-3 py-3">
          <p className="text-muted-foreground mb-2 text-[10px] font-semibold uppercase tracking-wider">
            {t('builtToMeetStandards')}
          </p>
          <div className="flex flex-wrap gap-1.5" dir="ltr">
            <div className="bg-sidebar-accent/50 border-sidebar-border flex items-center gap-1 rounded border px-2 py-0.5">
              <span className="text-primary text-[10px] font-bold">ISO</span>
              <span className="text-muted-foreground text-[10px]">55001</span>
            </div>
            <div className="bg-sidebar-accent/50 border-sidebar-border flex items-center gap-1 rounded border px-2 py-0.5">
              <span className="text-primary text-[10px] font-bold">ISO</span>
              <span className="text-muted-foreground text-[10px]">9001</span>
            </div>
            <div className="bg-sidebar-accent/50 border-sidebar-border flex items-center gap-1 rounded border px-2 py-0.5">
              <span className="text-primary text-[10px] font-bold">ISO</span>
              <span className="text-muted-foreground text-[10px]">27001</span>
            </div>
            <div className="bg-sidebar-accent/50 border-sidebar-border flex items-center gap-1 rounded border px-2 py-0.5">
              <span className="text-primary text-[10px] font-bold">QCS</span>
              <span className="text-muted-foreground text-[10px]">Ready</span>
            </div>
            <div className="bg-sidebar-accent/50 border-sidebar-border flex items-center gap-1 rounded border px-2 py-0.5">
              <span className="text-[10px]">🇶🇦</span>
              <span className="text-muted-foreground text-[10px]">2030</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
