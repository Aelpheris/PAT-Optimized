import { UnknownTileType } from "./SpecialTileType"



// Base tile categories to group by common attributes
export type TileCategory = 'special' | 'water'

// Base tile interface with common properties
export interface BaseTileType {
  id: string
  name: string
  category: TileCategory
}

export interface WaterTileType extends TileType {
  category: 'water'
}

export type TileType = BaseTileType

export interface Tile<T extends TileType = TileType> {
  type: T
  // metadata?: any;    // For any additional data you might want to store
}