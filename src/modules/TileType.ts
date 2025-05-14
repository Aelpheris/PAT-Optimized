


// Base tile categories to group by common attributes
export type TileCategory = 'special'

// Base tile interface with common properties
export interface BaseTileType {
  id: string
  name: string
  category: TileCategory
  imageIndex: number
}

// Unknown or unexplored tiles
export interface SpecialTileType {
  category: 'special'
}

// Used to build upon identifying initial tile types,
// and useful to quickly identify new tiles added to the map
export interface UnknownTileType extends TileType {
  id: '-1'
  name: 'Unknown'
  category: 'special'
}

export interface UnexploredTileType extends TileType {
  id: '0'
  name: 'Unexplored'
  category: 'special'
}

export interface UnrestoredTileType extends TileType {
  id: '1'
  name: 'Unrestored'
  category: 'special'
}

export type TileType = BaseTileType

export interface Tile<T extends TileType = TileType> {
  type: T
  // metadata?: any;    // For any additional data you might want to store
}

// Type guard functions to check for specific tile types
export function isUnknownTile(tile: Tile): tile is Tile<UnknownTileType> {
  return tile.type.id === '-1' && tile.type.name === 'Unknown';
}

export function isUnexploredTile(tile: Tile): tile is Tile<UnexploredTileType> {
  return tile.type.id === '0' && tile.type.name === 'Unexplored';
}