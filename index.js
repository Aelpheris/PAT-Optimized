import * as Tile from './modules/Tile.js'


const image = new Image()
image.crossOrigin = "Anonymous"
image.src = './map.png'

const mapCanvas = document.getElementById('map')
const mapCtx = mapCanvas.getContext('2d')
const tileCanvas = document.getElementById('selected-tile')
const tileCtx = tileCanvas.getContext('2d')
tileCtx.imageSmoothingEnabled = true

const tileSize = 14
let tilesMap = new Map()

image.onload = draw


function draw() {
  mapCanvas.width = image.naturalWidth
  mapCanvas.height = image.naturalHeight

  console.log('width: ', mapCanvas.width)
  console.log('height: ', mapCanvas.height)

  mapCtx.drawImage(image, 0, 0)

  tilesMap = Tile.canvasToTileMap(mapCanvas, tileSize, tileSize)
  console.log('number of tiles: ', tilesMap.size)
}

function toggleGrid() {
  let checkbox = document.getElementById("grid")

  if (checkbox.checked) {
    const width = mapCanvas.width
    const height = mapCanvas.height

    mapCtx.beginPath()

    for (let x = 0; x <= width; x += tileSize) {
      mapCtx.moveTo(x, 0)
      mapCtx.lineTo(x, height)
    }

    // set the color of the line
    mapCtx.strokeStyle = 'Gainsboro'
    mapCtx.lineWidth = 1
    // the stroke will actually paint the current path 
    mapCtx.stroke()
    // for the sake of the example 2nd path
    mapCtx.beginPath()

    for (let y = 0; y <= height; y += tileSize) {
      mapCtx.moveTo(0, y)
      mapCtx.lineTo(width, y)
    }

    // set the color of the line
    mapCtx.strokeStyle = 'Gainsboro'
    // just for fun
    mapCtx.lineWidth = 1
    // for your original question - you need to stroke only once
    mapCtx.stroke()
  }

  else {
    mapCtx.drawImage(image, 0, 0)
  }
}

// Splits the entire grid into a collection of tiles to be searchable and usable for
// selecting individual tiles
function gridToTiles(canvas, ctx) {
  let tile = document.createElement('canvas')
  ctx = tile.getContext('2d')

  for (let y = 0; y <= canvas.height; y += tileSize) {
    for (let x = 0; x <= canvas.width; x += tileSize) {
      const tile = {
        'sx': x,
        'sy': y,
        // 'data': ctx.getImageData(x, y, 14, 14)
      }
      tiles.push(tile)
    }
  }

  console.log('number of tiles: ', tiles.length)
  console.log('first tile: ', tiles[0])
  return tiles
}

function showTile(id) {
  tileCtx.drawImage(mapCanvas, tiles[id].x, tiles[id].y, tileSize, tileSize, 0, 0, 56, 56)
}

function downloadTile() {
  const link = document.createElement('a')
  link.download = 'tile'
  link.href = tileCanvas.toDataURL()
  link.click()
  link.remove()
}

function updateTileAttributeBox(tileData) {
  const text = `<p>Coordinates: (${tileData.tileX}, ${tileData.tileY})</p>`
  const textBox = document.getElementById('attributeTextBox')
  textBox.innerHTML = text
}

mapCanvas.addEventListener('click', (event) => {
  const tileData = Tile.select(event, mapCanvas, tilesMap, tileCanvas)
  updateTileAttributeBox(tileData)
})

document.getElementById('downloadButton').addEventListener('click', () => {
  Tile.download(tileCanvas)
})
