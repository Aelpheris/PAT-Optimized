import { RawTileType, TileType } from "./TileType"

interface TileTypeMatcher {
  id: number
  centerPixelColor?: string
  match: (rawTile: RawTileType) => boolean
  createTile: () => TileType
}

export class TileRegistry {
  private typeMatchers: TileTypeMatcher[] = []

  // Register a new tile type with its matching criteria
  registerTileType(matcher: TileTypeMatcher): void {
    this.typeMatchers.push(matcher)
  }

  identifyTile(rawTile: RawTileType): TileType | null {
    const matcher = this.typeMatchers.find(m => m.match(rawTile))
    if (matcher) {
      return matcher.createTile( )
    }
    return null
  }

  generateTileMap(rawMap: RawTileType[][]): TileType[][] {
    return rawMap.map( row =>
      row.map(tileData => this.identifyTile(tileData) || this.createUnknownTile(tileData))
    )
  }

  // Create default unknown tile for handling unknown tiles
  private createUnknownTile(rawTile: RawTileType): TileType {
    // Create basic tile with unknown type
    return {
      id: 'unknown',
      name: 'unknown',
      category: 'special',
    }
  }
}
