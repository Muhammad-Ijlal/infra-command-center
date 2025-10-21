"use client"

import { User2, LogOut } from "lucide-react"
import { useSupabase } from "@/lib/providers/supabase-provider"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavUser() {
  const { user, userProfile, signOut } = useSupabase()

  const handleSignOut = async () => {
    await signOut()
  }

  const displayName = userProfile 
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : user?.email || 'User'
  
  const displayEmail = userProfile?.email || user?.email || ''

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  <User2 className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 ltr:text-left rtl:text-right text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">{displayEmail}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" side="bottom">
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
