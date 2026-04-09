export const IMAGE_SRC = new URL('../ImgRompe/MarioGalaxy.jpg', import.meta.url).href

export const DIFFICULTIES = [
  { id: 'facil', label: 'Facil', size: 3, help: '9 piezas para probar y jugar sin friccion.' },
  { id: 'normal', label: 'Normal', size: 5, help: '25 piezas para un reto moderado.' },
  { id: 'experto', label: 'Experto', size: 10, help: '100 piezas para que Mario Galaxy luzca de verdad.' },
]

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

export function createPieces(size) {
  return shuffle(
    Array.from({ length: size * size }, (_, index) => ({
      id: `piece-${size}-${index}`,
      correctIndex: index,
    })),
  )
}

export function createBoard(size) {
  return Array(size * size).fill(null)
}

export function movePieceToBoard({ board, tray, pieceId, targetSlot, source }) {
  const nextBoard = [...board]
  let nextTray = [...tray]
  let movingPiece = null

  if (source.type === 'tray') {
    movingPiece = nextTray.find((piece) => piece.id === pieceId) ?? null
    nextTray = nextTray.filter((piece) => piece.id !== pieceId)
  }

  if (source.type === 'board') {
    movingPiece = nextBoard[source.slot]
    nextBoard[source.slot] = null
  }

  if (!movingPiece) return { board, tray }

  const displacedPiece = nextBoard[targetSlot]
  nextBoard[targetSlot] = movingPiece

  if (displacedPiece) {
    if (source.type === 'board') nextBoard[source.slot] = displacedPiece
    else nextTray = [...nextTray, displacedPiece]
  }

  return { board: nextBoard, tray: nextTray }
}

export function movePieceToTray({ board, tray, pieceId, source }) {
  if (source.type !== 'board') return { board, tray }

  const nextBoard = [...board]
  const movingPiece = nextBoard[source.slot]
  if (!movingPiece || movingPiece.id !== pieceId) return { board, tray }

  nextBoard[source.slot] = null
  return { board: nextBoard, tray: [...tray, movingPiece] }
}

export function countPlaced(board) {
  return board.filter(Boolean).length
}

export function isSolved(board) {
  return board.every((piece, index) => piece?.correctIndex === index)
}

export function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}
