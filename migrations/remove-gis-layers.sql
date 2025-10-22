-- Migration script to remove GIS layers and features tables
-- This script should be run after implementing the simplified asset-only workflow
-- Run this with: psql -d your_database -f migrations/remove-gis-layers.sql

BEGIN;

-- Drop foreign key constraints first
ALTER TABLE assets DROP CONSTRAINT IF EXISTS assets_gis_layer_id_fkey;
ALTER TABLE assets DROP CONSTRAINT IF EXISTS assets_gis_feature_id_fkey;
ALTER TABLE gis_features DROP CONSTRAINT IF EXISTS gis_features_layer_id_fkey;

-- Drop indexes related to GIS tables
DROP INDEX IF EXISTS idx_gis_features_layer_id;
DROP INDEX IF EXISTS idx_gis_features_geometry;
DROP INDEX IF EXISTS idx_gis_features_properties;
DROP INDEX IF EXISTS idx_assets_gis_layer;
DROP INDEX IF EXISTS idx_assets_gis_feature;

-- Drop triggers
DROP TRIGGER IF EXISTS update_gis_layers_updated_at ON gis_layers;
DROP TRIGGER IF EXISTS update_gis_features_updated_at ON gis_features;

-- Drop policies
DROP POLICY IF EXISTS "Users can view all GIS layers" ON gis_layers;
DROP POLICY IF EXISTS "Authenticated users can create GIS layers" ON gis_layers;
DROP POLICY IF EXISTS "Users can update their own GIS layers" ON gis_layers;
DROP POLICY IF EXISTS "Users can delete their own GIS layers" ON gis_layers;

DROP POLICY IF EXISTS "Users can view all GIS features" ON gis_features;
DROP POLICY IF EXISTS "Authenticated users can create GIS features" ON gis_features;
DROP POLICY IF EXISTS "Users can update GIS features" ON gis_features;
DROP POLICY IF EXISTS "Users can delete GIS features" ON gis_features;

-- Drop tables (order matters due to foreign keys)
-- Drop gis_features first since it references gis_layers
DROP TABLE IF EXISTS gis_features CASCADE;
-- Then drop gis_layers
DROP TABLE IF EXISTS gis_layers CASCADE;

-- Update assets table to remove GIS-related columns
ALTER TABLE assets DROP COLUMN IF EXISTS gis_layer_id;
ALTER TABLE assets DROP COLUMN IF EXISTS gis_feature_id;

-- Add source tracking columns to assets table
ALTER TABLE assets ADD COLUMN IF NOT EXISTS source_file TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS source_layer TEXT;

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_assets_source_file ON assets(source_file);
CREATE INDEX IF NOT EXISTS idx_assets_source_layer ON assets(source_layer);

-- Update existing assets to have source information if possible
-- This is optional and can be customized based on your data
UPDATE assets 
SET source_file = 'legacy_import', 
    source_layer = 'unknown'
WHERE source_file IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN assets.source_file IS 'Original GDB file path or source identifier';
COMMENT ON COLUMN assets.source_layer IS 'Original layer name from GDB file';

-- Verify the migration completed successfully
DO $$
BEGIN
    -- Check that GIS tables are gone
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gis_layers') THEN
        RAISE EXCEPTION 'gis_layers table still exists after migration';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gis_features') THEN
        RAISE EXCEPTION 'gis_features table still exists after migration';
    END IF;
    
    -- Check that assets table has new columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'source_file') THEN
        RAISE EXCEPTION 'source_file column not added to assets table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'source_layer') THEN
        RAISE EXCEPTION 'source_layer column not added to assets table';
    END IF;
    
    -- Check that no foreign key constraints reference GIS tables
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints AS tc
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
            AND (ccu.table_name = 'gis_layers' OR ccu.table_name = 'gis_features')
    ) THEN
        RAISE EXCEPTION 'Foreign key constraints still reference GIS tables';
    END IF;
    
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'GIS tables removed and assets table updated with source tracking.';
END $$;

COMMIT;
