import { AIDetection } from '@/types/detection'

export const mockDetections: AIDetection[] = [
  {
    detection_id: 'DET-001',
    asset_id: 'ASSET-R-001',
    defect_type: 'pothole',
    confidence_score: 0.94,
    timestamp: '2025-10-08T14:30:00Z',
    status: 'pending',
    severity: 'critical',
    description: 'Pothole detected on Corniche Road, requires immediate attention',
    location: { lat: 25.2854, lng: 51.5310 },
    image_url: '/detections/DET-001.jpg',
    contract_id: 'CTR-001' // Has active contract
  },
  {
    detection_id: 'DET-002',
    asset_id: 'ASSET-B-003',
    defect_type: 'corrosion',
    confidence_score: 0.87,
    timestamp: '2025-10-08T10:15:00Z',
    status: 'validated',
    severity: 'warning',
    description: 'Corrosion detected on Al Sadd Bridge support structure',
    location: { lat: 25.2866, lng: 51.5362 },
    image_url: '/detections/DET-002.jpg',
    tender_id: 'TND-002' // Has tender
  },
  {
    detection_id: 'DET-003',
    asset_id: 'ASSET-R-002',
    defect_type: 'blocked drain',
    confidence_score: 0.92,
    timestamp: '2025-10-08T08:45:00Z',
    status: 'validated',
    severity: 'warning',
    description: 'Debris build up causing main drainage system to be blocked on Al Waab Street intersection',
    location: { lat: 25.2500, lng: 51.4500 },
    image_url: '/detections/DET-003.jpg',
    contract_id: 'CTR-004' // Has active contract
  },
  {
    detection_id: 'DET-004',
    asset_id: 'ASSET-L-012',
    defect_type: 'tree lean',
    confidence_score: 0.78,
    timestamp: '2025-10-07T22:30:00Z',
    status: 'pending',
    severity: 'critical',
    description: 'Derooted tree leaning on house on C-Ring Road',
    location: { lat: 25.2760, lng: 51.5250 },
    image_url: '/detections/DET-004.jpg',
    contract_id: 'CTR-003' // Has framework contract
  },
  {
    detection_id: 'DET-005',
    asset_id: 'ASSET-L-012',
    defect_type: 'survilance',
    confidence_score: 0.65,
    timestamp: '2025-10-07T16:20:00Z',
    status: 'resolved',
    severity: 'normal',
    description: 'Low image quality on surveilance camera on C-Ring Road',
    location: { lat: 25.3200, lng: 51.5300 },
    image_url: '/detections/DET-005.jpg',
    contract_id: 'CTR-005' // Has completed contract (not displayed in table)
  },
  {
    detection_id: 'DET-006',
    asset_id: 'ASSET-B-001',
    defect_type: 'structural deterioration',
    confidence_score: 0.96,
    timestamp: '2025-10-07T12:00:00Z',
    status: 'pending',
    severity: 'critical',
    description: 'Road surface deterioration on Lusail Expressway bridge',
    location: { lat: 25.4200, lng: 51.4900 },
    image_url: '/detections/DET-006.jpg',
    tender_id: 'TND-001' // Has tender but no contract yet
  }
]

