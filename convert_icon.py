#!/usr/bin/env python3
"""
Convert PNG icon to ICO format
"""

from PIL import Image
import os

# Paths
input_path = r"C:\Users\sumit\OneDrive\Desktop\devtrack-widget (1)\devtrack-widget\src\assets\icon.png"
output_path = r"c:\Users\sumit\OneDrive\Desktop\devtrack-widget (1)\devtrack-widget\src\assets\icon.ico"

try:
    # Open the PNG image
    img = Image.open(input_path)
    
    # Resize to 256x256 if needed
    if img.size != (256, 256):
        img = img.resize((256, 256), Image.Resampling.LANCZOS)
    
    # Convert RGBA to RGB if needed (ICO format)
    if img.mode == 'RGBA':
        # Create a white background
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
        img = background
    
    # Save as ICO
    img.save(output_path, format='ICO')
    
    print(f"✅ Icon converted successfully!")
    print(f"   Input:  {input_path}")
    print(f"   Output: {output_path}")
    print(f"   Size:   {os.path.getsize(output_path)} bytes")
    
except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)
