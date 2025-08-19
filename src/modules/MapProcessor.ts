import { TileGrid } from './TileGrid'
import { Tile } from './TileType'
import { TileTypeRegistry } from './TileTypeRegistry'

export class MapProcessor {
  private tileRegistry: TileTypeRegistry
  private readonly tileSize: number


  constructor(tileSize: number) {
    this.tileRegistry = new TileTypeRegistry()
    this.tileSize = tileSize
    this.registerKnownTileTypes()
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

        // console.log('rgb values: ', r, g, b)

        return r === 1 && g === 1 && b === 0
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

    this.tileRegistry.registerTileType({
      id: 'unexplored',
      centerPixelColor: '#000000',
      match: (imageData) => {
        // Get center pixel color
        const centerIdx = (imageData.width / 2 * 4) + (imageData.height / 2 * imageData.width * 4);
        const r = imageData.data[centerIdx];
        const g = imageData.data[centerIdx + 1];
        const b = imageData.data[centerIdx + 2];

        // console.log('rgb values: ', r, g, b)

        return r === 0 && g === 1 && b === 0
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

    this.tileRegistry.registerTileType({
      id: 'unexplored',
      centerPixelColor: '#000000',
      match: (imageData) => {
        // Get center pixel color
        const centerIdx = (imageData.width / 2 * 4) + (imageData.height / 2 * imageData.width * 4);
        const r = imageData.data[centerIdx];
        const g = imageData.data[centerIdx + 1];
        const b = imageData.data[centerIdx + 2];

        // console.log('rgb values: ', r, g, b)

        return r === 0 && g === 1 && b === 1
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

    this.tileRegistry.registerTileType({
      id: 'unexplored',
      centerPixelColor: '#000000',
      match: (imageData) => {
        // Get center pixel color
        const centerIdx = (imageData.width / 2 * 4) + (imageData.height / 2 * imageData.width * 4);
        const r = imageData.data[centerIdx];
        const g = imageData.data[centerIdx + 1];
        const b = imageData.data[centerIdx + 2];

        // console.log('rgb values: ', r, g, b)

        return r === 1 && g === 0 && b === 1
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

    this.tileRegistry.registerTileType({
      id: 'unexplored',
      centerPixelColor: '#000000',
      match: (imageData) => {
        // Get center pixel color
        const centerIdx = (imageData.width / 2 * 4) + (imageData.height / 2 * imageData.width * 4);
        const r = imageData.data[centerIdx];
        const g = imageData.data[centerIdx + 1];
        const b = imageData.data[centerIdx + 2];

        // console.log('rgb values: ', r, g, b)

        return r === 0 && g === 0 && b === 1
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

    this.tileRegistry.registerTileType({
      id: 'unexplored',
      centerPixelColor: '#000000',
      match: (imageData) => {
        // Get center pixel color
        const centerIdx = (imageData.width / 2 * 4) + (imageData.height / 2 * imageData.width * 4);
        const r = imageData.data[centerIdx];
        const g = imageData.data[centerIdx + 1];
        const b = imageData.data[centerIdx + 2];

        // console.log('rgb values: ', r, g, b)

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

    this.tileRegistry.registerTileType({
      id: 'unexplored',
      centerPixelColor: '#000000',
      match: (imageData) => {
        // Get center pixel color
        const centerIdx = (imageData.width / 2 * 4) + (imageData.height / 2 * imageData.width * 4);
        const r = imageData.data[centerIdx];
        const g = imageData.data[centerIdx + 1];
        const b = imageData.data[centerIdx + 2];

        // console.log('rgb values: ', r, g, b)

        return r === 1 && g === 0 && b === 0
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

    this.tileRegistry.registerTileType({
      id: 'unexplored',
      centerPixelColor: '#000000',
      match: (imageData) => {
        // Get center pixel color
        const centerIdx = (imageData.width / 2 * 4) + (imageData.height / 2 * imageData.width * 4);
        const r = imageData.data[centerIdx];
        const g = imageData.data[centerIdx + 1];
        const b = imageData.data[centerIdx + 2];

        // console.log('rgb values: ', r, g, b)

        return r === 1 && g === 1 && b === 1
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
    const ctx = canvas.getContext('2d')!
    return ctx.getImageData(x, y, this.tileSize, this.tileSize)
  }

  matchCenterPixel(imageData: ImageData, r: number, g: number, b: number): boolean {
        // Get center pixel color
        const centerIdx = (imageData.width / 2 * 4) + (imageData.height / 2 * imageData.width * 4);
        const imgR = imageData.data[centerIdx];
        const imgG = imageData.data[centerIdx + 1];
        const imgB = imageData.data[centerIdx + 2];

        return imgR === r && imgG === g && imgB === b
  }

  processMap(canvas: HTMLCanvasElement, tileGrid: TileGrid) {
    for (let y = 0; y < tileGrid.height; y++) {
      for (let x = 0; x < tileGrid.width; x++) {
        const width = x * this.tileSize
        const height = y * this.tileSize
        const imageData = this.getImageData(canvas, width, height)
        const identifiedTile = this.tileRegistry.identifyTile(imageData)
        if (identifiedTile) {
          tileGrid.setTile(x, y, identifiedTile)
        }
      }
    }
    console.log('tileGrid non-default tiles: ', tileGrid.size())
  }
}