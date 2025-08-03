import { MapProcessor } from './modules/MapProcessor'
import * as Tile from './modules/Tile'
import { TileGrid } from './modules/TileGrid'
import * as ui from './modules/ui'

const TILE_WIDTH = 14
const TILE_HEIGHT = 14

let tilesMap: Map<string, object> = new Map()
let tileGrid: TileGrid

let isDragging: boolean = false
let hasMoved: boolean = false
let selectedTiles: Set<string> = new Set()
let startTile: { row: number, col: number } | null
let currentTile: { row: number, col: number } | null
let gridWidth: number
let gridHeight: number

class app {
  // Canvas
  private mapCanvas: HTMLCanvasElement
  private mapCtx: CanvasRenderingContext2D
  private tileCanvas: HTMLCanvasElement
  private img: HTMLImageElement = new Image()

  // UI
  private isDragging: boolean = false
  private hasMoved: boolean = false

  // Tile
  private selectedTiles: Set<string> = new Set()
  private startTile: { row: number, col: number } | null = null
  private currentTile: { row: number, col: number } | null = null

  // Tile Grid
  private readonly tileSize: number = 14
  private tileGrid: TileGrid

  constructor() {
    this.mapCanvas = document.getElementById('map') as HTMLCanvasElement
    this.mapCtx = this.mapCanvas.getContext('2d', { 'willReadFrequently': true })!
    this.tileCanvas = document.getElementById('selected-tile') as HTMLCanvasElement
    this.img.src = './map.png'

    const gridWidth = this.mapCanvas.width / this.tileSize
    const gridHeight = this.mapCanvas.height / this.tileSize
    this.tileGrid = new TileGrid(gridWidth, gridHeight)
  }

  main(): void {

  }
}

function main() {
  const mapCanvas = document.getElementById('map') as HTMLCanvasElement
  mapCanvas.getContext('2d', { 'willReadFrequently': true })
  const tileCanvas = document.getElementById('selected-tile')
  const img = new Image();
  img.src = './map.png';

  const width = mapCanvas.width / TILE_WIDTH
  const height = mapCanvas.height / TILE_WIDTH

  tileGrid = new TileGrid(width, height)

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
    // tilesMap = await Tile.sliceCanvasInBackground(canvas, TILE_WIDTH, TILE_HEIGHT);
    console.timeEnd('Slicing Canvas');
    console.log(`Created ${tilesMap.size} tiles`);

    // Step 2: Process tiles in the background to find unique ones
    console.log('Finding unique tiles in background...');
    // const { uniqueTilesMap, originalToUniqueMap } = await Tile.findUniqueTilesInBackground(
    //   tilesMap,
    //   TILE_WIDTH,
    //   TILE_HEIGHT
    // );

    // console.log(`Found ${uniqueTilesMap.size} unique tiles out of ${tilesMap.size} total tiles`);
    console.timeEnd('Canvas Processing');

    processTiles(canvas)

    // return { tilesMap, uniqueTilesMap, originalToUniqueMap };

  } catch (error) {
    console.error('Error during canvas processing:', error);
    throw error;
  }
}

// Process individual tiles to sort into types
function processTiles(canvas: HTMLCanvasElement) {
  const mapProcessor = new MapProcessor()
  mapProcessor.processMap(canvas, tileGrid)
}

function drawHighlight(mapCanvas: HTMLCanvasElement, img: string): void {
  const ctx = mapCanvas.getContext('2d')!

  ui.redrawCanvas(mapCanvas, img)

  // Draw highlighted cells
  for (const tile of selectedTiles) {
    const [row, col] = tile.split(',').map(Number)
    ui.highlight(mapCanvas, col * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)

  }

  // If currently selecting, draw a border around the selection
  if (isDragging && hasMoved && startTile && currentTile) {
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
  const filenameInput = document.getElementById('filename-input') as HTMLInputElement

  downloadButton.addEventListener('click', (e) => {
    e.preventDefault()
    Tile.download(tileCanvas, filenameInput.value)
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

        // Redraw selected tile to the navbar canvas
        if (startTile) {
          drawTileToCanvas(e, startTile, tileCanvas, tilesMap, mapCanvas)
        }
      }

      drawHighlight(mapCanvas, img)
    }

    isDragging = false
    hasMoved = false
  })

  const grid = document.getElementById('grid')

  document.getElementById('grid').addEventListener('change', () => {
    ui.toggleGrid(mapCanvas, img, TILE_WIDTH, TILE_HEIGHT)
  })

  filenameInput.addEventListener('input', () => {
    downloadButton.disabled = !filenameInput.value
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

function drawTileToCanvas(event, targetTile, tileCanvas, tilesMap, mapCanvas) {
  const tileCtx = tileCanvas.getContext('2d')
  // Clear the target canvas
  tileCtx.clearRect(0, 0, tileCanvas.width, tileCanvas.height)

  const tileData = Tile.fromMap(event, mapCanvas, tilesMap)

  // Draw selected tile to navbar canvas
  tileCtx.drawImage(mapCanvas, tileData.x * TILE_WIDTH, tileData.y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, 0, 0, 56, 56)

  // Enable downloading
  document.getElementById('downloadButton').disabled = false
}


main()