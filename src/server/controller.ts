import { Request, Response } from 'express'


export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file type' })
  }

  res.json({
    message: 'File uploaded successfully',
    filePath: req.file.path,
    filename: req.file.filename
  })
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
      error: error.message
    })
  }
}
