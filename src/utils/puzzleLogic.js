// Shuffle array using Fisher-Yates algorithm and update positions
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  
  // Update positions based on new array order
  arr.forEach((tile, index) => {
    tile.position = index;
  });
  
  return arr;
};

// Generate puzzle tiles from image with difficulty-based shuffling
export const generatePuzzleTiles = (gridSize, restartCount = 0, levelId = 1) => {
  const totalTiles = gridSize * gridSize;
  const tiles = Array.from({ length: totalTiles - 1 }, (_, i) => ({
    id: i,
    position: i,
    correctPosition: i,
    isEmpty: false,
  }));
  
  // Add empty tile
  tiles.push({
    id: totalTiles - 1,
    position: totalTiles - 1,
    correctPosition: totalTiles - 1,
    isEmpty: true,
  });
  
  let shuffledTiles;
  
  // Apply difficulty-based shuffling based on level and restart count
  if (levelId <= 3) {
    // First 3 levels: always very easy (solvable in ~5 moves)
    shuffledTiles = shuffleWithDifficulty(tiles, 'very_easy');
  } else if (restartCount === 0) {
    // Later levels, first attempt: normal difficulty
    shuffledTiles = shuffle(tiles);
  } else {
    // Later levels, any restart: make it DIFFICULT with lots of shuffling!
    shuffledTiles = shuffleWithDifficulty(tiles, 'hard');
  }
  
  // Ensure puzzle is not solved (rare edge case)
  if (isPuzzleSolved(shuffledTiles)) {
    // If somehow solved, do one more shuffle
    if (levelId <= 3) {
      shuffledTiles = shuffleWithDifficulty(shuffledTiles, 'very_easy');
    } else {
      shuffledTiles = shuffle(shuffledTiles);
    }
  }
  
  return shuffledTiles;
};

// Shuffle with specific difficulty levels
const shuffleWithDifficulty = (tiles, difficulty) => {
  const arr = [...tiles];
  const totalTiles = arr.length;
  const gridSize = Math.sqrt(totalTiles);
  
  if (difficulty === 'very_easy') {
    // Very Easy: Extremely minimal shuffling - solvable in ~5 moves
    let shuffleCount = 3; // Fixed 3 moves from solved state
    for (let i = 0; i < shuffleCount; i++) {
      const emptyTileIndex = arr.findIndex(tile => tile.isEmpty);
      const emptyTile = arr[emptyTileIndex];
      const adjacentPositions = getValidAdjacentPositions(emptyTile.position, gridSize);
      
      if (adjacentPositions.length > 0) {
        const randomPosition = adjacentPositions[Math.floor(Math.random() * adjacentPositions.length)];
        const tileToSwapIndex = arr.findIndex(tile => tile.position === randomPosition);
        
        // Swap positions
        const tempPosition = emptyTile.position;
        arr[emptyTileIndex].position = randomPosition;
        arr[tileToSwapIndex].position = tempPosition;
      }
    }
  } else if (difficulty === 'hard') {
    // Hard: Maximum shuffling - ensure it's solvable but very scrambled
    let shuffleCount = Math.min(100, totalTiles * 3); // Lots of valid moves
    for (let i = 0; i < shuffleCount; i++) {
      const emptyTileIndex = arr.findIndex(tile => tile.isEmpty);
      const emptyTile = arr[emptyTileIndex];
      const adjacentPositions = getValidAdjacentPositions(emptyTile.position, gridSize);
      
      if (adjacentPositions.length > 0) {
        const randomPosition = adjacentPositions[Math.floor(Math.random() * adjacentPositions.length)];
        const tileToSwapIndex = arr.findIndex(tile => tile.position === randomPosition);
        
        // Swap positions
        const tempPosition = emptyTile.position;
        arr[emptyTileIndex].position = randomPosition;
        arr[tileToSwapIndex].position = tempPosition;
      }
    }
  } else if (difficulty === 'easy') {
    // Easy: Minimal shuffling - just a few moves from solved
    let shuffleCount = Math.min(5, Math.floor(totalTiles / 3)); // Very few shuffles
    for (let i = 0; i < shuffleCount; i++) {
      const emptyTileIndex = arr.findIndex(tile => tile.isEmpty);
      const emptyTile = arr[emptyTileIndex];
      const adjacentPositions = getValidAdjacentPositions(emptyTile.position, gridSize);
      
      if (adjacentPositions.length > 0) {
        const randomPosition = adjacentPositions[Math.floor(Math.random() * adjacentPositions.length)];
        const tileToSwapIndex = arr.findIndex(tile => tile.position === randomPosition);
        
        // Swap positions
        const tempPosition = emptyTile.position;
        arr[emptyTileIndex].position = randomPosition;
        arr[tileToSwapIndex].position = tempPosition;
      }
    }
  }
  
  return arr;
};

// Get valid adjacent positions for a given position
const getValidAdjacentPositions = (position, gridSize) => {
  const row = Math.floor(position / gridSize);
  const col = position % gridSize;
  const adjacent = [];

  if (row > 0) adjacent.push(position - gridSize); // up
  if (row < gridSize - 1) adjacent.push(position + gridSize); // down
  if (col > 0) adjacent.push(position - 1); // left
  if (col < gridSize - 1) adjacent.push(position + 1); // right

  return adjacent;
};



// Check if puzzle is solved
export const isPuzzleSolved = (tiles) => {
  return tiles.every((tile) => tile.position === tile.correctPosition);
};

// Swap two tiles
export const swapTiles = (tiles, index1, index2) => {
  const newTiles = [...tiles];
  [newTiles[index1].position, newTiles[index2].position] = [
    newTiles[index2].position,
    newTiles[index1].position,
  ];
  return newTiles;
};

// Get adjacent tiles (for tile puzzle movement)
export const getAdjacentTiles = (position, gridSize) => {
  const row = Math.floor(position / gridSize);
  const col = position % gridSize;
  const adjacent = [];

  if (row > 0) adjacent.push(position - gridSize); // up
  if (row < gridSize - 1) adjacent.push(position + gridSize); // down
  if (col > 0) adjacent.push(position - 1); // left
  if (col < gridSize - 1) adjacent.push(position + 1); // right

  return adjacent;
};

// Minimum moves to solve puzzle (heuristic)
export const calculateMinimumMoves = (gridSize) => {
  return Math.ceil(gridSize * gridSize / 2);
};

// Check if move is valid (only allow sliding into empty space)
export const isValidMove = (fromIndex, toIndex, gridSize, tiles) => {
  const fromTile = tiles[fromIndex];
  const toTile = tiles[toIndex];
  
  // Can only move into empty space
  if (!toTile.isEmpty) return false;
  
  const adjacent = getAdjacentTiles(fromTile.position, gridSize);
  return adjacent.includes(toTile.position);
};

// Debug function to check shuffle effectiveness
export const debugShuffle = (tiles) => {
  const correctPositions = tiles.filter(tile => tile.position === tile.correctPosition).length;
  const totalTiles = tiles.length;
  const shuffledPercentage = ((totalTiles - correctPositions) / totalTiles * 100).toFixed(1);
  
  console.log(`Shuffle Debug: ${correctPositions}/${totalTiles} tiles in correct position (${shuffledPercentage}% shuffled)`);
  
  tiles.forEach((tile, index) => {
    if (tile.position !== tile.correctPosition) {
      console.log(`Tile ${tile.id}: position ${tile.position} (should be ${tile.correctPosition})`);
    }
  });
  
  return { correctPositions, totalTiles, shuffledPercentage };
};
