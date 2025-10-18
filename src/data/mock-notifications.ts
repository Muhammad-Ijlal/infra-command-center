import { Notification } from '@/types/notification'

export const mockNotifications: Notification[] = [
  {
    notification_id: 'NOTIF-001',
    type: 'repair_completed',
    title: 'Barrier Repair Completed',
    message: 'Barrier repair on Corniche Road completed successfully - AI validation approved',
    priority: 'medium',
    timestamp: '2025-01-08T18:50:00Z',
    read: false,
    module: 'ai',
    detection_id: 'DET-003'
  },
  {
    notification_id: 'NOTIF-002',
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
    notification_id: 'NOTIF-003',
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
    notification_id: 'NOTIF-004',
    type: 'weather_alert',
    title: 'Sandstorm Alert',
    message: 'Sandstorm warning issued. All outdoor assets require protective measures',
    priority: 'high',
    timestamp: '2025-10-08T17:30:00Z',
    read: true,
    module: 'asset',
  },
  {
    notification_id: 'NOTIF-005',
    type: 'ai_detection',
    title: 'Traffic Signal Failure Alert',
    message: 'Critical traffic signal light failure detected at Corniche intersection - immediate repair required',
    priority: 'urgent',
    timestamp: '2025-01-08T10:20:00Z',
    read: false,
    module: 'ai',
    detection_id: 'DET-002'
  },
  {
    notification_id: 'NOTIF-006',
    type: 'engineer_assignment',
    title: 'Engineer Assigned to Traffic Signal Repair',
    message: 'Alexander Müller has been assigned to repair traffic signal at Corniche intersection',
    priority: 'high',
    timestamp: '2025-01-08T10:35:00Z',
    read: false,
    module: 'ai',
    detection_id: 'DET-002'
  },
  {
    notification_id: 'NOTIF-007',
    type: 'sla_alert',
    title: 'SLA Deadline Approaching',
    message: 'Traffic signal repair SLA deadline approaching - 2 hours remaining for DET-002',
    priority: 'high',
    timestamp: '2025-01-08T12:30:00Z',
    read: false,
    module: 'ai',
    detection_id: 'DET-002'
  },
  {
    notification_id: 'NOTIF-008',
    type: 'engineer_assignment',
    title: 'Engineer Assigned to Barrier Repair',
    message: 'Sophie Dubois has been assigned to repair barrier damage on Corniche Road',
    priority: 'high',
    timestamp: '2025-01-08T09:05:00Z',
    read: true,
     module: 'ai',
     detection_id: 'DET-003'
   },
   {
    notification_id: 'NOTIF-009',
    type: 'ai_detection',
    title: 'Barrier Damage Alert',
    message: 'Critical barrier damage detected on Corniche Road - immediate repair required',
    priority: 'urgent',
    timestamp: '2025-01-08T08:50:00Z',
    read: true,
    module: 'ai',
    detection_id: 'DET-003'
  }
]

