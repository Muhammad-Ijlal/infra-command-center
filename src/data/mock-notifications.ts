import { Notification } from '@/types/notification'

export const mockNotifications: Notification[] = [
  {
    notification_id: 'NOTIF-001',
    type: 'ai_detection',
    title: 'New Critical Detection',
    message: 'Critical structural issue detected on Highway 65 Overpass',
    priority: 'urgent',
    timestamp: '2025-10-08T12:00:00Z',
    read: false,
    module: 'ai',
    action_url: '/ai-recognition?detection=DET-006'
  },
  {
    notification_id: 'NOTIF-002',
    type: 'contract_update',
    title: 'Contract Approved',
    message: 'Contract CTR-001 for King Fahd Road has been approved and sent to contractor',
    priority: 'high',
    timestamp: '2025-10-08T10:30:00Z',
    read: false,
    module: 'contract',
    action_url: '/contracts?contract=CTR-001'
  },
  {
    notification_id: 'NOTIF-003',
    type: 'approval_required',
    title: 'Approval Required',
    message: 'Bridge Corrosion Treatment contract pending Operations Manager approval',
    priority: 'high',
    timestamp: '2025-10-07T16:45:00Z',
    read: false,
    module: 'contract',
    action_url: '/contracts?contract=CTR-002'
  },
  {
    notification_id: 'NOTIF-004',
    type: 'ai_detection',
    title: 'Detection Validated',
    message: 'Detection DET-002 has been validated and linked to asset ASSET-B-003',
    priority: 'medium',
    timestamp: '2025-10-08T09:15:00Z',
    read: true,
    module: 'ai',
    action_url: '/ai-recognition?detection=DET-002'
  },
  {
    notification_id: 'NOTIF-005',
    type: 'contractor_match',
    title: 'Contractor Matched',
    message: 'Top 3 contractors identified for Olaya Intersection repair',
    priority: 'medium',
    timestamp: '2025-10-08T08:20:00Z',
    read: true,
    module: 'contractor',
    action_url: '/contractors?asset=ASSET-R-002'
  },
  {
    notification_id: 'NOTIF-006',
    type: 'asset_update',
    title: 'Asset Status Updated',
    message: 'ASSET-L-012 status changed to Under Maintenance',
    priority: 'low',
    timestamp: '2025-10-07T14:00:00Z',
    read: true,
    module: 'asset',
    action_url: '/assets?asset=ASSET-L-012'
  },
  {
    notification_id: 'NOTIF-007',
    type: 'contract_update',
    title: 'Contract Sent',
    message: 'CTR-003 has been sent to ElectroTech Solutions',
    priority: 'medium',
    timestamp: '2025-10-06T11:30:00Z',
    read: true,
    module: 'contract',
    action_url: '/contracts?contract=CTR-003'
  }
]

