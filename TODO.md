# UI
- [x] Add info box to display tile attributes
- [x] Add highlighting over selected single tile
- [x] Add ability to drag and select multiple tiles at once
- [ ] Add global state to manage highlighting and grid line elements drawn over map canvas
- [x] Add grid lines drawn as the border between tiles, with a toggle button

# Tiles
- [ ] Detect home settlement
- [ ] Calculate distance a tile is from home settlement
- [ ] Calculate gold expenditure restoring a gray tile
- [ ] Show radius of buildings for foundries, fishing boats, sensor towers, etc.
- [x] Download tile images directly to disk
- [ ] Save tile image data to disk
- [x] Match two tiles if they are identical
- [x] Match all tiles against each other and return total number of tiles
- [ ] Tile matching based on type
  - [ ] Home settlement
    - [ ] Megacity
    - [ ] Normal settlement
  - [ ] Settlements
  - [ ] Unexplored (black)
  - [ ] Unexplored (gray)
  - [ ] Plains
  - [ ] Lvl 3 forest
  - [ ] Mountains
  - [ ] Hills
  - [ ] 

# QoL Improvements
- [x] Disable tile download button until tile is selected
- [x] Change side nav to CSS grid structure
- [x] change frontend structure to JS modules for better file organization and structure
- [x] Switch from JavaScript to TypeSript for easier typing with tiles and logic
- [ ] Define 3 coordinate types in TS for Pixel, Tile, and DistanceFromMainSettlement
- [ ] Convert main class to TS class in app.ts to handle global state
- [ ] Convert tile.ts to Typsecript classes and types

# Functionality
- [ ] Highlight all known/matched tiles after initial processing
