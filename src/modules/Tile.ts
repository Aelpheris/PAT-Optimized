import * as ui from './ui' 

export const tileSize = 14
const TILE_WIDTH = 14
const TILE_HEIGHT = 14

export function select(event, mapCanvas, tilesMap, tileCanvas) {
  const tileCtx = tileCanvas.getContext('2d')

  const tileData = fromMap(event, mapCanvas, tilesMap)

  // Draw selected tile to navbar canvas
  tileCtx.drawImage(mapCanvas, tileData.x * tileSize, tileData.y * tileSize, tileSize, tileSize, 0, 0, 56, 56)

  // Highlight the selected tile
  ui.highlight(mapCanvas, tileData.x * tileSize, tileData.y * tileSize, TILE_WIDTH, TILE_HEIGHT)

  // Enable downloading
  document.getElementById('downloadButton').disabled = false

  return tileData
}

// Function to slice canvas in the background
export function sliceCanvasInBackground(canvas, tileWidth, tileHeight) {
  return new Promise((resolve, reject) => {
    // Create a copy of the canvas image data to send to worker
    const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

    // Create worker
    const worker = new Worker(new URL('./slice-worker.ts', import.meta.url));

    // Send data to worker
    worker.postMessage({
      imageData: imageData,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      tileWidth: tileWidth,
      tileHeight: tileHeight
    }, [imageData.data.buffer]); // Transfer ownership of the buffer to avoid copying

    // Handle worker response
    worker.onmessage = function (e) {
      if (e.data.error) {
        reject(new Error(e.data.error));
      } else {
        // Recreate the Map from worker's array format
        const tilesMap = new Map();

        for (const tile of e.data.tiles) {
          // Recreate ImageData objects from the arrays
          const tileImageData = new ImageData(
            new Uint8ClampedArray(tile.data),
            tile.width,
            tile.height
          );

          const data = {
            // X coordinate of tile based on tile grid
            x: tile.x,
            // Y coordinate of tile based on tile grid
            y: tile.y,
            imageData: tileImageData
          }

          tilesMap.set(tile.key, data);
        }

        // Terminate worker
        worker.terminate();

        // Resolve promise with the tiles map
        resolve(tilesMap);
      }
    };

    // Handle errors
    worker.onerror = function (error) {
      worker.terminate();
      reject(error);
    };
  });
}

// Returns a single tile's data from the set of tiles from the map
export function fromMap(event, canvas, tilesMap) {
  const rect = canvas.getBoundingClientRect()

  // Represents the exact x,y coordinates of the mouse click the canvas
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // Calculate which tile was clicked
  const mapX = Math.floor(x / TILE_WIDTH)
  const mapY = Math.floor(y / TILE_HEIGHT)

  // Get the tile from the map
  const key = `${mapX},${mapY}`
  console.log('key: ', key)
  const tileData = tilesMap.get(key)
  console.log('tileData: ', tileData)

  if (tileData) {
    return tileData
  }
}

// Function to create and start the background worker
export function findUniqueTilesInBackground(tilesMap, tileWidth, tileHeight) {
  return new Promise((resolve, reject) => {
    // Create worker
    const worker = new Worker(new URL('./tile-worker.ts', import.meta.url));

    // Prepare data to send to worker
    const tilesData = [];
    const keys = [];

    // Convert Map to serializable arrays
    for (const [key, tile] of tilesMap) {
      keys.push(key);
      tilesData.push({
        width: tile.imageData.width,
        height: tile.imageData.height,
        data: Array.from(tile.imageData.data)  // Convert Uint8ClampedArray to regular array
      });
    }

    // Send data to worker
    worker.postMessage({
      tilesData,
      keys,
      tileWidth,
      tileHeight
    });

    // Handle results
    worker.onmessage = function (e) {
      if (e.data.error) {
        reject(e.data.error);
      } else {
        // Convert back from worker format to a Map
        const uniqueTilesMap = new Map();
        const { uniqueTiles, originalToUniqueMap } = e.data;

        // Recreate ImageData objects from arrays
        for (const uniqueKey of Object.keys(uniqueTiles)) {
          const tileData = uniqueTiles[uniqueKey];
          const imageData = new ImageData(
            new Uint8ClampedArray(tileData.data),
            tileData.width,
            tileData.height
          );
          uniqueTilesMap.set(uniqueKey, imageData);
        }

        // Terminate worker
        worker.terminate();

        // Resolve with results
        resolve({
          uniqueTilesMap,
          originalToUniqueMap
        });
      }
    };

    // Handle errors
    worker.onerror = function (error) {
      reject(error);
    };
  });
}

export function upload(canvas: HTMLCanvasElement, filename: string): void {
  const url = 'http://localhost:3000/upload'

  if (!filename.toLowerCase().endsWith('.png')) {
    filename = `${filename}.png`
  }

  canvas.toBlob((blob) => {
    const formData = new FormData()
    formData.append('image', blob, filename)

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

function uploadTile() {
  const link = document.createElement('a')
  link.download = 'tile'
  link.href = tileCanvas.toDataURL()
  link.click()
  link.remove()
}

export function updateTileAttributeBox(tileData) {
  const text = `<p>Coordinates: (${tileData.tileX}, ${tileData.tileY})</p>`
  const textBox = document.getElementById('attributeTextBox')
  textBox.innerHTML = text
}
