import * as Tile from './modules/Tile.js'


const image = new Image()
image.crossOrigin = "Anonymous"
image.src = './map.png'

const canvas = document.getElementById('map')
const ctx = canvas.getContext('2d')
const tileCanvas = document.getElementById('selected-tile')
const tileCtx = tileCanvas.getContext('2d')
tileCtx.imageSmoothingEnabled = true

const tileSize = 14
let tiles = []

image.onload = draw


function draw() {
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  console.log('width: ', canvas.width)
  console.log('height: ', canvas.height)

  ctx.drawImage(image, 0, 0)

  gridToTiles(canvas, ctx)
}

function toggleGrid() {
  let checkbox = document.getElementById("grid")

  if (checkbox.checked) {
    const width = canvas.width
    const height = canvas.height

    ctx.beginPath()

    for (let x = 0; x <= width; x += tileSize) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
    }

    // set the color of the line
    ctx.strokeStyle = 'Gainsboro'
    ctx.lineWidth = 1
    // the stroke will actually paint the current path 
    ctx.stroke()
    // for the sake of the example 2nd path
    ctx.beginPath()

    for (let y = 0; y <= height; y += tileSize) {
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
    }

    // set the color of the line
    ctx.strokeStyle = 'Gainsboro'
    // just for fun
    ctx.lineWidth = 1
    // for your original question - you need to stroke only once
    ctx.stroke()
  }

  else {
    ctx.drawImage(image, 0, 0)
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
  tileCtx.drawImage(canvas, tiles[id].x, tiles[id].y, tileSize, tileSize, 0, 0, 56, 56)
}

function downloadTile() {
  const link = document.createElement('a')
  link.download = 'tile'
  link.href = tileCanvas.toDataURL()
  link.click()
  link.remove()
}

function matchTiles(tileOne, tileTwo) {

}

canvas.addEventListener('click', (event) => {
  Tile.select(event, canvas, tileCtx)
})

document.getElementById('downloadButton').addEventListener('click', () => {
  Tile.download(tileCanvas)
})
