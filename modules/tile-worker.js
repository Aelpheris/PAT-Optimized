// Worker script (tile-worker.js)

// Handle incoming messages
self.onmessage = function(e) {
  try {
    const { tilesData, keys, tileWidth, tileHeight } = e.data;
    
    // Process tiles to find unique ones
    const result = findUniqueTiles(tilesData, keys);
    
    // Send results back to main thread
    self.postMessage(result);
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};

// Function to find unique tiles
function findUniqueTiles(tilesData, keys) {
  const uniqueTiles = {};
  const originalToUniqueMap = {};
  const uniqueKeys = [];
  
  // For each tile
  for (let i = 0; i < tilesData.length; i++) {
    const currentTile = tilesData[i];
    const currentKey = keys[i];
    let foundMatch = false;
    
    // Compare with existing unique tiles
    for (let j = 0; j < uniqueKeys.length; j++) {
      const uniqueKey = uniqueKeys[j];
      const uniqueTile = uniqueTiles[uniqueKey];
      
      if (tilesAreEqual(currentTile, uniqueTile)) {
        // Found a match, map original to this unique tile
        originalToUniqueMap[currentKey] = uniqueKey;
        foundMatch = true;
        break;
      }
    }
    
    // If no match found, add as a new unique tile
    if (!foundMatch) {
      uniqueKeys.push(currentKey);
      uniqueTiles[currentKey] = currentTile;
      originalToUniqueMap[currentKey] = currentKey;
    }
  }
  
  return {
    uniqueTiles,
    originalToUniqueMap
  };
}

// Function to compare two image data objects
function tilesAreEqual(tileA, tileB) {
  // Quick check for dimensions
  if (tileA.width !== tileB.width || tileA.height !== tileB.height) {
    return false;
  }
  
  const dataA = tileA.data;
  const dataB = tileB.data;
  
  // Check all pixel data
  // Can add tolerance for near-matches if needed
  for (let i = 0; i < dataA.length; i += 4) {
    // Compare RGBA values
    if (Math.abs(dataA[i] - dataB[i]) > 5 ||           // R
        Math.abs(dataA[i+1] - dataB[i+1]) > 5 ||       // G
        Math.abs(dataA[i+2] - dataB[i+2]) > 5 ||       // B
        Math.abs(dataA[i+3] - dataB[i+3]) > 5) {       // A
      return false;
    }
  }
  
  return true;
}

// More efficient hash-based comparison (optional)
function calculateTileHash(tileData) {
  // Simple hash function - can be improved for better uniqueness
  let hash = 0;
  const data = tileData.data;
  
  // Sample pixels at regular intervals for efficiency
  // Adjust sampling rate based on your needs
  const samplingRate = Math.max(1, Math.floor(data.length / 1000));
  
  for (let i = 0; i < data.length; i += samplingRate * 4) {
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];
    const a = data[i+3];
    
    // Combine values into hash
    hash = ((hash << 5) - hash) + r;
    hash = ((hash << 5) - hash) + g;
    hash = ((hash << 5) - hash) + b;
    hash = ((hash << 5) - hash) + a;
    hash |= 0; // Convert to 32-bit integer
  }
  
  return hash;
}