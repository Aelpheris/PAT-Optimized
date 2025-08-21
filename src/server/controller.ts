import { Request, Response } from 'express'
import { saveMetadataFile } from './multer'
import path from 'path'


export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or invalid file type' })
    }

    let metadata = {}
    if (req.body.metadata) {
      try {
        metadata = JSON.parse(req.body.metadata)
      } catch (error) {
        return res.status(400).json({ error: 'Invalid metadata JSON' })
      }
    }

    // Save metadata as JSON file
    let metadataPath: string | null = null;
    try {
      metadataPath = await saveMetadataFile(req.file.path, metadata);
      console.log('Metadata saved to:', metadataPath);
    } catch (error) {
      console.error('Failed to save metadata file:', error);
      // Continue without failing the upload, but log the error
    }

    res.json({
      message: 'File uploaded successfully',
      file: {
        filePath: req.file.path,
        filename: req.file.filename,
        size: req.file.size
      },
      metadata,
      metadataFile: metadataPath ? path.basename(metadataPath) : null
    })
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' })
  }
}

export const uploadImages = async (req: Request, res: Response) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' })
    }

    const fileCount = Array.isArray(req.files) ? req.files.length : Number

    res.status(200).json({
      message: 'Files uploaded successfully',
      fileCount: fileCount
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error uploading files',
      error: error
    })
  }
}
