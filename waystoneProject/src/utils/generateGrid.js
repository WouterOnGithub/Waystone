export function generateGrid(cellsData, width, height) {
  const grid = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const key = `${x}_${y}`;
      row.push(cellsData[key] || null); // null if empty
    }
    grid.push(row);
  }
  return grid;
}