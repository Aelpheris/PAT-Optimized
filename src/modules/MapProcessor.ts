import { TileGrid } from './TileGrid';
import { TileType } from './TileType';
import { TileTypeRegistry } from './TileTypeRegistry';

export class MapProcessor {
    private tileRegistry: TileTypeRegistry;

    
    constructor(canvas: HTMLCanvasElement) {
      this.tileRegistry = new TileTypeRegistry();
      this.registerKnownTileTypes();
    }

    private registerKnownTileTypes(): void {
      this.tileRegistry.registerTileType({
        id: 'unexplored',
        centerPixelColor: '#000000',
        match: (imageData) => {
          const centerIdx = (imageData.width / 2 * 4) + (imageData.height / 2 * imageData.width * 4);
          const r = imageData.data[centerIdx];
          const g = imageData.data[centerIdx + 1];
          const b = imageData.data[centerIdx + 2];

          return r === 0 && g === 0 && b === 0
        },
        createTile: () => ({
          id: 'unexplored',
          name: 'Unexplored',
          category: 'special',
          imageIndex: 0
        }) as TileType
      })
    }

    processMap(): TileGrid {
      const uniqueTiles = this.tileAnalyzer.analyzeTiles()

      uniqueTiles.array.forEach(element => {
        
      });
    }
}