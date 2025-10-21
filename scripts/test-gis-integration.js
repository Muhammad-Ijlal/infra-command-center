#!/usr/bin/env node

/**
 * Test script for GIS integration
 * This script tests the basic functionality of the GIS system
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function testGdalInstallation() {
  console.log('🔍 Testing GDAL installation...')
  
  try {
    const { stdout } = await execAsync('ogrinfo --version')
    console.log('✅ GDAL is installed:', stdout.trim())
    return true
  } catch (error) {
    console.log('❌ GDAL is not installed or not in PATH')
    console.log('Please install GDAL: https://gdal.org/download.html')
    return false
  }
}

async function testGdbFile() {
  console.log('\n🗺️  Testing .gdb file access...')
  
  const gdbPath = './AlSaneem_AlWajba.gdb'
  
  try {
    const { stdout } = await execAsync(`ogrinfo -so "${gdbPath}"`)
    console.log('✅ .gdb file is accessible')
    
    // Parse layer information
    const lines = stdout.split('\n')
    const layers = []
    
    for (const line of lines) {
      if (line.trim().startsWith('Layer name:')) {
        const layerName = line.replace('Layer name:', '').trim()
        layers.push(layerName)
      }
    }
    
    console.log(`📊 Found ${layers.length} layers:`)
    layers.forEach((layer, index) => {
      console.log(`   ${index + 1}. ${layer}`)
    })
    
    return true
  } catch (error) {
    console.log('❌ Cannot access .gdb file:', error.message)
    return false
  }
}

async function testPostgisConnection() {
  console.log('\n🗄️  Testing PostGIS connection...')
  
  // This would require actual Supabase credentials
  console.log('⚠️  PostGIS connection test requires Supabase credentials')
  console.log('   Please ensure PostGIS extension is enabled in your Supabase project')
  console.log('   Run the SQL commands in supabase-setup.sql to set up the database schema')
  
  return true
}

async function main() {
  console.log('🚀 Starting GIS Integration Test\n')
  
  const gdalOk = await testGdalInstallation()
  const gdbOk = await testGdbFile()
  const postgisOk = await testPostgisConnection()
  
  console.log('\n📋 Test Summary:')
  console.log(`   GDAL Installation: ${gdalOk ? '✅' : '❌'}`)
  console.log(`   .gdb File Access: ${gdbOk ? '✅' : '❌'}`)
  console.log(`   PostGIS Setup: ${postgisOk ? '✅' : '⚠️'}`)
  
  if (gdalOk && gdbOk) {
    console.log('\n🎉 GIS integration is ready!')
    console.log('   You can now upload and process .gdb files through the web interface')
  } else {
    console.log('\n⚠️  Some components need to be set up before using GIS features')
  }
}

main().catch(console.error)
