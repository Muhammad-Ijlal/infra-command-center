"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, BellOff, Brain, Building2, Users, FileText, AlertCircle, CheckCircle2 } from "lucide-react"
import { mockNotifications } from "@/src/data/mock-notifications"
import { Notification } from "@/src/types/notification"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | Notification['module']>('all')

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
        return 'bg-red-600 text-white'
      case 'high':
        return 'bg-orange-600 text-white'
      case 'medium':
        return 'bg-blue-600 text-white'
      case 'low':
        return 'bg-gray-600 text-white'
      default:
        return 'outline'
    }
  }

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.module === filter)

  const unreadCount = notifications.filter(n => !n.read).length
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.read).length
  const highCount = notifications.filter(n => n.priority === 'high' && !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            System alerts and event notifications
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Pending notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highCount}</div>
            <p className="text-xs text-muted-foreground">Need attention soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Feed</CardTitle>
          <CardDescription>
            Real-time event stream from all modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | Notification['module'])} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="ai">
                <Brain className="h-4 w-4 mr-2" />
                AI
              </TabsTrigger>
              <TabsTrigger value="asset">
                <Building2 className="h-4 w-4 mr-2" />
                Assets
              </TabsTrigger>
              <TabsTrigger value="contractor">
                <Users className="h-4 w-4 mr-2" />
                Contractors
              </TabsTrigger>
              <TabsTrigger value="contract">
                <FileText className="h-4 w-4 mr-2" />
                Contracts
              </TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BellOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications in this category</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification.notification_id}
                    className={`${!notification.read ? 'border-l-4 border-l-blue-600 bg-blue-50/30' : ''}`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg ${
                            notification.module === 'ai' ? 'bg-purple-100' :
                            notification.module === 'asset' ? 'bg-blue-100' :
                            notification.module === 'contractor' ? 'bg-green-100' :
                            notification.module === 'contract' ? 'bg-orange-100' :
                            'bg-gray-100'
                          }`}>
                            {getModuleIcon(notification.module)}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{notification.title}</h4>
                              <Badge variant={getPriorityColor(notification.priority)} className="capitalize">
                                {notification.priority}
                              </Badge>
                              {!notification.read && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="capitalize">{notification.module} Module</span>
                              <span>•</span>
                              <span>
                                {new Date(notification.timestamp).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsRead(notification.notification_id)}
                            >
                              Mark Read
                            </Button>
                          )}
                          {notification.action_url && (
                            <Button size="sm" variant="ghost">
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Notification Types Info */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>Events tracked across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <h5 className="font-medium">AI Detection</h5>
              </div>
              <p className="text-xs text-muted-foreground">
                New defects detected, validations completed
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h5 className="font-medium">Asset Update</h5>
              </div>
              <p className="text-xs text-muted-foreground">
                Status changes, maintenance schedules
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <h5 className="font-medium">Contractor Match</h5>
              </div>
              <p className="text-xs text-muted-foreground">
                AI matching results, availability updates
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <h5 className="font-medium">Contract Update</h5>
              </div>
              <p className="text-xs text-muted-foreground">
                Approvals, status changes, submissions
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h5 className="font-medium">Approval Required</h5>
              </div>
              <p className="text-xs text-muted-foreground">
                Actions requiring your attention
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

