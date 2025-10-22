-- Create user_profiles table for storing user information
-- This table should be created in your Supabase database

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable PostGIS extension for geospatial data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create GIS data tables for storing geodatabase information
CREATE TABLE IF NOT EXISTS gis_layers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  source_file TEXT NOT NULL,
  layer_type TEXT NOT NULL, -- 'point', 'line', 'polygon', 'multipoint', etc.
  geometry_type TEXT NOT NULL, -- PostGIS geometry type
  srid INTEGER DEFAULT 4326,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create table for storing GIS features/records
CREATE TABLE IF NOT EXISTS gis_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  layer_id UUID REFERENCES gis_layers(id) ON DELETE CASCADE NOT NULL,
  feature_id TEXT NOT NULL, -- Original feature ID from GDB
  geometry GEOMETRY NOT NULL,
  properties JSONB NOT NULL DEFAULT '{}', -- Store all non-geometry attributes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(layer_id, feature_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gis_features_layer_id ON gis_features(layer_id);
CREATE INDEX IF NOT EXISTS idx_gis_features_geometry ON gis_features USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_gis_features_properties ON gis_features USING GIN(properties);

-- Enable Row Level Security for GIS tables
ALTER TABLE gis_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gis_features ENABLE ROW LEVEL SECURITY;

-- Create policies for gis_layers
CREATE POLICY "Users can view all GIS layers" ON gis_layers
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create GIS layers" ON gis_layers
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR auth.role() = 'service_role');

CREATE POLICY "Users can update their own GIS layers" ON gis_layers
  FOR UPDATE USING (auth.uid() = created_by OR auth.role() = 'service_role');

CREATE POLICY "Users can delete their own GIS layers" ON gis_layers
  FOR DELETE USING (auth.uid() = created_by OR auth.role() = 'service_role');

-- Create policies for gis_features
CREATE POLICY "Users can view all GIS features" ON gis_features
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create GIS features" ON gis_features
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR auth.role() = 'service_role');

CREATE POLICY "Users can update GIS features" ON gis_features
  FOR UPDATE USING (auth.uid() IS NOT NULL OR auth.role() = 'service_role');

CREATE POLICY "Users can delete GIS features" ON gis_features
  FOR DELETE USING (auth.uid() IS NOT NULL OR auth.role() = 'service_role');

-- Create triggers to automatically update updated_at timestamps
CREATE TRIGGER update_gis_layers_updated_at
  BEFORE UPDATE ON gis_layers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gis_features_updated_at
  BEFORE UPDATE ON gis_features
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create assets table for storing infrastructure assets with integrated passport data
CREATE TABLE IF NOT EXISTS assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id TEXT UNIQUE NOT NULL, -- Custom asset identifier (e.g., ASSET-GR-001)
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'guardrail', 'street_light_pole', etc.
  status TEXT NOT NULL DEFAULT 'operational', -- 'operational', 'maintenance_required', 'under_maintenance'
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  impact_score INTEGER DEFAULT 0,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address TEXT,
  gis_layer_id UUID REFERENCES gis_layers(id) ON DELETE SET NULL,
  gis_feature_id UUID REFERENCES gis_features(id) ON DELETE SET NULL,
  -- Asset passport data stored as JSONB (all GDB properties + computed fields)
  passport_data JSONB NOT NULL DEFAULT '{}', -- Contains all GDB properties and computed asset info
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create maintenance_records table for storing maintenance history
CREATE TABLE IF NOT EXISTS maintenance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  record_id TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL, -- 'routine', 'emergency', 'preventive'
  description TEXT,
  technician TEXT,
  cost DECIMAL(10, 2),
  status TEXT NOT NULL DEFAULT 'completed', -- 'completed', 'in_progress', 'scheduled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(asset_id, record_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_location ON assets(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_assets_gis_layer ON assets(gis_layer_id);
CREATE INDEX IF NOT EXISTS idx_assets_gis_feature ON assets(gis_feature_id);
CREATE INDEX IF NOT EXISTS idx_assets_passport_data ON assets USING GIN(passport_data);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_asset ON maintenance_records(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_date ON maintenance_records(date);

-- Enable Row Level Security for asset tables
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;

-- Create policies for assets
CREATE POLICY "Users can view all assets" ON assets
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create assets" ON assets
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR auth.role() = 'service_role');

CREATE POLICY "Users can update assets" ON assets
  FOR UPDATE USING (auth.uid() IS NOT NULL OR auth.role() = 'service_role');

CREATE POLICY "Users can delete assets" ON assets
  FOR DELETE USING (auth.uid() IS NOT NULL OR auth.role() = 'service_role');

-- Create policies for maintenance_records
CREATE POLICY "Users can view all maintenance records" ON maintenance_records
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create maintenance records" ON maintenance_records
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR auth.role() = 'service_role');

CREATE POLICY "Users can update maintenance records" ON maintenance_records
  FOR UPDATE USING (auth.uid() IS NOT NULL OR auth.role() = 'service_role');

CREATE POLICY "Users can delete maintenance records" ON maintenance_records
  FOR DELETE USING (auth.uid() IS NOT NULL OR auth.role() = 'service_role');

-- Create triggers to automatically update updated_at timestamps
CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_records_updated_at
  BEFORE UPDATE ON maintenance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Example: Insert a sample admin user profile
-- Replace the user_id with the actual UUID from auth.users after creating the user
-- INSERT INTO user_profiles (user_id, first_name, last_name, email)
-- VALUES ('your-user-uuid-here', 'Admin', 'User', 'admin@trags.qa');
