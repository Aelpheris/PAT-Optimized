import { BuildingTileType } from "./BuildingTileType"
import { LandTileType } from "./LandTileType"
import { SpecialTileType } from "./SpecialTileType"
import { AquaticTileType } from "./AquaticTileType"


export type TileType = SpecialTileType | AquaticTileType | LandTileType | BuildingTileType

export interface Tile<T extends TileType = TileType> {
  type: T
  // metadata?: any;    // For any additional data you might want to store
}