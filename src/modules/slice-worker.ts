// Handle incoming messages
self.onmessage = function(e) {
  try {
    const { imageData, canvasWidth, canvasHeight, tileWidth, tileHeight } = e.data;
    
    // Slice the canvas into tiles
    const tiles = sliceImageData(imageData, canvasWidth, canvasHeight, tileWidth, tileHeight);
    
    // Send results back to main thread
    self.postMessage({ tiles });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};

// Function to slice image data into tiles
function sliceImageData(imageData, canvasWidth, canvasHeight, tileWidth, tileHeight) {
  const tiles = [];
  const numTilesX = Math.ceil(canvasWidth / tileWidth);
  const numTilesY = Math.ceil(canvasHeight / tileHeight);
  
  for (let y = 0; y < numTilesY; y++) {
    for (let x = 0; x < numTilesX; x++) {
      // Calculate actual width and height (handle edge cases)
      const actualWidth = Math.min(tileWidth, canvasWidth - x * tileWidth);
      const actualHeight = Math.min(tileHeight, canvasHeight - y * tileHeight);
      
      // Create new typed array for this tile
      const tileData = new Uint8ClampedArray(actualWidth * actualHeight * 4);
      
      // Copy pixel data from the source image data
      for (let tY = 0; tY < actualHeight; tY++) {
        for (let tX = 0; tX < actualWidth; tX++) {
          // Calculate source and destination indices
          const srcIdx = ((y * tileHeight + tY) * canvasWidth + (x * tileWidth + tX)) * 4;
          const dstIdx = (tY * actualWidth + tX) * 4;
          
          // Copy RGBA values
          tileData[dstIdx] = imageData.data[srcIdx];         // R
          tileData[dstIdx + 1] = imageData.data[srcIdx + 1]; // G
          tileData[dstIdx + 2] = imageData.data[srcIdx + 2]; // B
          tileData[dstIdx + 3] = imageData.data[srcIdx + 3]; // A
        }
      }

      // Add to tiles array
      tiles.push({
        key: `${x},${y}`,
        width: actualWidth,
        height: actualHeight,
        x: x,
        y: y,
        data: tileData.buffer  // Send the ArrayBuffer for transfer
      });
    }
  }
  
  return tiles;
}