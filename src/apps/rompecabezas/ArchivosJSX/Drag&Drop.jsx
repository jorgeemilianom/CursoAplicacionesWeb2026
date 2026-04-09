const PUZZLE_TRANSFER_KEY = 'application/x-rompecabezas-piece'

export function startPieceDrag(event, pieceId, source) {
  const payload = JSON.stringify({ pieceId, source })
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData(PUZZLE_TRANSFER_KEY, payload)
  event.dataTransfer.setData('text/plain', payload)
}

export function readDraggedPiece(event) {
  const raw =
    event.dataTransfer.getData(PUZZLE_TRANSFER_KEY)
    || event.dataTransfer.getData('text/plain')

  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
