import { Request } from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export const storage = multer.diskStorage({
  destination: (
    request: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ): void => {
    const uploadDir = './data/images'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (request: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    const filename = file.originalname
    if (path.extname(filename).toLowerCase() !== '.png') {
      cb(null, `${path.basename(filename, path.extname(filename))}.png`)
    } else {
      cb(null, filename)
    }
  }
})

export const upload = multer({
  storage: storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'image/png') {
      cb(null, true)
    } else {
      cb(new Error('Only PNG images are allowed'))
    }
  },
  // limits: { fileSize: 5 * 1024 * 1024 }
})