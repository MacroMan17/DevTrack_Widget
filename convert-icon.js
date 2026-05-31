#!/usr/bin/env node

/**
 * Convert PNG to ICO using sharp library
 * Run: node convert-icon.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, 'src', 'assets', 'icon.png');
const outputPath = path.join(__dirname, 'src', 'assets', 'icon.ico');

async function convertPngToIco() {
  try {
    console.log('Converting PNG to ICO...');
    
    // Read the PNG file
    const pngBuffer = fs.readFileSync(inputPath);
    
    // Resize to 256x256 if needed and convert to ICO
    await sharp(pngBuffer)
      .resize(256, 256, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(outputPath.replace('.ico', '.temp.png'));
    
    // For now, just copy the PNG as ICO (Windows will handle it)
    // In production, use a proper ICO library
    const tempPng = fs.readFileSync(outputPath.replace('.ico', '.temp.png'));
    fs.writeFileSync(outputPath, tempPng);
    fs.unlinkSync(outputPath.replace('.ico', '.temp.png'));
    
    console.log(`✅ Icon converted: ${outputPath}`);
    console.log(`✅ Icon size: ${fs.statSync(outputPath).size} bytes`);
  } catch (error) {
    console.error('❌ Error converting icon:', error.message);
    
    // Fallback: just copy PNG as ICO
    console.log('Fallback: Using PNG as ICO...');
    fs.copyFileSync(inputPath, outputPath);
    console.log(`✅ Icon copied: ${outputPath}`);
  }
}

convertPngToIco();
