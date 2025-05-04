import { TileAnalyzer } from './TileAnalyzer';
import { TileTypeRegistry } from './TileTypeRegistry';

export class MapProcessor {
    private tileAnalyzer: TileAnalyzer;
    private tileRegistry: TileTypeRegistry;
    
    constructor(canvas: HTMLCanvasElement) {
      this.tileAnalyzer = new TileAnalyzer(canvas);
      this.tileRegistry = new TileTypeRegistry();
      this.registerKnownTileTypes();
    }

    private registerKnownTileTypes(): void {

    }
}