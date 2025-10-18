import { Notification } from '@/types/notification'

/**
 * Generates action URL for notifications based on their type and reference IDs
 * @param notification - The notification object
 * @param locale - The current locale (e.g., 'en', 'ar')
 * @returns The generated action URL
 */
export function generateNotificationActionUrl(notification: Notification, locale: string = 'en'): string {
  const baseUrl = `/${locale}`

  // Contract-related notifications
  if (notification.contract_id) {
    //return `${baseUrl}/command-center?contract=${notification.contract_id}`
    return `${baseUrl}/dashboard`
  }

  // Tender-related notifications
  if (notification.tender_id) {
    //return `${baseUrl}/command-center?tender=${notification.tender_id}`
    return `${baseUrl}/dashboard`
  }

  // Detection-related notifications
  if (notification.detection_id) {
    return `${baseUrl}/ai-detections?detection=${notification.detection_id}`
  }

  // Asset-related notifications
  if (notification.asset_id) {
    return `${baseUrl}/assets?asset=${notification.asset_id}`
  }

  // Contractor-related notifications
  if (notification.contractor_id) {
    return `${baseUrl}/contractors?contractor=${notification.contractor_id}`
  }

  // Fallback to hardcoded action_url if provided
  if (notification.action_url) {
    return notification.action_url.startsWith('/') 
      ? notification.action_url 
      : `${baseUrl}${notification.action_url}`
  }

  // Default fallback based on module
  switch (notification.module) {
    case 'contract':
      //return `${baseUrl}/command-center`
      return `${baseUrl}/dashboard`
    case 'ai':
      return `${baseUrl}/ai-detections`
    case 'asset':
      return `${baseUrl}/assets`
    case 'contractor':
      return `${baseUrl}/contractors`
    default:
      return `${baseUrl}/dashboard`
  }
}

/**
 * Gets the appropriate icon for notification type
 * @param notification - The notification object
 * @returns The icon name/type
 */
export function getNotificationIcon(notification: Notification): string {
  switch (notification.type) {
    case 'contract_update':
      return 'file-text'
    case 'ai_detection':
      return 'eye'
    case 'maintenance_scheduled':
      return 'calendar'
    case 'weather_alert':
      return 'cloud-rain'
    case 'approval_required':
      return 'check-circle'
    case 'contractor_match':
      return 'users'
    case 'asset_update':
      return 'building'
    case 'system':
      return 'settings'
    default:
      return 'bell'
  }
}

/**
 * Gets the appropriate color for notification priority
 * @param priority - The notification priority
 * @returns The color class
 */
export function getNotificationPriorityColor(priority: Notification['priority']): string {
  switch (priority) {
    case 'urgent':
      return 'text-red-600 bg-red-50'
    case 'high':
      return 'text-orange-600 bg-orange-50'
    case 'medium':
      return 'text-blue-600 bg-blue-50'
    case 'low':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}
