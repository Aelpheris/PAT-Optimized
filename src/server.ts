import express, { Request, Response } from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json({ limit: '10mb' }))

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const uploadDir = 'files/images/tiles'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const filename = file.originalname
    if (path.extname(filename).toLowerCase() !== '.png') {
      cb(null, `${path.basename(filename, path.extname(filename))}.png`)
    } else {
      cb(null, filename)
    }
  }
})

const upload = multer({
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

app.post('/api/download', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file type' })
  }

  res.json({
    message: 'File uploaded successfully',
    filePath: req.file.path,
    filename: req.file.filename
  })
})

app.post('/api/upload-multi', upload.array('images'), (req, res) => {
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
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})