import { MapProcessor } from './modules/MapProcessor'
import * as Tile from './modules/Tile'
import { TileGrid } from './modules/TileGrid'
import * as ui from './modules/ui'

const TILE_WIDTH = 12
const TILE_HEIGHT = 12
const tileSize = 12

let tilesMap: Map<string, object> = new Map()

let isDragging: boolean = false
let hasMoved: boolean = false
let selectedTiles: Set<string> = new Set()
let startTile: { row: number, col: number } | null
let currentTile: { row: number, col: number } | null
let gridWidth: number
let gridHeight: number

class App {
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
  private readonly tileSize: number = 12
  private tileGrid: TileGrid

  constructor() {
    this.mapCanvas = document.getElementById('map') as HTMLCanvasElement
    this.mapCtx = this.mapCanvas.getContext('2d', { 'willReadFrequently': true })!
    this.tileCanvas = document.getElementById('selected-tile') as HTMLCanvasElement
    this.img.src = './map.jpg'

    const gridWidth = this.mapCanvas.width / this.tileSize
    const gridHeight = this.mapCanvas.height / this.tileSize
    this.tileGrid = new TileGrid(gridWidth, gridHeight)
  }

  main(): void {

    this.bindEventListeners(this.mapCanvas, this.tileCanvas, this.img)

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeCanvas(this.mapCanvas, this.img, this.tileSize)
        .then(() => this.processTiles(this.mapCanvas, this.tileGrid))
        .catch(error => console.error('Error processing canvas:', error));
    })
  }

  drawTileToCanvas(event: MouseEvent, mapCanvas: HTMLCanvasElement, tileCanvas: HTMLCanvasElement, tileSize: number) {
    const tileCtx = tileCanvas.getContext('2d')!
    // Clear the target canvas
    tileCtx.clearRect(0, 0, tileCanvas.width, tileCanvas.height)

    const tile = ui.getTileFromMouse(event, mapCanvas, tileSize, gridWidth, gridHeight)

    // Draw selected tile to navbar canvas
    tileCtx.drawImage(mapCanvas, tile.row * tileSize, tile.col * tileSize, tileSize, tileSize, 0, 0, 56, 56)

    // Enable downloading
    const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement
    downloadButton.disabled = false
  }

  // Initialize the canvas with an image
  private async initializeCanvas(canvas: HTMLCanvasElement, img: HTMLImageElement, tileSize: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!canvas) {
        reject(new Error('Canvas element not found'));
        return;
      }

      const canvasCtx = canvas.getContext('2d')!

      img.onload = () => {
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        gridWidth = canvas.width / tileSize
        gridHeight = canvas.height / tileSize

        // Draw the image on the canvas
        canvasCtx.drawImage(img, 0, 0);

        console.log('Canvas initialized with dimensions:', canvas.width, 'x', canvas.height);
        resolve();
      };

      this.img.onerror = () => {
        reject(new Error('Failed to load the image'));
      };
    });
  }

  // Process individual tiles to sort into types
  private async processTiles(canvas: HTMLCanvasElement, tileGrid): Promise<void> {
    try {
      const mapProcessor = new MapProcessor()
      mapProcessor.processMap(canvas, tileGrid)
    } catch (error) {
      console.error('Error processing tiles:', error)
      throw error
    }
  }

  bindEventListeners(mapCanvas, tileCanvas, img) {
    const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement
    const filenameInput = document.getElementById('filename-input') as HTMLInputElement

    downloadButton.addEventListener('click', (e) => {
      e.preventDefault()
      Tile.download(tileCanvas, filenameInput.value)
    })

    mapCanvas.addEventListener('mousedown', (e) => {
      isDragging = true
      hasMoved = false

      startTile = ui.getTileFromMouse(e, mapCanvas, tileSize, gridWidth, gridHeight)
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

      const newTile = ui.getTileFromMouse(e, mapCanvas, tileSize, gridWidth, gridHeight)

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
            this.drawTileToCanvas(e, mapCanvas, tileCanvas, tileSize)
          }
        }

        drawHighlight(mapCanvas, img)
      }

      isDragging = false
      hasMoved = false
    })

    const grid = document.getElementById('grid')!

    grid.addEventListener('change', () => {
      ui.toggleGrid(mapCanvas, img, TILE_WIDTH, TILE_HEIGHT)
    })

    filenameInput.addEventListener('input', () => {
      downloadButton.disabled = !filenameInput.value
    })
  }
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


const app = new App()
app.main()