"use client"

import * as React from "react"
import { useTranslations, useLocale } from 'next-intl'
import {
  Command,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations('common')
  const locale = useLocale()
  
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-sm leading-tight ltr:text-left rtl:text-right">
                  <span className="truncate font-medium">Infra Command Center</span>
                  <span className="truncate text-xs">Infrastructure Management Platform</span>
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
