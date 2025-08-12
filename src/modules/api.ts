export class API {
  private url: URL

  constructor(url: string) {
    this.url = new URL(url)
  }

  private async get(route: string): Promise<Response> {
    return fetch(this.url + route, {
      method: 'GET'
    })
    .then(response => {
      return response.json()
    })
    .catch(error => {
      console.error('Error fulfilling GET request: ', error)
    })
  }

  private async post(route: string, data: FormData): Promise<Response> {
    return fetch(this.url + route, {
      method: 'POST',
      body: data
    })
      .then(response => {
        return response.json()
      })
      .catch(error => {
        console.error('Error sending POST request: ', error)
      })
  }

  public async uploadImage(img: HTMLCanvasElement, fileName: string, metadata?: Object): Promise<Response> {
    const blob = await new Promise<Blob>((resolve, reject) => {
      img.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create blob from canvas'))
        }
      }, 'image/png')
    })

    const formData = new FormData()
    formData.append('image', blob, fileName)
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata))
    }
    return this.post('upload', formData)
  }
}