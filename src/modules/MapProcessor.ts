import { TileGrid } from './TileGrid';
import { Tile } from './TileType';
import { TileTypeRegistry } from './TileTypeRegistry';

export class MapProcessor {
  private tileRegistry: TileTypeRegistry;
  private readonly tileSize: number = 14


  constructor() {
    this.tileRegistry = new TileTypeRegistry();
    this.registerKnownTileTypes();
  }

  private registerKnownTileTypes(): void {
    this.tileRegistry.registerTileType({
      id: 'unexplored',
      centerPixelColor: '#000000',
      match: (imageData) => {
        // Get center pixel color
        const centerIdx = (imageData.width / 2 * 4) + (imageData.height / 2 * imageData.width * 4);
        const r = imageData.data[centerIdx];
        const g = imageData.data[centerIdx + 1];
        const b = imageData.data[centerIdx + 2];

        return r === 0 && g === 0 && b === 0
      },
      createTile: () => ({
        type: {
        id: 'unexplored',
        name: 'Unexplored',
        category: 'special',
        imageIndex: 0
        }
      }) as Tile
    })
  }

  getImageData(canvas: HTMLCanvasElement, x: number, y: number): ImageData {
    const canvasX = x * canvas.width
    const canvasY = y * canvas.height
    const ctx = canvas.getContext('2d')!

    return ctx.getImageData(canvasX, canvasY, this.tileSize, this.tileSize)
  }

  processMap(canvas: HTMLCanvasElement, tileGrid: TileGrid): void {
    for (let y = 0; y < tileGrid.height; y++) {
      for (let x = 0; x < tileGrid.width; x++) {
        const imageData = this.getImageData(canvas, x, y)
        const identifiedTile = this.tileRegistry.identifyTile(imageData)
        if(identifiedTile) {
          tileGrid.setTile(x, y, identifiedTile)
          console.log('tile type: ', typeof identifiedTile)
        }
      }
    }
    console.log(tileGrid.getAllNonDefaultTiles())
    console.log('tileGrid size: ', tileGrid.size())
  }
}