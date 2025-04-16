import * as tile from './modules/tile.js'


const image = new Image()
image.crossOrigin = "Anonymous"
image.src = './map.png'

const mapCanvas = document.getElementById('map')
const mapCtx = mapCanvas.getContext('2d', { willReadFrequently: true })
const tileCanvas = document.getElementById('selected-tile')
const tileCtx = tileCanvas.getContext('2d')
tileCtx.imageSmoothingEnabled = true

const TILE_WIDTH = 14
const TILE_HEIGHT = 14

let tilesMap = new Map()

function toggleGrid() {
  let checkbox = document.getElementById("grid")

  if (checkbox.checked) {
    const width = mapCanvas.width
    const height = mapCanvas.height

    mapCtx.beginPath()

    for (let x = 0; x <= width; x += TILE_WIDTH) {
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

    for (let y = 0; y <= height; y += TILE_HEIGHT) {
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

mapCanvas.addEventListener('click', (event) => {
  const tileData = tile.select(event, mapCanvas, tilesMap, tileCanvas)
  tile.updateTileAttributeBox(tileData)
})

document.getElementById('downloadButton').addEventListener('click', () => {
  tile.download(tileCanvas)
})

function main() {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas()
      .then(processCanvas)
      .catch(error => console.error('Error processing canvas:', error));
  });
}

// Initialize the canvas with an image
function initializeCanvas() {
  return new Promise((resolve, reject) => {
    const canvas = document.getElementById('map');
    if (!canvas) {
      reject(new Error('Canvas element not found'));
      return;
    }
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.src = './map.png'; 
    
    img.onload = () => {
      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);
      
      console.log('Canvas initialized with dimensions:', canvas.width, 'x', canvas.height);
      resolve(canvas);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load the image'));
    };
  });
}

// Process the canvas - main processing function
async function processCanvas(canvas) {
  try {
    console.time('Canvas Processing');
    // Step 1: Slice the canvas into tiles
    console.log('Slicing canvas into tiles...');
    console.time('Slicing Canvas');
    tilesMap = await tile.sliceCanvasInBackground(canvas, TILE_WIDTH, TILE_HEIGHT);
    console.timeEnd('Slicing Canvas');
    console.log(`Created ${tilesMap.size} tiles`);
    
    // Step 2: Process tiles in the background to find unique ones
    console.log('Finding unique tiles in background...');
    const { uniqueTilesMap, originalToUniqueMap } = await tile.findUniqueTilesInBackground(
      tilesMap, 
      TILE_WIDTH, 
      TILE_HEIGHT
    );    

    console.log(`Found ${uniqueTilesMap.size} unique tiles out of ${tilesMap.size} total tiles`);
    console.timeEnd('Canvas Processing');

    await processTiles()

    return { tilesMap, uniqueTilesMap, originalToUniqueMap };
    
  } catch (error) {
    console.error('Error during canvas processing:', error);
    throw error;
  }
}

// Process individual tiles to sort into types
async function processTiles() {


}

main()