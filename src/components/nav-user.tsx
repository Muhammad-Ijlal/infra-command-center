"use client"

import { User2 } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg">
              <User2 className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 ltr:text-left rtl:text-right text-sm leading-tight">
            <span className="truncate font-medium">Demo User</span>
            <span className="truncate text-xs text-muted-foreground">demo@infracommand.qa</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
