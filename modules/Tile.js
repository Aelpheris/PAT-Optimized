const tileSize = 14
const TILE_WIDTH = 14
const TILE_HEIGHT = 14

export function select(event, mapCanvas, tilesMap, tileCanvas) {
  const tileCtx = tileCanvas.getContext('2d')

  const tileData = fromMap(event, mapCanvas, tilesMap, tileCanvas)

  // Draw selected tile to navbar canvas
  tileCtx.drawImage(mapCanvas, tileData.oX, tileData.oY, tileSize, tileSize, 0, 0, 56, 56)

  // Enable downloading
  document.getElementById('downloadButton').disabled = false

  return tileData
}

export function canvasToTileMap(canvas, tileWidth, tileHeight) {
  const ctx = canvas.getContext('2d')
  const tilesMap = new Map()

  const numTilesX = Math.ceil(canvas.width / tileWidth)
  const numTilesY = Math.ceil(canvas.height / tileHeight)

  // Slice the canvas into tiles and store in Map
  for (let y = 0; y < numTilesY; y++) {
    for (let x = 0; x < numTilesX; x++) {
      // Calculate actual width and height (handle edge cases)
      const actualWidth = Math.min(tileWidth, canvas.width - x * tileWidth)
      const actualHeight = Math.min(tileHeight, canvas.height - y * tileHeight)

      // Get image data for this tile
      // const imageData = ctx.getImageData(
      //   x * tileWidth,
      //   y * tileHeight,
      //   actualWidth,
      //   actualHeight
      // )

      const data = {
        // X coordinate on map canvas
        oX: x * tileWidth,
        // Y coordinate on map canvas
        oY: y * tileHeight,
        // X coordinate of tile based on map
        tileX: x,
        // Y coordinate of tile based on map
        tileY: y
      }


      // Store with coordinate key
      const key = `${x},${y}`
      tilesMap.set(key, data)
    }
  }

  return tilesMap
}

export function fromMap(event, canvas, tilesMap, tileCanvas) {
  const tileCtx = tileCanvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // Calculate which tile was clicked
  const tileX = Math.floor(x / TILE_WIDTH)
  const tileY = Math.floor(y / TILE_HEIGHT)

  console.log(`tile coordinates - x: ${tileX}, y: ${tileY}`)

  // Get the tile from the map
  const key = `${tileX},${tileY}`
  const tileData = tilesMap.get(key)

  if (tileData) {
    return tileData
  }
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

export function matchTiles(tile1, tile2) {
  // First, check if dimensions match
  if (tile1.width !== tile2.width || tile1.height !== tile2.height) {
    return false
  }

  // Get the pixel data from both canvases
  const ctx1 = tile1.getContext('2d')
  const ctx2 = tile2.getContext('2d')

  const data1 = ctx1.getImageData(0, 0, tile1.width, tile1.height).data
  const data2 = ctx2.getImageData(0, 0, tile2.width, tile2.height).data

  // Compare each pixel
  for (let i = 0; i < data1.length; i++) {
    if (data1[i] !== data2[i]) {
      return false
    }
  }

  return true
}

// Returns an object of the selected tile's attributes e.g. grid coordinates, tile type, etc.
export function getAttributes(tile) {

}