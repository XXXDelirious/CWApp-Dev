#!/usr/bin/env python3
"""
Generate Android app icons from a source image at all density levels.
Requires: Pillow library (pip install Pillow)
"""
import os
from PIL import Image

# Icon sizes for each density
SIZES = {
    'ldpi': 36,
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192,
}

def generate_icons(source_image_path, output_dir):
    """Generate icons at all Android densities."""
    
    if not os.path.exists(source_image_path):
        print(f"Error: Source image '{source_image_path}' not found!")
        return False
    
    # Open the source image
    try:
        img = Image.open(source_image_path).convert('RGBA')
        print(f"✓ Loaded image: {img.size}")
    except Exception as e:
        print(f"Error loading image: {e}")
        return False
    
    # Generate icons for each density
    for density, size in SIZES.items():
        # Create mipmap directory if it doesn't exist
        mipmap_dir = os.path.join(output_dir, f'mipmap-{density}')
        os.makedirs(mipmap_dir, exist_ok=True)
        
        # Resize image
        resized = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Save both square and round versions
        square_path = os.path.join(mipmap_dir, 'ic_launcher.png')
        round_path = os.path.join(mipmap_dir, 'ic_launcher_round.png')
        
        resized.save(square_path, 'PNG')
        resized.save(round_path, 'PNG')
        
        print(f"✓ Generated {density} ({size}×{size}): {square_path}")
    
    print("\n✓ All icons generated successfully!")
    return True

if __name__ == '__main__':
    # Paths
    source = 'assets/Alpha-Aid-logo.png'  # Your app logo
    output = 'android/app/src/main/res'
    
    print("Android Icon Generator")
    print("=" * 50)
    
    if generate_icons(source, output):
        print("\nNext steps:")
        print("1. Rebuild: cd android && .\\gradlew clean")
        print("2. Run: npx react-native run-android")
    else:
        print("\nUsage: Place your icon image as 'icon_source.png' in the project root")
        print("Then run: python generate_icons.py")
