import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { NotificationsPanel } from "@/components/notifications-panel"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function DashboardLayout({
  children,
  params,
}: Props) {
  const { locale } = await params
  const isRTL = locale === 'ar'
  const sidebarSide = isRTL ? 'right' : 'left'

  return (
    <SidebarProvider>
      <AppSidebar side={sidebarSide} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4 py-2 w-full justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className={isRTL ? "-mr-1" : "-ml-1"} />
              <Separator
                orientation="vertical"
                className={isRTL ? "ml-2 data-[orientation=vertical]:h-4" : "mr-2 data-[orientation=vertical]:h-4"}
              />
            </div>
            <NotificationsPanel />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
