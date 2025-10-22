import { Notification } from '@/types/notification'

export const mockNotifications: Notification[] = [
  // DET-007 - Dead Street Light (Pending)
  {
    notification_id: 'NOT-001',
    type: 'ai_detection',
    title: 'Issue Detected',
    message: 'Dead street light detected at SL-STR-009. Fixture shows no signs of illumination during night inspection.',
    priority: 'medium',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    read: false,
    module: 'ai',
    detection_id: 'DET-007',
    asset_id: 'SL-STR-002',
    metadata: {
      defect_type: 'electrical',
      severity: 'warning',
      confidence: 0.89
    }
  },
  
  // DET-008 - Broken Barrier (Pending)
  {
    notification_id: 'NOT-004',
    type: 'ai_detection',
    title: 'Issue Detected',
    message: 'Broken barrier detected at RD-BAR-008 during routine inspection. Requires structural repair.',
    priority: 'medium',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
    read: false,
    module: 'ai',
    detection_id: 'DET-008',
    asset_id: 'RD-BAR-008',
    metadata: {
      defect_type: 'barrier_damage',
      severity: 'warning',
      confidence: 0.86
    }
  },

  // DET-006 - Broken Barrier (Pending)
  {
    notification_id: 'NOT-005',
    type: 'ai_detection',
    title: 'Issue Detected',
    message: 'Broken barrier detected at RD-BAR-006 with visible damage. Awaiting engineer assignment.',
    priority: 'medium',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    read: false,
    module: 'ai',
    detection_id: 'DET-006',
    asset_id: 'RD-BAR-006',
    metadata: {
      defect_type: 'barrier_damage',
      severity: 'warning',
      confidence: 0.93
    }
  },

  // DET-005 - Dead Street Light (In Progress)
  {
    notification_id: 'NOT-003',
    type: 'ai_detection',
    title: 'Issue Detected',
    message: 'Dead street light detected at SL-STR-007 during night patrol. No illumination from the fixture.',
    priority: 'medium',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    read: true,
    module: 'ai',
    detection_id: 'DET-005',
    asset_id: 'SL-STR-007',
    metadata: {
      defect_type: 'electrical',
      severity: 'warning',
      confidence: 0.95
    }
  },
  {
    notification_id: 'NOT-003B',
    type: 'engineer_assignment',
    title: 'Engineer Assigned',
    message: 'Alexander Müller (ENG-001) has been assigned to repair the dead street light at SL-STR-007.',
    priority: 'medium',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 5.5 hours ago
    read: true,
    module: 'ai',
    detection_id: 'DET-005',
    asset_id: 'SL-STR-007',
    metadata: {
      engineer_id: 'ENG-001',
      engineer_name: 'Alexander Müller',
      assignment_timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString()
    }
  },
  
  // DET-004 - Broken Barrier (Pending - Critical)
  {
    notification_id: 'NOT-006',
    type: 'ai_detection',
    title: 'Critical Issue Detected',
    message: 'Broken barrier detected at RD-BAR-004 requiring immediate attention. Structural integrity compromised.',
    priority: 'urgent',
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), // 16 hours ago
    read: false,
    module: 'ai',
    detection_id: 'DET-004',
    asset_id: 'RD-BAR-004',
    metadata: {
      defect_type: 'barrier_damage',
      severity: 'critical',
      confidence: 0.88
    }
  },

  // DET-003 - Damaged Barrier (In Progress)
  {
    notification_id: 'NOT-007',
    type: 'ai_detection',
    title: 'Issue Detected',
    message: 'Damaged barrier detected at RD-BAR-003 with visible structural compromise. Repair work currently underway.',
    priority: 'medium',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
    read: true,
    module: 'ai',
    detection_id: 'DET-003',
    asset_id: 'RD-BAR-003',
    metadata: {
      defect_type: 'barrier_damage',
      severity: 'warning',
      confidence: 0.91
    }
  },
  {
    notification_id: 'NOT-008',
    type: 'engineer_assignment',
    title: 'Engineer Assigned',
    message: 'Marco Rossi (ENG-002) has been assigned to repair the damaged barrier at RD-BAR-003.',
    priority: 'medium',
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 9.5 hours ago
    read: true,
    module: 'ai',
    detection_id: 'DET-003',
    asset_id: 'RD-BAR-003',
    metadata: {
      engineer_id: 'ENG-002',
      engineer_name: 'Marco Rossi',
      assignment_timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString()
    }
  },

  // DET-002 - Dead Street Light (Completed)
  {
    notification_id: 'NOT-011',
    type: 'repair_completed',
    title: 'Issue Resolution Updated',
    message: 'Street light repair completed at SL-STR-002. AI validation approved with 92% confidence.',
    priority: 'low',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // 6 days ago at 7:15 AM
    read: true,
    module: 'ai',
    detection_id: 'DET-002',
    asset_id: 'SL-STR-002',
    metadata: {
      repair_completed_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
      ai_validation_result: 'approved',
      validation_confidence: 0.92,
      engineer_id: 'ENG-001',
      engineer_name: 'Alexander Müller'
    }
  },
  {
    notification_id: 'NOT-010',
    type: 'engineer_assignment',
    title: 'Engineer Assigned',
    message: 'Alexander Müller (ENG-001) has been assigned to repair the dead street light at SL-STR-002.',
    priority: 'medium',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000).toISOString(), // 7 days ago at 8 PM
    read: true,
    module: 'ai',
    detection_id: 'DET-002',
    asset_id: 'SL-STR-002',
    metadata: {
      engineer_id: 'ENG-001',
      engineer_name: 'Alexander Müller',
      assignment_timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    notification_id: 'NOT-009',
    type: 'ai_detection',
    title: 'Issue Detected',
    message: 'Dead street light detected at SL-STR-002 during night inspection. No illumination observed from the fixture.',
    priority: 'medium',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), // 7 days ago at 7:45 PM
    read: true,
    module: 'ai',
    detection_id: 'DET-002',
    asset_id: 'SL-STR-002',
    metadata: {
      defect_type: 'electrical',
      severity: 'warning',
      confidence: 0.97
    }
  },
  

  // DET-001 - Damaged Road Barrier (Completed)
  {
    notification_id: 'NOT-014',
    type: 'repair_completed',
    title: 'Issue Resolution Updated',
    message: 'Road barrier repair completed at RD-BAR-001. AI validation approved with 89% confidence.',
    priority: 'low',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), // 8 days ago at 2:45 PM
    read: true,
    module: 'ai',
    detection_id: 'DET-001',
    asset_id: 'RD-BAR-001',
    metadata: {
      repair_completed_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
      ai_validation_result: 'approved',
      validation_confidence: 0.89,
      engineer_id: 'ENG-003',
      engineer_name: 'Sophie Dubois'
    }
  },
  {
    notification_id: 'NOT-013',
    type: 'engineer_assignment',
    title: 'Engineer Assigned',
    message: 'Sophie Dubois (ENG-003) has been assigned to repair the damaged barrier at RD-BAR-001.',
    priority: 'medium',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // 8 days ago at 9:15 AM
    read: true,
    module: 'ai',
    detection_id: 'DET-001',
    asset_id: 'RD-BAR-001',
    metadata: {
      engineer_id: 'ENG-003',
      engineer_name: 'Sophie Dubois',
      assignment_timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString()
    }
  },
  {
    notification_id: 'NOT-012',
    type: 'ai_detection',
    title: 'Issue Detected',
    message: 'Damaged road barrier detected at RD-BAR-001 requiring immediate attention. Visible structural damage to the barrier system.',
    priority: 'medium',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 8 days ago at 8:30 AM
    read: true,
    module: 'ai',
    detection_id: 'DET-001',
    asset_id: 'RD-BAR-001',
    metadata: {
      defect_type: 'barrier_damage',
      severity: 'warning',
      confidence: 0.94
    }
  }
]

