import { TileType } from "./TileType"

interface TileTypeMatcher {
  id: number
  centerPixelColor?: string
  match: (imageData: ImageData) => boolean
  createTile: () => TileType
}

export class TileTypeRegistry {
  private typeMatchers: TileTypeMatcher[] = []

  // Register a new tile type with its matching criteria
  registerTileType(matcher: TileTypeMatcher): void {
    this.typeMatchers.push(matcher)
  }

  identifyTile(imageData: ImageData): TileType | null {
    const matcher = this.typeMatchers.find(m => m.match(imageData))
    if (matcher) {
      return matcher.createTile( )
    }
    return null
  }

  generateTileMap(rawMap: ImageData[][]): TileType[][] {
    return rawMap.map( row =>
      row.map(tileData => this.identifyTile(tileData) || this.createUnknownTile(tileData))
    )
  }

  // Create default unknown tile for handling unknown tiles
  private createUnknownTile(imageData: ImageData): TileType {
    // Create basic tile with unknown type
    return {
      id: 'unknown',
      name: 'unknown',
      category: 'special',
      imageIndex: -1
    } as TileType
  }
}
