import { TileType, UnknownTileType } from "./TileType";


/*
This is an efficient coordinate-based mapping of tiles from the image grid.
It is used to assign each tile in the grid a tile type, and able to reference
individual tiles by their coordinates from the view of the tile grid.
*/
export class TileGrid {
  private tiles = new Map<string, TileType>()
  private readonly width: number
  private readonly height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  private key(x: number, y: number): string {
    return `${x},${y}`
  }

  public isValidCoordinate(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  public getTile(x: number, y: number): TileType {
    if (!this.isValidCoordinate(x, y)) {
      throw new Error(`Coordinates out of bounds: ${x},${y}`)
    }

    return this.tiles.get(this.key(x, y)) || {} as UnknownTileType
  }

  public setTile(x: number, y: number, tile: TileType): void {
    if (!this.isValidCoordinate(x, y)) {
      throw new Error(`Coordinates out of bounds: ${x},${y}`)
    }

    this.tiles.set(this.key(x, y), tile)
  }

  /**
 * Get neighbors of a tile
 */
  getNeighbors(x: number, y: number): Array<{ x: number, y: number, tile: TileType }> {
    const directions = [
      { dx: -1, dy: 0 }, // left
      { dx: 1, dy: 0 },  // right
      { dx: 0, dy: -1 }, // up
      { dx: 0, dy: 1 }   // down
    ];

    return directions
      .map(dir => ({ x: x + dir.dx, y: y + dir.dy }))
      .filter(pos => this.isValidCoordinate(pos.x, pos.y))
      .map(pos => ({ x: pos.x, y: pos.y, tile: this.getTile(pos.x, pos.y) }));
  }
}