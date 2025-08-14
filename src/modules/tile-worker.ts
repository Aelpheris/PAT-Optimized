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

async function sha256Hash(data: Uint8ClampedArray<ArrayBuffer>): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data.buffer) // Use data.buffer
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}