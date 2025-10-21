import fiona
gdb_path="/Users/admin/Development/infra-command-center/ZF-151.gdb"
layers=fiona.listlayers(gdb_path)


def analyze_layer_details(gdb_path, layer_name):    
    try:
        with fiona.open(gdb_path, layer=layer_name) as src:
            # Basic layer info
            print(f"Driver: {src.driver}")
            print(f"CRS: {src.crs}")
            print(f"Schema: {src.schema}")
            print(f"Bounds: {src.bounds}")
            print(f"Feature count: {len(src)}")
            
            # Field analysis
            print(f"\nFields ({len(src.schema['properties'])}):")
            for field_name, field_type in src.schema['properties'].items():
                print(f"  - {field_name}: {field_type}")
            
            # Sample features
            print(f"\nSample features (first 3):")
            for i, feature in enumerate(src):
                if i >= 3:
                    break
                print(f"  Feature {i+1}:")
                print(f"    ID: {feature.get('id', 'N/A')}")
                print(f"    Geometry type: {feature['geometry']['type'] if feature['geometry'] else 'None'}")
                print(f"    Properties: {list(feature['properties'].keys())}")
                
                # Show some property values
                for prop_name, prop_value in list(feature['properties'].items())[:5]:
                    print(f"      {prop_name}: {prop_value}")
                print()
            
            return {
                'driver': src.driver,
                'crs': src.crs,
                'schema': src.schema,
                'bounds': src.bounds,
                'feature_count': len(src),
                'fields': list(src.schema['properties'].keys())
            }
            
    except Exception as e:
        print(f"Error analyzing layer {layer_name}: {e}")
        return None



def analyze_field_values(gdb_path, layer_name, field_name, sample_size=100):
    """Analyze values in a specific field"""
    print(f"\n=== Field Analysis: {field_name} ===")
    
    try:
        with fiona.open(gdb_path, layer=layer_name) as src:
            values = []
            null_count = 0
            
            for i, feature in enumerate(src):
                if i >= sample_size:
                    break
                    
                value = feature['properties'].get(field_name)
                if value is None or value == '':
                    null_count += 1
                else:
                    values.append(value)
            
            print(f"Sample size: {min(sample_size, len(src))}")
            print(f"Null/empty values: {null_count}")
            print(f"Non-null values: {len(values)}")
            
            if values:
                # Get unique values
                unique_values = list(set(values))
                print(f"Unique values: {len(unique_values)}")
                
                if len(unique_values) <= 20:
                    print("All unique values:")
                    for val in sorted(unique_values):
                        print(f"  - {val}")
                else:
                    print("First 20 unique values:")
                    for val in sorted(unique_values)[:20]:
                        print(f"  - {val}")
                    print(f"  ... and {len(unique_values) - 20} more")
            
            return {
                'sample_size': min(sample_size, len(src)),
                'null_count': null_count,
                'unique_values': len(set(values)) if values else 0,
                'values': values[:20]  # Return first 20 values
            }
            
    except Exception as e:
        print(f"Error analyzing field {field_name}: {e}")
        return None