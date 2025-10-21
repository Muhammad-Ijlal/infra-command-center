import AdmZip from 'adm-zip'
import { writeFile, mkdir, rm } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

export interface ZipExtractionResult {
  success: boolean
  extractedPath?: string
  error?: string
}

/**
 * Extract ZIP file containing .gdb folder to temporary directory
 */
export async function extractGdbZip(
  zipBuffer: Buffer,
  zipFileName: string
): Promise<ZipExtractionResult> {
  try {
    // Create temporary directory
    const tempDir = join(tmpdir(), `gdb-extract-${Date.now()}`)
    await mkdir(tempDir, { recursive: true })

    // Extract ZIP file
    const zip = new AdmZip(zipBuffer)
    zip.extractAllTo(tempDir, true)

    // Find the .gdb folder in the extracted contents
    const extractedFiles = zip.getEntries()
    let gdbFolderPath: string | null = null

    // Look for .gdb folder
    for (const entry of extractedFiles) {
      if (entry.entryName.endsWith('.gdb/') || entry.entryName.includes('.gdb/')) {
        gdbFolderPath = join(tempDir, entry.entryName.replace(/\/$/, ''))
        break
      }
    }

    // If no .gdb folder found, check if the root contains .gdb files
    if (!gdbFolderPath) {
      const fs = require('fs')
      const files = fs.readdirSync(tempDir)
      const gdbFolder = files.find((file: string) => file.includes('.gdb'))
      if (gdbFolder) {
        gdbFolderPath = join(tempDir, gdbFolder)
      }
    }

    if (!gdbFolderPath) {
      await rm(tempDir, { recursive: true, force: true })
      return {
        success: false,
        error: 'No .gdb folder found in ZIP file'
      }
    }

    return {
      success: true,
      extractedPath: gdbFolderPath
    }

  } catch (error) {
    return {
      success: false,
      error: `Failed to extract ZIP: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Clean up extracted temporary files
 */
export async function cleanupExtractedFiles(extractedPath: string): Promise<void> {
  try {
    const tempDir = extractedPath.split('/').slice(0, -1).join('/')
    await rm(tempDir, { recursive: true, force: true })
  } catch (error) {
    console.warn('Failed to cleanup extracted files:', error)
  }
}
