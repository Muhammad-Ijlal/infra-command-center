export type NotificationType = 'ai_detection' | 'asset_update' | 'contractor_match' | 'contract_update' | 'approval_required' | 'system' | 'maintenance_scheduled' | 'weather_alert' | 'repair_completed' | 'engineer_assignment' | 'sla_alert'
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
  // Reference IDs instead of hardcoded URLs
  contract_id?: string
  tender_id?: string
  detection_id?: string
  asset_id?: string
  contractor_id?: string
  action_url?: string // Keep as fallback for complex URLs
  metadata?: Record<string, unknown>
}

