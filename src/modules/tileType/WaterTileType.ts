import { BaseTileType } from "./BaseTileType"


export interface AquaticTileType extends BaseTileType {
  category: 'aquatic'
}

export interface WaterTileType extends AquaticTileType {
  name: 'water'
}

export interface DeepWaterTileType extends AquaticTileType {
  name: 'deepWater'
}