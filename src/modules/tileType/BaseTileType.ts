
// Base tile interface with common properties

export interface BaseTileType {
  id: string;
  name: string;
  category: TileCategory;
}// Base tile categories to group by common attributes



export type TileCategory = 'special' | 'aquatic' | 'land' | 'building'

