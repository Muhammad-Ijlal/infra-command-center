export type NotificationType = 'ai_detection' | 'asset_update' | 'contractor_match' | 'contract_update' | 'approval_required' | 'system'
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Notification {
  notification_id: string
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  timestamp: string
  read: boolean
  module: 'ai' | 'asset' | 'contractor' | 'contract' | 'system'
  action_url?: string
  metadata?: Record<string, unknown>
}

