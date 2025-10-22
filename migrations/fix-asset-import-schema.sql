-- Migration script to fix asset import schema issues and update asset structure
-- This script addresses the problems with GDB import failing due to schema constraints
-- and updates the asset table to match the new GDB-based structure
-- Run this with: psql -d your_database -f migrations/fix-asset-import-schema.sql

BEGIN;

-- Drop foreign key constraints that reference non-existent GIS tables
-- These constraints are causing import failures
ALTER TABLE assets DROP CONSTRAINT IF EXISTS assets_gis_layer_id_fkey;
ALTER TABLE assets DROP CONSTRAINT IF EXISTS assets_gis_feature_id_fkey;

-- Drop indexes related to GIS tables that no longer exist
DROP INDEX IF EXISTS idx_assets_gis_layer;
DROP INDEX IF EXISTS idx_assets_gis_feature;

-- Remove unused columns that don't map to GDB data
-- These fields were not being populated and caused confusion
ALTER TABLE assets DROP COLUMN IF EXISTS last_maintenance_date;
ALTER TABLE assets DROP COLUMN IF EXISTS next_maintenance_date;

-- Add source tracking columns to assets table
-- These are needed for GDB import to track where assets came from
ALTER TABLE assets ADD COLUMN IF NOT EXISTS source_file TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS source_layer TEXT;

-- Add core GDB fields that are actually populated from GDB data
ALTER TABLE assets ADD COLUMN IF NOT EXISTS asset_tag TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS asset_priority INTEGER;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS asset_condition TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS mx_status TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS installation_date DATE;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS last_updated_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS last_edited_by TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS survey_date DATE;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS survey_method TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS remarks TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS maintainer TEXT;

-- Add location information from GDB
ALTER TABLE assets ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS municipality TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS road_class TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS road_type TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS zone_no INTEGER;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS nrs_number TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS nrs_section_number TEXT;

-- Add project information from GDB
ALTER TABLE assets ADD COLUMN IF NOT EXISTS project_id TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS project_code TEXT;

-- Update existing assets to have source information if possible
-- This is optional and can be customized based on your data
UPDATE assets 
SET source_file = 'legacy_import', 
    source_layer = 'unknown'
WHERE source_file IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN assets.source_file IS 'Original GDB file path or source identifier';
COMMENT ON COLUMN assets.source_layer IS 'Original layer name from GDB file';
COMMENT ON COLUMN assets.asset_tag IS 'Asset tag from GDB data';
COMMENT ON COLUMN assets.asset_priority IS 'Asset priority from GDB data';
COMMENT ON COLUMN assets.asset_condition IS 'Asset condition from GDB data';
COMMENT ON COLUMN assets.mx_status IS 'MX status from GDB data';
COMMENT ON COLUMN assets.installation_date IS 'Installation date from GDB data';
COMMENT ON COLUMN assets.district IS 'District from GDB data';
COMMENT ON COLUMN assets.municipality IS 'Municipality from GDB data';
COMMENT ON COLUMN assets.road_class IS 'Road class from GDB data';
COMMENT ON COLUMN assets.project_id IS 'Project ID from GDB data';
COMMENT ON COLUMN assets.maintainer IS 'Maintainer from GDB data';

-- Verify the migration completed successfully
DO $$
BEGIN
    -- Check that GIS foreign key constraints are gone
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints AS tc
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = 'assets'
            AND (ccu.table_name = 'gis_layers' OR ccu.table_name = 'gis_features')
    ) THEN
        RAISE EXCEPTION 'GIS foreign key constraints still exist on assets table';
    END IF;
    
    -- Check that unused columns are removed
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'last_maintenance_date') THEN
        RAISE EXCEPTION 'last_maintenance_date column still exists on assets table';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'next_maintenance_date') THEN
        RAISE EXCEPTION 'next_maintenance_date column still exists on assets table';
    END IF;
    
    -- Check that assets table has new source tracking columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'source_file') THEN
        RAISE EXCEPTION 'source_file column not added to assets table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'source_layer') THEN
        RAISE EXCEPTION 'source_layer column not added to assets table';
    END IF;
    
    -- Check that core GDB fields are added
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'asset_tag') THEN
        RAISE EXCEPTION 'asset_tag column not added to assets table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'asset_priority') THEN
        RAISE EXCEPTION 'asset_priority column not added to assets table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'asset_condition') THEN
        RAISE EXCEPTION 'asset_condition column not added to assets table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'mx_status') THEN
        RAISE EXCEPTION 'mx_status column not added to assets table';
    END IF;
    
    -- Check that location fields are added
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'district') THEN
        RAISE EXCEPTION 'district column not added to assets table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'municipality') THEN
        RAISE EXCEPTION 'municipality column not added to assets table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'road_class') THEN
        RAISE EXCEPTION 'road_class column not added to assets table';
    END IF;
    
    -- Check that project fields are added
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'project_id') THEN
        RAISE EXCEPTION 'project_id column not added to assets table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'maintainer') THEN
        RAISE EXCEPTION 'maintainer column not added to assets table';
    END IF;
    
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Assets table updated with GDB-based structure:';
    RAISE NOTICE '- Removed unused maintenance date fields';
    RAISE NOTICE '- Added source tracking (source_file, source_layer)';
    RAISE NOTICE '- Added core GDB fields (asset_tag, asset_priority, asset_condition, mx_status)';
    RAISE NOTICE '- Added location fields (district, municipality, road_class, zone_no)';
    RAISE NOTICE '- Added project fields (project_id, project_code)';
    RAISE NOTICE '- Added maintainer field';
    RAISE NOTICE '- Removed GIS foreign key constraints';
END $$;

COMMIT;
