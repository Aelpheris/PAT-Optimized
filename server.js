import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json({ limit: '10mb' }))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'tiles/'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})

const download = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png') {
      cb(null, true)
    } else {
      cb(new Error('Only PNG images are allowed'), false)
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
})

app.post('/download', download.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file type' })
  }
  
  res.json({
    message: 'File uploaded successfully',
    filePath: req.file.path,
    filename: req.file.filename
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})