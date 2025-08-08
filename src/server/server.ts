import express, { Request, Response, Router } from 'express'
import cors from 'cors'
import { upload } from './multer'
import { uploadImage, uploadImages } from './controller'


class Server {
  private express: express.Application
  private port: number = 3000

  constructor() {
    this.express = express()
    this.express.use(cors())
    this.express.use(express.json({ limit: '20mb' }))
    this.routes()

    this.express.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`)
    })
  }

  private routes(): void {

    const router = express.Router()

    router.post('/upload', upload.single('image'), uploadImage)
    router.post('/upload-multi', upload.array('images'), uploadImages)
  }
}

new Server()
