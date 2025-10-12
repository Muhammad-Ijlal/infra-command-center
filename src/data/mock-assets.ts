import { Asset, AssetPassport, MaintenanceRecord } from '@/types/asset'

export const mockAssets: Asset[] = [
  {
    asset_id: 'ASSET-R-001',
    name: 'Corniche Road - Section A',
    category: 'road',
    last_maintenance_date: '2024-08-15',
    next_maintenance_date: '2025-02-15',
    status: 'maintenance_required',
    impact_score: 95,
    location: {
      lat: 25.2854,
      lng: 51.5310,
      address: 'Corniche Road, Doha'
    }
  },
  {
    asset_id: 'ASSET-B-003',
    name: 'Al Sadd Bridge',
    category: 'bridge',
    last_maintenance_date: '2024-06-20',
    next_maintenance_date: '2025-12-20',
    status: 'operational',
    impact_score: 88,
    location: {
      lat: 25.2866,
      lng: 51.5362,
      address: 'Al Sadd District, Doha'
    }
  },
  {
    asset_id: 'ASSET-L-012',
    name: 'C-Ring Road Lighting - Zone 12',
    category: 'lighting',
    last_maintenance_date: '2024-09-01',
    next_maintenance_date: '2025-03-01',
    status: 'under_maintenance',
    impact_score: 65,
    location: {
      lat: 25.2760,
      lng: 51.5250,
      address: 'C-Ring Road, Doha'
    }
  },
  {
    asset_id: 'ASSET-R-002',
    name: 'Al Waab Street - Main Intersection',
    category: 'road',
    last_maintenance_date: '2024-07-10',
    next_maintenance_date: '2025-01-10',
    status: 'maintenance_required',
    impact_score: 82,
    location: {
      lat: 25.2500,
      lng: 51.4500,
      address: 'Al Waab Street Intersection, Doha'
    }
  },
  {
    asset_id: 'ASSET-B-001',
    name: 'Lusail Expressway Overpass',
    category: 'bridge',
    last_maintenance_date: '2024-05-15',
    next_maintenance_date: '2025-11-15',
    status: 'operational',
    impact_score: 92,
    location: {
      lat: 25.4200,
      lng: 51.4900,
      address: 'Lusail Expressway, Lusail'
    }
  }
]

export const mockMaintenanceHistory: Record<string, MaintenanceRecord[]> = {
  'ASSET-R-001': [
    {
      record_id: 'MNT-001',
      date: '2024-08-15',
      type: 'routine',
      description: 'Regular road surface inspection and minor repairs',
      cost: 15000,
      contractor: 'Qatari Construction Co.',
      status: 'completed'
    },
    {
      record_id: 'MNT-002',
      date: '2024-02-20',
      type: 'preventive',
      description: 'Crack sealing and surface treatment',
      cost: 25000,
      contractor: 'Qatar Infrastructure Group',
      status: 'completed'
    }
  ],
  'ASSET-B-003': [
    {
      record_id: 'MNT-003',
      date: '2024-06-20',
      type: 'routine',
      description: 'Bridge structural integrity assessment',
      cost: 45000,
      contractor: 'Gulf Bridge Specialists',
      status: 'completed'
    }
  ]
}

export const mockAssetPassports: Record<string, AssetPassport> = {
  'ASSET-R-001': {
    asset_id: 'ASSET-R-001',
    asset: mockAssets[0],
    material_info: {
      primary_material: 'Asphalt Concrete',
      secondary_materials: ['Aggregate Base', 'Gravel Subbase'],
      manufacturer: 'Qatar Asphalt Industries',
      installation_date: '2020-03-15'
    },
    maintenance_history: mockMaintenanceHistory['ASSET-R-001'],
    compliance: {
      vision_2030_compliant: true,
      qcs_certified: true,
      last_inspection_date: '2024-09-01',
      certifications: ['ISO 9001', 'QCS 2014']
    },
    related_detections: ['DET-001']
  },
  'ASSET-B-003': {
    asset_id: 'ASSET-B-003',
    asset: mockAssets[1],
    material_info: {
      primary_material: 'Reinforced Concrete',
      secondary_materials: ['Steel Reinforcement', 'Concrete Grade 60'],
      manufacturer: 'Qatar Concrete Solutions',
      installation_date: '2018-11-20'
    },
    maintenance_history: mockMaintenanceHistory['ASSET-B-003'],
    compliance: {
      vision_2030_compliant: true,
      qcs_certified: true,
      last_inspection_date: '2024-06-20',
      certifications: ['ISO 9001', 'QCS 2014', 'Bridge Safety Cert']
    },
    related_detections: ['DET-002']
  }
}

