"use client"

import * as React from "react"
import { useTranslations, useLocale } from 'next-intl'
import Image from "next/image"
import { useTheme } from "next-themes"
import {
  LayoutDashboard,
  Brain,
  Building2,
  Users,
  FileText,
  Bell
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
      title: t('aiRecognition'),
      url: `/${locale}/ai-recognition`,
      icon: Brain,
    },
    {
      title: t('assets'),
      url: `/${locale}/assets`,
      icon: Building2,
    },
    {
      title: t('contractors'),
      url: `/${locale}/contractors`,
      icon: Users,
    },
    {
      title: t('contracts'),
      url: `/${locale}/contracts`,
      icon: FileText,
    },
    {
      title: t('notifications'),
      url: `/${locale}/notifications`,
      icon: Bell,
    },
  ]

  return (
    <Sidebar collapsible="icon" side={side} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href={`/${locale}/dashboard`}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:size-8 hidden">
                  <Image
                    src={logoSrc}
                    alt="Peak&Peek"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <Image
                    src={logoSrc}
                    alt="Peak&Peek"
                    width={100}
                    height={32}
                    className="object-contain mb-1"
                  />
                  <span className="text-xs text-muted-foreground">{t('infrastructureManagement')}</span>
                </div>
              </a>
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
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
