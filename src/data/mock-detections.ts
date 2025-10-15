import { AIDetection } from '@/types/detection'

export const mockDetections: AIDetection[] = [
  {
    detection_id: 'DET-004',
    asset_id: 'ASSET-R-001',
    defect_type: 'tree lean',
    confidence_score: 0.78,
    timestamp: '2025-10-07T22:30:00Z',
    status: 'pending',
    severity: 'critical',
    description: 'Derooted tree leaning on house on Corniche Road',
    location: { lat: 25.2760, lng: 51.5250 },
    image_url: '/detections/DET-004.jpg',
    contract_id: 'CTR-003', // Has framework contract
    detection_device: 'Street Camera',
    device_model: 'SC-2024-Pro'
  },
  {
    detection_id: 'DET-006',
    asset_id: 'ASSET-F-001',
    defect_type: 'structural crack',
    confidence_score: 0.96,
    timestamp: '2025-10-07T12:00:00Z',
    status: 'pending',
    severity: 'critical',
    description: 'Significant structural crack detected in control room of West Bay Traffic Control Tower - potential safety hazard requiring immediate structural assessment',
    location: { lat: 25.2850, lng: 51.5300 },
    image_url: '/detections/DET-006.jpg',
    tender_id: 'TND-001', // Has tender but no contract yet
    detection_device: 'Crawl Bot',
    device_model: 'CB-2024-Advanced'
  },
  {
    detection_id: 'DET-001',
    asset_id: 'ASSET-R-001',
    defect_type: 'pothole',
    confidence_score: 0.94,
    timestamp: '2025-10-08T14:30:00Z',
    status: 'validated',
    severity: 'critical',
    description: 'Pothole detected on Corniche Road, requires immediate attention',
    location: { lat: 25.2854, lng: 51.5310 },
    image_url: '/detections/DET-001.jpg',
    contract_id: 'CTR-001', // Has active contract
    detection_device: 'Inspection Vehicle',
    device_model: 'IV-2024-Electric'
  },
  {
    detection_id: 'DET-002',
    asset_id: 'ASSET-P-001',
    defect_type: 'subsea corrosion',
    confidence_score: 0.87,
    timestamp: '2025-10-08T10:15:00Z',
    status: 'validated',
    severity: 'warning',
    description: 'Marine corrosion detected on subsea pipeline network in Doha Bay - protective coating degradation requires immediate underwater inspection and repair to prevent environmental contamination',
    location: { lat: 25.3200, lng: 51.5800 },
    image_url: '/detections/DET-002.jpg',
    tender_id: 'TND-002', // Has tender
    detection_device: 'UnderWater Drone',
    device_model: 'UWD-2024-Heavy'
  },
  {
    detection_id: 'DET-003',
    asset_id: 'ASSET-S-001',
    defect_type: 'panel damage',
    confidence_score: 0.92,
    timestamp: '2025-10-08T08:45:00Z',
    status: 'validated',
    severity: 'warning',
    description: 'Broken solar panel detected at Al Khor Solar Power Facility - panel replacement required to maintain energy output efficiency',
    location: { lat: 25.6800, lng: 51.5000 },
    image_url: '/detections/DET-003.webp',
    contract_id: 'CTR-004', // Has active contract
    detection_device: 'Drone',
    device_model: 'DR-2024-Enterprise'
  },
  {
    detection_id: 'DET-005',
    asset_id: 'ASSET-L-012',
    defect_type: 'surveillance',
    confidence_score: 0.65,
    timestamp: '2025-10-07T16:20:00Z',
    status: 'resolved',
    severity: 'normal',
    description: 'Low image quality on surveilance camera on C-Ring Road',
    location: { lat: 25.3200, lng: 51.5300 },
    image_url: '/detections/DET-005.jpg',
    contract_id: 'CTR-005', // Has completed contract (not displayed in table)
    detection_device: 'Camera',
    device_model: 'CAM-2024-AI'
  }
]

