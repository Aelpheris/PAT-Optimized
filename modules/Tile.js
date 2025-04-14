const tileSize = 14

export function select(e, canvas, ctx) {
  const bounding = canvas.getBoundingClientRect()
  const x = e.clientX - bounding.left
  const y = e.clientY - bounding.top

  // Match selected pixel to tile in which it resides
  console.log('clientX: ', e.clientX, 'clientY: ', e.clientY)
  console.log('bounding.left: ', bounding.left, 'bounding.top: ', bounding.top)
  console.log('x:', x, 'y: ', y)

  // Get remainder of x and y click position divided by tile size
  const pixelX = x % tileSize
  const pixelY = y % tileSize

  // Subtract remainders to height and width of image to get a whole tile
  const tileX = x - pixelX
  const tileY = y - pixelY

  // Draw selected tile to navbar canvas
  ctx.drawImage(canvas, tileX, tileY, tileSize, tileSize, 0, 0, 56, 56)

  // Enable downloading
  document.getElementById('downloadButton').disabled = false
}

export function download(canvas) {
  const url = 'http://localhost:3000/download'

  canvas.toBlob((blob) => {
    const formData = new FormData()
    formData.append('image', blob, 'tile.png')

    fetch(url, {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }
      return response.json()
    })
    .then(data => {
      console.log('File download successful: ', data)
    })
    .catch(error => {
      console.error('Error downloading file: ', error)
    })
  }, 'image/png')
}
