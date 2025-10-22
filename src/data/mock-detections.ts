import { AIDetection } from '@/types/detection'

export const mockDetections: AIDetection[] = [
  {
    detection_id: 'DET-008',
    asset_id: 'RD-BAR-008',
    defect_type: 'barrier_damage',
    confidence_score: 0.86,
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
    status: 'pending',
    severity: 'warning',
    description: 'Broken barrier detected during routine inspection. Requires structural repair.',
    image_url: '/detections/DET-008.png',
    location: {
      lat: 25.2867,
      lng: 51.5304
    },
    sla_hours: 24,
    sla_deadline: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(), // 10 hours from now
    detection_device: 'Mobile Inspection Unit',
    device_model: 'MIU-2024'
  },
  {
    detection_id: 'DET-007',
    asset_id: 'SL-STR-002',
    defect_type: 'electrical',
    confidence_score: 0.89,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    status: 'pending',
    severity: 'warning',
    description: 'Dead street light detected. Fixture shows no signs of illumination during night inspection.',
    image_url: '/detections/DET-007.png',
    location: {
      lat: 25.2901,
      lng: 51.5312
    },
    sla_hours: 12,
    sla_deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    detection_device: 'Mobile Inspection Unit',
    device_model: 'MIU-2024'
  },
  {
    detection_id: 'DET-006',
    asset_id: 'RD-BAR-006',
    defect_type: 'barrier_damage',
    confidence_score: 0.93,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    status: 'pending',
    severity: 'warning',
    description: 'Broken barrier detected with visible damage. Awaiting engineer assignment.',
    image_url: '/detections/DET-006.png',
    location: {
      lat: 25.2898,
      lng: 51.5276
    },
    sla_hours: 24,
    sla_deadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
    detection_device: 'Mobile Inspection Unit',
    device_model: 'MIU-2024'
  },
  {
    detection_id: 'DET-005',
    asset_id: 'SL-STR-007',
    defect_type: 'electrical',
    confidence_score: 0.95,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    status: 'in_progress',
    severity: 'warning',
    description: 'Dead street light detected during night patrol. No illumination from the fixture.',
    image_url: '/detections/DET-005.png',
    location: {
      lat: 25.2845,
      lng: 51.5289
    },
    assigned_engineer_id: 'ENG-001',
    assigned_engineer_name: 'Alexander Müller',
    assignment_timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 5.5 hours ago
    sla_hours: 12,
    sla_deadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
    repair_started_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    detection_device: 'Mobile Inspection Unit',
    device_model: 'MIU-2024'
  },
  {
    detection_id: 'DET-004',
    asset_id: 'RD-BAR-004',
    defect_type: 'barrier_damage',
    confidence_score: 0.88,
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), // 16 hours ago
    status: 'pending',
    severity: 'critical',
    description: 'Broken barrier detected requiring immediate attention. Structural integrity compromised.',
    image_url: '/detections/DET-004.png',
    location: {
      lat: 25.2834,
      lng: 51.5321
    },
    sla_hours: 24,
    sla_deadline: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
    detection_device: 'Mobile Inspection Unit',
    device_model: 'MIU-2024'
  },
  {
    detection_id: 'DET-003',
    asset_id: 'RD-BAR-003',
    defect_type: 'barrier_damage',
    confidence_score: 0.91,
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
    status: 'in_progress',
    severity: 'warning',
    description: 'Damaged barrier detected with visible structural compromise. Repair work currently underway.',
    image_url: '/detections/DET-003.png',
    location: {
      lat: 25.2876,
      lng: 51.5298
    },
    assigned_engineer_id: 'ENG-002',
    assigned_engineer_name: 'Marco Rossi',
    assignment_timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 9.5 hours ago
    sla_hours: 24,
    sla_deadline: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(), // 14 hours from now
    repair_started_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    detection_device: 'Mobile Inspection Unit',
    device_model: 'MIU-2024'
  },
  {
    detection_id: 'DET-002',
    asset_id: 'SL-STR-002',
    defect_type: 'electrical',
    confidence_score: 0.97,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), // 7 days ago at 7:45 PM
    status: 'completed',
    severity: 'warning',
    description: 'Dead street light detected during night inspection. No illumination observed from the fixture.',
    image_url: '/detections/DET-002.png',
    repair_image_url: '/detections/DET-002-Done.png',
    location: {
      lat: 25.2912,
      lng: 51.5287
    },
    assigned_engineer_id: 'ENG-001',
    assigned_engineer_name: 'Alexander Müller',
    assignment_timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000).toISOString(), // 7 days ago at 8 PM
    sla_hours: 12,
    sla_deadline: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(), // 6 days ago at 8 AM
    repair_started_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 6 days ago at 6:30 AM
    repair_completed_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // 6 days ago at 7:15 AM
    ai_validation_result: 'approved',
    validation_confidence: 0.92,
    detection_device: 'Mobile Inspection Unit',
    device_model: 'MIU-2024'
  },
  {
    detection_id: 'DET-001',
    asset_id: 'RD-BAR-001',
    defect_type: 'barrier_damage',
    confidence_score: 0.94,
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 8 days ago at 8:30 AM
    status: 'completed',
    severity: 'warning',
    description: 'Damaged road barrier requiring immediate attention. Visible structural damage to the barrier system.',
    image_url: '/detections/DET-001.png',
    repair_image_url: '/detections/DET-001-Done.png',
    location: {
      lat: 25.2854,
      lng: 51.5310
    },
    assigned_engineer_id: 'ENG-003',
    assigned_engineer_name: 'Sophie Dubois',
    assignment_timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // 8 days ago at 9:15 AM
    sla_hours: 24,
    sla_deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // 7 days ago at 9:15 AM
    repair_started_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 8 days ago at 10:30 AM
    repair_completed_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), // 8 days ago at 2:45 PM
    ai_validation_result: 'approved',
    validation_confidence: 0.89,
    detection_device: 'Mobile Inspection Unit',
    device_model: 'MIU-2024'
  }
]
