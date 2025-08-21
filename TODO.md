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
- [x] Save tile image data to disk
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

# API
- [x] Upload a single png image to the backend
- [x] Upload multiple png images to the backend in a single POST request
- [ ] A GET request to retreive all tile images from backend
- [ ] A GET request to retreive a single tile image from backend 

# QoL Improvements
- [x] Disable tile download button until tile is selected
- [x] Change side nav to CSS grid structure
- [x] change frontend structure to JS modules for better file organization and structure
- [x] Switch from JavaScript to TypeSript for easier typing with tiles and logic
- [x] Convert main class to TS class in app.ts to handle global state
- [ ] Add and set up basic Prettier configuration to handle code formatting

# Functionality
- [x] Highlight all known/matched tiles after initial processing
