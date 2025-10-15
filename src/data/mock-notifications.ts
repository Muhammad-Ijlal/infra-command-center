import { Notification } from '@/types/notification'

export const mockNotifications: Notification[] = [
  {
    notification_id: 'NOTIF-001',
    type: 'contract_update',
    title: 'Contract Approved',
    message: 'Contract CTR-001 for King Fahd Road pothole repair has been approved by Operations Manager',
    priority: 'high',
    timestamp: '2025-10-08T14:30:00Z',
    read: false,
    module: 'contract',
    contract_id: 'CTR-001'
  },
  {
    notification_id: 'NOTIF-002',
    type: 'ai_detection',
    title: 'New Detection Alert',
    message: 'Critical pothole detected on Corniche Road requiring immediate attention',
    priority: 'urgent',
    timestamp: '2025-10-08T15:45:00Z',
    read: false,
    module: 'ai',
    detection_id: 'DET-001'
  },
  {
    notification_id: 'NOTIF-003',
    type: 'ai_detection',
    title: 'New Critical Detection Alert',
    message: 'Critical structural crack detected in West Bay Traffic Control Tower control room',
    priority: 'urgent',
    timestamp: '2025-10-08T12:00:00Z',
    read: false,
    module: 'ai',
    detection_id: 'DET-006'
  },
  {
    notification_id: 'NOTIF-004',
    type: 'maintenance_scheduled',
    title: 'Scheduled Maintenance Reminder',
    message: 'Routine maintenance scheduled for Lusail Expressway Bridge in 3 days',
    priority: 'medium',
    timestamp: '2025-10-08T16:00:00Z',
    read: true,
    module: 'asset',
    asset_id: 'ASSET-B-001'
  },
  {
    notification_id: 'NOTIF-005',
    type: 'weather_alert',
    title: 'Weather Alert - Precautionary Maintenance',
    message: 'Heavy rain forecasted. Al Sadd Bridge requires precautionary maintenance check',
    priority: 'high',
    timestamp: '2025-10-08T16:15:00Z',
    read: false,
    module: 'asset',
    asset_id: 'ASSET-B-003'
  },
  {
    notification_id: 'NOTIF-006',
    type: 'maintenance_scheduled',
    title: 'Maintenance Due Soon',
    message: 'Scheduled maintenance for C-Ring Road lighting system due in 2 days',
    priority: 'medium',
    timestamp: '2025-10-08T17:00:00Z',
    read: true,
    module: 'asset',
    asset_id: 'ASSET-L-012'
  },
  {
    notification_id: 'NOTIF-007',
    type: 'weather_alert',
    title: 'Sandstorm Alert',
    message: 'Sandstorm warning issued. All outdoor assets require protective measures',
    priority: 'high',
    timestamp: '2025-10-08T17:30:00Z',
    read: true,
    module: 'asset',
  }
]

