import { AIDetection } from '@/types/detection'

export const mockDetections: AIDetection[] = [
  {
    detection_id: 'DET-001',
    asset_id: 'ASSET-R-001',
    defect_type: 'crack',
    confidence_score: 0.94,
    timestamp: '2025-10-08T14:30:00Z',
    status: 'pending',
    severity: 'critical',
    description: 'Major crack detected on King Fahd Road, requires immediate attention',
    location: { lat: 24.7136, lng: 46.6753 }
  },
  {
    detection_id: 'DET-002',
    asset_id: 'ASSET-B-003',
    defect_type: 'corrosion',
    confidence_score: 0.87,
    timestamp: '2025-10-08T10:15:00Z',
    status: 'validated',
    severity: 'warning',
    description: 'Corrosion detected on bridge support structure',
    location: { lat: 24.7200, lng: 46.6800 }
  },
  {
    detection_id: 'DET-003',
    asset_id: 'ASSET-R-002',
    defect_type: 'pothole',
    confidence_score: 0.92,
    timestamp: '2025-10-08T08:45:00Z',
    status: 'validated',
    severity: 'warning',
    description: 'Pothole formation on Olaya Street intersection',
    location: { lat: 24.7250, lng: 46.6700 }
  },
  {
    detection_id: 'DET-004',
    asset_id: 'ASSET-L-012',
    defect_type: 'electrical',
    confidence_score: 0.78,
    timestamp: '2025-10-07T22:30:00Z',
    status: 'pending',
    severity: 'warning',
    description: 'Streetlight malfunction detected',
    location: { lat: 24.7100, lng: 46.6850 }
  },
  {
    detection_id: 'DET-005',
    asset_id: 'ASSET-R-005',
    defect_type: 'wear',
    confidence_score: 0.65,
    timestamp: '2025-10-07T16:20:00Z',
    status: 'resolved',
    severity: 'normal',
    description: 'Surface wear on pedestrian crossing',
    location: { lat: 24.7300, lng: 46.6650 }
  },
  {
    detection_id: 'DET-006',
    asset_id: 'ASSET-B-001',
    defect_type: 'structural',
    confidence_score: 0.96,
    timestamp: '2025-10-07T12:00:00Z',
    status: 'pending',
    severity: 'critical',
    description: 'Structural integrity concern on highway bridge',
    location: { lat: 24.7400, lng: 46.6900 }
  }
]

