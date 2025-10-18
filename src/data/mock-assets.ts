import { Asset, AssetPassport, MaintenanceRecord } from '@/types/asset'

export const mockAssets: Asset[] = [
  {
    asset_id: 'ASSET-T-001',
    name: 'Doha Corniche Traffic Signal System',
    category: 'traffic_signal',
    last_maintenance_date: '2024-07-10',
    next_maintenance_date: '2025-01-10',
    status: 'maintenance_required',
    impact_score: 92,
    location: {
      lat: 25.2850,
      lng: 51.5300,
      address: 'Doha Corniche Intersection, Doha'
    }
  },
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
      address: 'Al Sadd District'
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
  },
  {
    asset_id: 'ASSET-F-001',
    name: 'West Bay Traffic Control Tower',
    category: 'facility',
    last_maintenance_date: '2024-03-10',
    next_maintenance_date: '2025-09-10',
    status: 'maintenance_required',
    impact_score: 78,
    location: {
      lat: 25.2850,
      lng: 51.5300,
      address: 'West Bay District, Doha'
    }
  },
  {
    asset_id: 'ASSET-P-001',
    name: 'Doha Bay Subsea Pipeline Network',
    category: 'pipeline',
    last_maintenance_date: '2024-01-15',
    next_maintenance_date: '2025-07-15',
    status: 'maintenance_required',
    impact_score: 85,
    location: {
      lat: 25.3200,
      lng: 51.5800,
      address: 'Doha Bay Subsea Infrastructure'
    }
  },
  {
    asset_id: 'ASSET-S-001',
    name: 'Al Khor Solar Power Facility',
    category: 'solar',
    last_maintenance_date: '2024-02-20',
    next_maintenance_date: '2025-08-20',
    status: 'maintenance_required',
    impact_score: 88,
    location: {
      lat: 25.6800,
      lng: 51.5000,
      address: 'Al Khor Solar Energy Complex, Qatar'
    }
  }
]

export const mockMaintenanceHistory: Record<string, MaintenanceRecord[]> = {
  'ASSET-T-001': [
    {
      record_id: 'MNT-010',
      date: '2024-07-10',
      type: 'routine',
      description: 'Traffic signal system inspection and light bulb replacement',
      cost: 8500,
      contractor: 'Qatar Traffic Solutions',
      status: 'completed'
    },
    {
      record_id: 'MNT-011',
      date: '2024-01-15',
      type: 'preventive',
      description: 'Complete traffic signal system maintenance and controller update',
      cost: 22000,
      contractor: 'West Bay Traffic Services',
      status: 'completed'
    }
  ],
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
  ],
  'ASSET-F-001': [
    {
      record_id: 'MNT-004',
      date: '2024-03-10',
      type: 'routine',
      description: 'Traffic control systems maintenance and structural inspection',
      cost: 32000,
      contractor: 'Qatar Traffic Solutions',
      status: 'completed'
    },
    {
      record_id: 'MNT-005',
      date: '2023-09-15',
      type: 'preventive',
      description: 'Control room interior inspection and equipment calibration',
      cost: 18000,
      contractor: 'West Bay Maintenance Services',
      status: 'completed'
    }
  ],
  'ASSET-P-001': [
    {
      record_id: 'MNT-006',
      date: '2024-01-15',
      type: 'routine',
      description: 'Subsea pipeline inspection and corrosion monitoring',
      cost: 85000,
      contractor: 'Qatar Marine Services',
      status: 'completed'
    },
    {
      record_id: 'MNT-007',
      date: '2023-07-20',
      type: 'preventive',
      description: 'Underwater pipeline maintenance and protective coating application',
      cost: 120000,
      contractor: 'Gulf Subsea Solutions',
      status: 'completed'
    }
  ],
  'ASSET-S-001': [
    {
      record_id: 'MNT-008',
      date: '2024-02-20',
      type: 'routine',
      description: 'Solar panel cleaning and electrical system inspection',
      cost: 45000,
      contractor: 'Qatar Solar Solutions',
      status: 'completed'
    },
    {
      record_id: 'MNT-009',
      date: '2023-08-15',
      type: 'preventive',
      description: 'Solar panel maintenance and inverter system check',
      cost: 32000,
      contractor: 'Al Khor Energy Services',
      status: 'completed'
    }
  ]
}

