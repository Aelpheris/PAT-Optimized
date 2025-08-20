import { Tile } from "./tileType/TileType"

interface TileTypeMatcher {
  id: string
  centerPixelColor?: string
  match: (imageData: ImageData) => boolean
  createTile: () => Tile
}

export class TileTypeRegistry {
  private typeMatchers: TileTypeMatcher[] = []

  // Register a new tile type with its matching criteria
  registerTileType(matcher: TileTypeMatcher): void {
    this.typeMatchers.push(matcher)
  }

  identifyTile(imageData: ImageData): Tile | null {
    const matcher = this.typeMatchers.find(m => m.match(imageData))
    if (matcher) {
      return matcher.createTile( )
    }
    return null
  }

  generateTileMap(rawMap: ImageData[][]): Tile[][] {
    return rawMap.map( row =>
      row.map(tileData => this.identifyTile(tileData) || this.createUnknownTile(tileData))
    )
  }

  // Create default unknown tile for handling unknown tiles
  private createUnknownTile(_: ImageData): Tile {
    // Create basic tile with unknown type
    return {
      type: {
      id: '-1',
      name: 'unknown',
      category: 'special'
      }
    } as Tile
  }
}
