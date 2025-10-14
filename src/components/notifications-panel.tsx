"use client"

import { useState } from "react"
import { Bell, Brain, Building2, Users, FileText, CheckCircle2, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { mockNotifications } from "@/data/mock-notifications"
import { Notification } from "@/types/notification"
import { generateNotificationActionUrl } from "@/lib/notification-utils"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useParams } from "next/navigation"

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length
  const params = useParams()
  const locale = params.locale as string || 'en'

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.notification_id === notificationId ? { ...n, read: true } : n
      )
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleViewDetails = () => {
    setIsOpen(false)
  }

  const getModuleIcon = (module: Notification['module']) => {
    switch (module) {
      case 'ai':
        return <Brain className="h-4 w-4" />
      case 'asset':
        return <Building2 className="h-4 w-4" />
      case 'contractor':
        return <Users className="h-4 w-4" />
      case 'contract':
        return <FileText className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMins = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMins < 60) {
      return `${diffInMins}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 hover:bg-red-600"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex flex-col gap-3 pr-8">
            <SheetTitle>Notifications</SheetTitle>
            <div className="flex items-center justify-between">
              <SheetDescription>
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </SheetDescription>
              {unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 text-xs shrink-0"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Mark all
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-4" />

        <ScrollArea className="h-[calc(100vh-180px)] pr-4">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={cn(
                    "rounded-lg border p-2.5 space-y-2 transition-colors",
                    !notification.read && "bg-blue-50/50 border-blue-200"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={cn(
                      "rounded-full p-1.5 mt-0.5 shrink-0",
                      getPriorityColor(notification.priority)
                    )}>
                      {getModuleIcon(notification.module)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-tight">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <Button
                            onClick={() => handleMarkAsRead(notification.notification_id)}
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 shrink-0 -mt-1"
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {notification.message} <span className="text-muted-foreground/70">· {formatTimestamp(notification.timestamp)}</span>
                      </p>
                    </div>
                  </div>
                  {(notification.contract_id || notification.tender_id || notification.detection_id || notification.asset_id || notification.contractor_id || notification.action_url) && (
                    <Link href={generateNotificationActionUrl(notification, locale)} className="block pl-8">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs h-6"
                        onClick={handleViewDetails}
                      >
                        View Details
                      </Button>
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

