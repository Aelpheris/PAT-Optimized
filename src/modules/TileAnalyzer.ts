import { TileGrid } from './TileGrid';
import * as ui from './ui';


export type Coordinates = { x: number, y: number }

interface PixelTileType {
  id: number
  name: string
  color: string
  tileCoordinates: Coordinates
}

export class TileAnalyzer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tileTypes: Map<string, PixelTileType> = new Map();
  private tileGrid: TileGrid
  private readonly tileSize = 14;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    const width = Math.floor(this.canvas.width / this.tileSize)
    const height = Math.floor(this.canvas.height / this.tileSize)
    this.tileGrid = new TileGrid(width, height)

    this.analyzeTiles();
  }

  getPixelColor(x: number, y: number): string {
    const pixel = this.ctx.getImageData(x, y, 1, 1).data;
    return `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
  }

  analyzeTiles(): TileGrid {

    let nextTileTypeId = 0

    for (let y = 0; y < this.tileGrid.height; y++) {
      for (let x = 0; x < this.tileGrid.width; x++) {
        const centerX = x * this.tileSize + Math.floor(this.tileSize / 2)
        const centerY = y * this.tileSize + Math.floor(this.tileSize / 2)

        const color = this.getPixelColor(centerX, centerY)

        if (!this.tileTypes.has(color)) {
          this.tileTypes.set(color, {
            id: nextTileTypeId++,
            name: `Type ${nextTileTypeId}`,
            color,
            tileCoordinates: { x, y }
          })
        } else {
          ui.highlight(this.canvas, x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
        }

        // Store the tile type ID in our grid
        this.tileGrid.setTile(x, y)
      }
    }

    console.log(`Found ${this.tileTypes.size} different tile types`);
    return this.tileGrid
  }

  private async extractTileImages(): Promise<Record<string, Blob>> {
    // Create new canvas for extracted tile
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.tileSize;
    tempCanvas.height = this.tileSize;
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) {
      return Promise.reject(new Error('Could not get canvas context'));
    }

    const results: Record<number, Blob> = {};

    for (const [_, tile] of this.tileTypes) {
      // Coordinates of the tile starting width and height in pixels on main map canvas
      const mapX = tile.tileCoordinates.x * this.tileSize;
      const mapY = tile.tileCoordinates.y * this.tileSize;

      tempCtx.clearRect(0, 0, this.tileSize, this.tileSize);

      tempCtx.drawImage(
        this.canvas,
        mapX, mapY, this.tileSize, this.tileSize, // Source tile
        0, 0, tempCanvas.width, tempCanvas.height // Destination rectangle
      );

      const blob = await new Promise<Blob>((resolve, reject) => {
        tempCanvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, 'image/png');
      });

      results[tile.id] = blob;
    }

    return results;
  }

  public async downloadUniqueTiles(): Promise<Response> {
    try {
      const url = 'http://localhost:3000/api/upload-multi';
      const formData = new FormData();

      const images = await this.extractTileImages();
      for (const id in images) {
        const blob = images[id];
        formData.append('images', blob, `${id}.png`);
      }

      return fetch(url, {
        method: 'post',
        body: formData
      });
    } catch (error) {
      console.error('Error uploading multiple canvas sections:', error);
      throw error;
    }
  }
}
