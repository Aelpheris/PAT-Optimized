import { Tile } from "./TileType";
import { BaseTileType } from "./BaseTileType";


// Unknown or unexplored tiles

// Used to build upon identifying initial tile types,
// and useful to quickly identify new tiles added to the map
export interface SpecialTileType extends BaseTileType {
  category: 'special';
}

export interface UnknownTileType extends SpecialTileType {
  id: '-1'
  name: 'unknown'
}

export interface UnexploredTileType extends SpecialTileType {
  id: '0'
  name: 'unexplored'
}

export interface UnrestoredTileType extends SpecialTileType {
  id: '1'
  name: 'unrestored'
}

// Type guard functions to check for specific tile types
export function isUnknownTile(tile: Tile): tile is Tile<UnknownTileType> {
  return tile.type.name === 'unknown'
}

export function isUnexploredTile(tile: Tile): tile is Tile<UnexploredTileType> {
  return tile.type.name === 'unexplored'
}