export const mockAssetPassports: Record<string, AssetPassport> = {
  'ASSET-T-001': {
    asset_id: 'ASSET-T-001',
    asset: mockAssets[0],
    material_info: {
      primary_material: 'LED Traffic Signal System',
      secondary_materials: ['Steel Pole', 'Concrete Base', 'Traffic Controller', 'Detection Loops'],
      manufacturer: 'Qatar Traffic Technologies',
      installation_date: '2021-03-20'
    },
    maintenance_history: mockMaintenanceHistory['ASSET-T-001'],
    compliance: {
      vision_2030_compliant: true,
      qcs_certified: true,
      last_inspection_date: '2024-07-10',
      certifications: ['ISO 9001', 'QCS 2014', 'Traffic Signal Safety Cert']
    },
    related_detections: ['DET-002']
  },
  'ASSET-R-001': {
    asset_id: 'ASSET-R-001',
    asset: mockAssets[1],
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
    asset: mockAssets[2],
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
    related_detections: ['DET-002', 'DET-004']
  },
  'ASSET-L-012': {
    asset_id: 'ASSET-L-012',
    asset: mockAssets[3],
    material_info: {
      primary_material: 'Electrical Systems',
      secondary_materials: ['Steel Poles', 'Concrete Base', 'Surveillance Camera'],
      manufacturer: 'Qatar Lighting Solutions',
      installation_date: '2021-05-15'
    },
    maintenance_history: [],
    compliance: {
      vision_2030_compliant: true,
      qcs_certified: true,
      last_inspection_date: '2024-09-01',
      certifications: ['ISO 9001', 'QCS 2014', 'Electrical Safety Cert']
    },
    related_detections: ['DET-004', 'DET-005']
  },
  'ASSET-B-001': {
    asset_id: 'ASSET-B-001',
    asset: mockAssets[4],
    material_info: {
      primary_material: 'Pre-stressed Concrete',
      secondary_materials: ['Steel Reinforcement', 'Concrete Grade 80'],
      manufacturer: 'Lusail Construction Group',
      installation_date: '2017-12-05'
    },
    maintenance_history: [],
    compliance: {
      vision_2030_compliant: true,
      qcs_certified: true,
      last_inspection_date: '2024-05-15',
      certifications: ['ISO 9001', 'QCS 2014', 'Structural Engineering Cert']
    },
    related_detections: []
  },
  'ASSET-F-001': {
    asset_id: 'ASSET-F-001',
    asset: mockAssets[5],
    material_info: {
      primary_material: 'Reinforced Concrete',
      secondary_materials: ['Steel Frame', 'Control Room Walls', 'Traffic Monitoring Systems'],
      manufacturer: 'Qatar Traffic Infrastructure',
      installation_date: '2019-02-20'
    },
    maintenance_history: mockMaintenanceHistory['ASSET-F-001'],
    compliance: {
      vision_2030_compliant: true,
      qcs_certified: true,
      last_inspection_date: '2024-03-10',
      certifications: ['ISO 9001', 'QCS 2014', 'Building Safety Cert']
    },
    related_detections: ['DET-006']
  },
  'ASSET-P-001': {
    asset_id: 'ASSET-P-001',
    asset: mockAssets[6],
    material_info: {
      primary_material: 'Carbon Steel Pipeline',
      secondary_materials: ['Corrosion Protection Coating', 'Concrete Weight Coating', 'Marine Grade Steel'],
      manufacturer: 'Qatar Pipeline Solutions',
      installation_date: '2015-11-10'
    },
    maintenance_history: mockMaintenanceHistory['ASSET-P-001'],
    compliance: {
      vision_2030_compliant: true,
      qcs_certified: true,
      last_inspection_date: '2024-01-15',
      certifications: ['ISO 9001', 'QCS 2014', 'Marine Pipeline Cert']
    },
    related_detections: ['DET-002']
  },
  'ASSET-S-001': {
    asset_id: 'ASSET-S-001',
    asset: mockAssets[7],
    material_info: {
      primary_material: 'Monocrystalline Silicon Solar Panels',
      secondary_materials: ['Aluminum Frame', 'Tempered Glass', 'Inverter System', 'Mounting Structure'],
      manufacturer: 'Qatar Solar Technologies',
      installation_date: '2020-03-15'
    },
    maintenance_history: mockMaintenanceHistory['ASSET-S-001'],
    compliance: {
      vision_2030_compliant: true,
      qcs_certified: true,
      last_inspection_date: '2024-02-20',
      certifications: ['ISO 9001', 'QCS 2014', 'Electrical Safety Cert']
    },
    related_detections: ['DET-003']
  }
}

