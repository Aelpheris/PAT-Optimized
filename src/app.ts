import { MapProcessor } from './modules/MapProcessor'
import * as Tile from './modules/Tile'
import { TileGrid } from './modules/TileGrid'
import * as ui from './modules/ui'
import { API } from './modules/api'

class App {
  // Canvas
  private mapCanvas: HTMLCanvasElement
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
  private tileGrid!: TileGrid

  // API
  private api: API

  constructor() {
    this.mapCanvas = document.getElementById('map') as HTMLCanvasElement
    this.mapCanvas.getContext('2d', { 'willReadFrequently': true })!
    this.img.src = './myMap_1754504152734.png'
    this.tileCanvas = document.getElementById('selected-tile') as HTMLCanvasElement
    this.api = new API('http://localhost:3000')

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeCanvas(this.mapCanvas, this.img, this.tileSize)
        .then(() => {
          this.bindEventListeners()
          this.tileGrid = this.createGrid(this.mapCanvas.width, this.mapCanvas.height, this.tileSize)
          console.log('number of tiles: ', this.tileGrid.width * this.tileGrid.height)
        })
        .then(() => {
          this.processTiles(this.mapCanvas, this.tileGrid)
        })
        .catch(error => console.error('Error processing canvas:', error));
    })
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

  private createGrid(canvasWidth: number, canvasHeight: number, tileSize: number): TileGrid {
    const gridWidth = canvasWidth / tileSize
    const gridHeight = canvasHeight / tileSize
    console.log('gridWidth: ', gridWidth)
    console.log('gridHeigh: ', gridHeight)
    return new TileGrid(gridWidth, gridHeight)
  }

  drawTileToCanvas(event: MouseEvent, mapCanvas: HTMLCanvasElement, tileCanvas: HTMLCanvasElement, tileSize: number) {
    const tileCtx = tileCanvas.getContext('2d')!
    // Clear the target canvas
    tileCtx.clearRect(0, 0, tileCanvas.width, tileCanvas.height)

    const tile = ui.getTileFromMouse(event, mapCanvas, tileSize, this.tileGrid.width, this.tileGrid.height)

    const sx = tile.col * tileSize
    const sy = tile.row * tileSize

    // Draw selected tile to navbar canvas
    tileCtx.drawImage(mapCanvas, sx, sy, tileSize, tileSize, 0, 0, 56, 56)

    // Enable downloading
    const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement
    downloadButton.disabled = false
  }

  // Process individual tiles to sort into types
  private async processTiles(canvas: HTMLCanvasElement, tileGrid): Promise<void> {
    try {
      const mapProcessor = new MapProcessor(this.tileSize)
      mapProcessor.processMap(canvas, tileGrid)
    } catch (error) {
      console.error('Error processing tiles:', error)
      throw error
    }
  }

  private bindEventListeners() {

    this.mapCanvas.addEventListener('mousedown', (e) => this.mouseDown(e))
    this.mapCanvas.addEventListener('mousemove', (e) => this.moveMouse(e))
    this.mapCanvas.addEventListener('mouseup', (e) => this.drawRect(e))

    const filenameInput = document.getElementById('filename-input') as HTMLInputElement
    filenameInput.addEventListener('input', () => {
      downloadButton.disabled = !filenameInput.value
    })

    const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement
    downloadButton.addEventListener('click', (e) => {
      e.preventDefault()
      this.api.uploadImage(this.tileCanvas, filenameInput.value)
    })

    const gridToggle = document.getElementById('grid') as HTMLInputElement
    gridToggle.addEventListener('change', (e) => {
      if (gridToggle.checked) {
        ui.toggleGrid(this.mapCanvas, this.tileSize)
      } else {
        ui.redrawCanvas(this.mapCanvas, this.img)
      }
    })

    const knownTileToggle = document.getElementById('known-tiles') as HTMLInputElement
    knownTileToggle.addEventListener('change', (e) => {
      if (knownTileToggle.checked) {
        const tiles = this.tileGrid.getAllNonDefaultTiles()
        tiles.forEach((tile) => {
          ui.highlight(this.mapCanvas, tile.x * this.tileSize, tile.y * this.tileSize, this.tileSize, this.tileSize)
        })
      } else {
        ui.redrawCanvas(this.mapCanvas, this.img)
      }
    })
  }


  private mouseDown(e: MouseEvent) {
    this.isDragging = true
    this.hasMoved = false

    this.startTile = ui.getTileFromMouse(
      e,
      this.mapCanvas,
      this.tileSize,
      this.tileGrid.width,
      this.tileGrid.height
    )

    this.currentTile = this.startTile

    if (!e.shiftKey) {
      this.selectedTiles.clear()
    }

    // We don't immediately select the cell here
    // Selection happens either on mouse move (rectangle) or mouse up (single cell)
    this.drawHighlight(this.mapCanvas, this.img)
  }

  private moveMouse(e: MouseEvent) {
    if (!this.isDragging || !this.startTile) return

    const newTile = ui.getTileFromMouse(
      e,
      this.mapCanvas,
      this.tileSize,
      this.tileGrid.width,
      this.tileGrid.height
    )

    // Only update if the current cell has changed
    if (!this.currentTile ||
      newTile.row !== this.currentTile.row ||
      newTile.col !== this.currentTile.col) {

      this.hasMoved = true
      this.currentTile = newTile

      // Calculate new selection for rectangle drag
      if (!e.shiftKey) {
        this.selectedTiles.clear()
      }
      this.updateRectangularSelection()
      this.drawHighlight(this.mapCanvas, this.img)
    }
  }

  private drawRect(e: MouseEvent): void {
    if (this.isDragging && !this.hasMoved && this.startTile) {
      // If we haven't moved, it's a single cell click
      const cellKey = `${this.startTile.row},${this.startTile.col}`

      // For single click with shift key, toggle the cell's selection state
      if (e.shiftKey) {
        if (this.selectedTiles.has(cellKey)) {
          this.selectedTiles.delete(cellKey)
        } else {
          this.selectedTiles.add(cellKey)
        }
      } else {
        // Without shift, just select single cell
        this.selectedTiles.clear()
        this.selectedTiles.add(cellKey)

        // Redraw selected tile to the navbar canvas
        if (this.startTile) {
          // Get selected tile to return data about tile
          const tileCoord = ui.getTileFromMouse(e, this.mapCanvas, this.tileSize, this.tileGrid.width, this.tileGrid.height)
          const tileData = this.tileGrid.getTile(tileCoord.col, tileCoord.row)

          // Use offscreen canvas to get image data before image is resized for navbar
          const tileCanvasOffscreen = new OffscreenCanvas(this.tileSize, this.tileSize)
          const offScreenCtx = tileCanvasOffscreen.getContext('2d')!
          offScreenCtx.clearRect(0, 0, this.tileSize, this.tileSize)
          const sx = tileCoord.col * this.tileSize
          const sy = tileCoord.row * this.tileSize
          offScreenCtx.drawImage(this.mapCanvas, sx, sy, this.tileSize, this.tileSize, 0, 0, this.tileSize, this.tileSize)
          const imageData = offScreenCtx.getImageData(0, 0, this.tileSize, this.tileSize)

          // Get center pixel color
          const centerIdx = (imageData.width / 2 * 4) + (imageData.height / 2 * imageData.width * 4);
          const r = imageData.data[centerIdx];
          const g = imageData.data[centerIdx + 1];
          const b = imageData.data[centerIdx + 2];

          Tile.sha256Hash(imageData.data).then((imageHash) => {

            const attributes = {
              tileData: tileData,
              x: tileCoord.col,
              y: tileCoord.row,
              imageHash: imageHash,
              rgb: `${r},${g},${b}`
            }

            ui.showAttributes('attributes', attributes)
          })

          this.drawTileToCanvas(e, this.mapCanvas, this.tileCanvas, this.tileSize)
        }
      }

      this.drawHighlight(this.mapCanvas, this.img)
    }

    this.isDragging = false
    this.hasMoved = false
  }

  private drawHighlight(mapCanvas: HTMLCanvasElement, img: HTMLImageElement): void {
    const ctx = mapCanvas.getContext('2d')!

    ui.redrawCanvas(mapCanvas, img)

    // Draw highlighted cells
    for (const tile of this.selectedTiles) {
      const [row, col] = tile.split(',').map(Number)
      ui.highlight(mapCanvas, col * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize)

    }

    // If currently selecting, draw a border around the selection
    if (this.isDragging && this.hasMoved && this.startTile && this.currentTile) {
      const startRow = Math.min(this.startTile.row, this.currentTile.row);
      const endRow = Math.max(this.startTile.row, this.currentTile.row);
      const startCol = Math.min(this.startTile.col, this.currentTile.col);
      const endCol = Math.max(this.startTile.col, this.currentTile.col);

      const x = startCol * this.tileSize;
      const y = startRow * this.tileSize;
      const width = (endCol - startCol + 1) * this.tileSize;
      const height = (endRow - startRow + 1) * this.tileSize;

      ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    }
  }

  private updateRectangularSelection(): void {
    if (!this.startTile || !this.currentTile) return;

    // Calculate the rectangle bounds
    const startRow = Math.min(this.startTile.row, this.currentTile.row);
    const endRow = Math.max(this.startTile.row, this.currentTile.row);
    const startCol = Math.min(this.startTile.col, this.currentTile.col);
    const endCol = Math.max(this.startTile.col, this.currentTile.col);

    // Add all cells in the rectangle to the selection
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        this.selectedTiles.add(`${row},${col}`);
      }
    }
  }
}


new App()