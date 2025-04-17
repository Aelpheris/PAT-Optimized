import * as tile from './modules/tile.js'
import * as ui from './modules/ui.js'

const TILE_WIDTH = 14
const TILE_HEIGHT = 14

let tilesMap = new Map()

function main() {
  const mapCanvas = document.getElementById('map')
  const tileCanvas = document.getElementById('selected-tile')
  const img = new Image();
  img.src = './map.png';

  bindEventListeners(mapCanvas, tileCanvas, img)

  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas(mapCanvas, img)
      .then(processCanvas)
      .catch(error => console.error('Error processing canvas:', error));
  });
}

// Initialize the canvas with an image
function initializeCanvas(canvas, img) {
  return new Promise((resolve, reject) => {
    if (!canvas) {
      reject(new Error('Canvas element not found'));
      return;
    }

    const ctx = canvas.getContext('2d');

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

function bindEventListeners(mapCanvas, tileCanvas, img) {
  mapCanvas.addEventListener('click', (event) => {
    const tileData = tile.select(event, mapCanvas, tilesMap, tileCanvas)
    tile.updateTileAttributeBox(tileData)
  })

  document.getElementById('downloadButton').addEventListener('click', () => {
    tile.download(tileCanvas)
  })

  document.getElementById('grid').addEventListener('change', () => {
    ui.toggleGrid(mapCanvas, img, TILE_WIDTH, TILE_HEIGHT)
  })
}

main()