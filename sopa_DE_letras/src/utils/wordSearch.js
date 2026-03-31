const SIZE = 16;
const MAX_ATTEMPTS = 100;

const directions = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
  { dx: 1, dy: 1 },
  { dx: -1, dy: -1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: 1 },
];

function createEmptyGrid() {
  return Array.from({ length: SIZE }, () =>
    Array(SIZE).fill("")
  );
}

function canPlace(grid, word, x, y, dx, dy) {
  for (let i = 0; i < word.length; i++) {
    const nx = x + dx * i;
    const ny = y + dy * i;

    if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE) return false;

    if (grid[ny][nx] !== "" && grid[ny][nx] !== word[i]) return false;
  }
  return true;
}

function placeWord(grid, word) {
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const x = Math.floor(Math.random() * SIZE);
    const y = Math.floor(Math.random() * SIZE);

    if (canPlace(grid, word, x, y, dir.dx, dir.dy)) {
      for (let i = 0; i < word.length; i++) {
        grid[y + dir.dy * i][x + dir.dx * i] = word[i];
      }
      return true;
    }

    attempts++;
  }

  console.warn(`❌ No se pudo colocar: ${word}`);
  return false;
}

function fillGrid(grid) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (grid[y][x] === "") {
        grid[y][x] =
          letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

export function generateGrid(words) {
  const grid = createEmptyGrid();

  // 🔥 ORDENAR: palabras largas primero
  const sortedWords = [...words].sort(
    (a, b) => b.length - a.length
  );

  sortedWords.forEach((word) => {
    placeWord(grid, word);
  });

  fillGrid(grid);

  return grid;
}