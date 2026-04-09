import { useEffect, useState } from 'react'
import {
  countPlaced,
  createBoard,
  createPieces,
  isSolved,
  movePieceToBoard,
  movePieceToTray,
} from '../ArchivosJSX/PuzzleLogica.jsx'

export function usePuzzleGame(selectedDifficulty) {
  const [board, setBoard] = useState(() => createBoard(selectedDifficulty.size))
  const [tray, setTray] = useState(() => createPieces(selectedDifficulty.size))
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isWon, setIsWon] = useState(false)
  const totalPieces = selectedDifficulty.size * selectedDifficulty.size
  const placedCount = countPlaced(board)

  const resetGame = (nextDifficulty = selectedDifficulty) => {
    setBoard(createBoard(nextDifficulty.size))
    setTray(createPieces(nextDifficulty.size))
    setMoves(0)
    setSeconds(0)
    setIsRunning(false)
    setIsWon(false)
  }

  useEffect(() => resetGame(selectedDifficulty), [selectedDifficulty.size])

  useEffect(() => {
    if (!isSolved(board) || tray.length > 0) return
    setIsRunning(false)
    setIsWon(true)
  }, [board, tray.length])

  const handleBoardDrop = ({ pieceId, source }, targetSlot) => {
    const nextState = movePieceToBoard({ board, tray, pieceId, targetSlot, source })
    if (nextState.board === board && nextState.tray === tray) return
    setBoard(nextState.board)
    setTray(nextState.tray)
    setMoves((value) => value + 1)
    setIsRunning(true)
  }

  const handleTrayDrop = ({ pieceId, source }) => {
    const nextState = movePieceToTray({ board, tray, pieceId, source })
    if (nextState.board === board && nextState.tray === tray) return
    setBoard(nextState.board)
    setTray(nextState.tray)
    setMoves((value) => value + 1)
  }

  return {
    selectedDifficulty,
    board,
    tray,
    moves,
    seconds,
    isRunning,
    isWon,
    totalPieces,
    placedCount,
    handleBoardDrop,
    handleTrayDrop,
    resetGame,
    tick: () => setSeconds((value) => value + 1),
  }
}
