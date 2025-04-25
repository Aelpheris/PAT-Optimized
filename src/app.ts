import * as tile from './modules/tile'
import * as ui from './modules/ui'

const TILE_WIDTH = 14
const TILE_HEIGHT = 14

let tilesMap: Map<string, object> = new Map()

let isDragging: boolean = false
let hasMoved: boolean = false
let selectedTiles: Set<string> = new Set()
let startTile: { row: number, col: number } | null
let currentTile: { row: number, col: number } | null
let gridWidth: number
let gridHeight: number

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

      gridWidth = canvas.width / TILE_WIDTH
      gridHeight = canvas.height / TILE_HEIGHT

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

function drawHighlight(mapCanvas: HTMLCanvasElement, img: string): void {
  const ctx = mapCanvas.getContext('2d')
  ui.redrawCanvas(mapCanvas, img)
  for (const tile of selectedTiles) {
    const [row, col] = tile.split(',').map(Number)
    ui.highlight(mapCanvas, col * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)
  }

  // If currently selecting, draw a border around the selection
  if (isDragging && startTile && currentTile) {
    const startRow = Math.min(startTile.row, currentTile.row);
    const endRow = Math.max(startTile.row, currentTile.row);
    const startCol = Math.min(startTile.col, currentTile.col);
    const endCol = Math.max(startTile.col, currentTile.col);

    const x = startCol * TILE_WIDTH;
    const y = startRow * TILE_HEIGHT;
    const width = (endCol - startCol + 1) * TILE_WIDTH;
    const height = (endRow - startRow + 1) * TILE_HEIGHT;

    ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  }
}

function bindEventListeners(mapCanvas, tileCanvas, img) {
  const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement

  // mapCanvas.addEventListener('click', (event) => {
  //   const tileData = tile.select(event, mapCanvas, tilesMap, tileCanvas)
  //   tile.updateTileAttributeBox(tileData)
  // })

  downloadButton.addEventListener('click', () => {
    tile.download(tileCanvas)
  })

  mapCanvas.addEventListener('mousedown', (e) => {
    isDragging = true
    hasMoved = false

    startTile = ui.getTileFromMouse(e, mapCanvas, TILE_WIDTH, TILE_HEIGHT, gridWidth, gridHeight)
    currentTile = startTile

    if (!e.shiftKey) {
      selectedTiles.clear()
    }

    // We don't immediately select the cell here
    // Selection happens either on mouse move (rectangle) or mouse up (single cell)
    drawHighlight(mapCanvas, img)
  })

  mapCanvas.addEventListener('mousemove', (e) => {
    if (!isDragging || !startTile) return

    const newTile = ui.getTileFromMouse(e, mapCanvas, TILE_WIDTH, TILE_HEIGHT, gridWidth, gridHeight)

    // Only update if the current cell has changed
    if (!currentTile ||
      newTile.row !== currentTile.row ||
      newTile.col !== currentTile.col) {

      hasMoved = true
      currentTile = newTile

      // Calculate new selection for rectangle drag
      if (!e.shiftKey) {
        selectedTiles.clear()
      }
      updateRectangularSelection()
      drawHighlight(mapCanvas, img)
    }
  })

  mapCanvas.addEventListener('mouseup', (e) => {
    if (isDragging && !hasMoved && startTile) {
      // If we haven't moved, it's a single cell click
      const cellKey = `${startTile.row},${startTile.col}`

      // For single click with shift key, toggle the cell's selection state
      if (e.shiftKey) {
        if (selectedTiles.has(cellKey)) {
          selectedTiles.delete(cellKey)
        } else {
          selectedTiles.add(cellKey)
        }
      } else {
        // Without shift, just select single cell
        selectedTiles.clear()
        selectedTiles.add(cellKey)
      }
    }

    // draw single tile to navbar, or else draw entire rectangle
    if(selectedTiles.size == 1) {
      tile.select(e, mapCanvas, tilesMap, tileCanvas)
    } else {
      drawHighlight(mapCanvas, img)
    }

    isDragging = false
    hasMoved = false
  })

  document.getElementById('grid').addEventListener('change', () => {
    ui.toggleGrid(mapCanvas, img, TILE_WIDTH, TILE_HEIGHT)
  })
}

function updateRectangularSelection(): void {
  if (!startTile || !currentTile) return;

  // Calculate the rectangle bounds
  const startRow = Math.min(startTile.row, currentTile.row);
  const endRow = Math.max(startTile.row, currentTile.row);
  const startCol = Math.min(startTile.col, currentTile.col);
  const endCol = Math.max(startTile.col, currentTile.col);

  // Add all cells in the rectangle to the selection
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      selectedTiles.add(`${row},${col}`);
    }
  }
}


main()