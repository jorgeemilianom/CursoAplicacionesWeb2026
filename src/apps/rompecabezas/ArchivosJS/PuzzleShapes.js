function invert(edge) {
  if (edge === 'tab') return 'blank'
  if (edge === 'blank') return 'tab'
  return 'flat'
}

export function getPieceEdges(size, index) {
  const row = Math.floor(index / size)
  const column = index % size
  const seed = (row + column) % 2 === 0

  const right = column === size - 1 ? 'flat' : seed ? 'tab' : 'blank'
  const bottom = row === size - 1 ? 'flat' : seed ? 'blank' : 'tab'
  const left = column === 0 ? 'flat' : invert(getPieceEdges(size, index - 1).right)
  const top = row === 0 ? 'flat' : invert(getPieceEdges(size, index - size).bottom)

  return { top, right, bottom, left }
}

function edgePoints(edge, side) {
  const maps = {
    top: {
      flat: ['0% 0%', '100% 0%'],
      tab: ['0% 10%', '32% 10%', '38% 0%', '50% 0%', '62% 0%', '68% 10%', '100% 10%'],
      blank: ['0% 0%', '32% 0%', '38% 10%', '50% 16%', '62% 10%', '68% 0%', '100% 0%'],
    },
    right: {
      flat: ['100% 0%', '100% 100%'],
      tab: ['90% 0%', '90% 32%', '100% 38%', '100% 50%', '100% 62%', '90% 68%', '90% 100%'],
      blank: ['100% 0%', '100% 32%', '90% 38%', '84% 50%', '90% 62%', '100% 68%', '100% 100%'],
    },
    bottom: {
      flat: ['100% 100%', '0% 100%'],
      tab: ['100% 90%', '68% 90%', '62% 100%', '50% 100%', '38% 100%', '32% 90%', '0% 90%'],
      blank: ['100% 100%', '68% 100%', '62% 90%', '50% 84%', '38% 90%', '32% 100%', '0% 100%'],
    },
    left: {
      flat: ['0% 100%', '0% 0%'],
      tab: ['10% 100%', '10% 68%', '0% 62%', '0% 50%', '0% 38%', '10% 32%', '10% 0%'],
      blank: ['0% 100%', '0% 68%', '10% 62%', '16% 50%', '10% 38%', '0% 32%', '0% 0%'],
    },
  }

  return maps[side][edge]
}

export function getPieceClipPath(size, index) {
  const { top, right, bottom, left } = getPieceEdges(size, index)
  return `polygon(${[
    ...edgePoints(top, 'top'),
    ...edgePoints(right, 'right').slice(1),
    ...edgePoints(bottom, 'bottom').slice(1),
    ...edgePoints(left, 'left').slice(1),
  ].join(', ')})`
}

function topSegment(edge) {
  if (edge === 'flat') return 'L 100 0'
  const depth = edge === 'tab' ? -18 : 18
  return `L 35 0 Q 40 ${depth} 50 ${depth} Q 60 ${depth} 65 0 L 100 0`
}

function rightSegment(edge) {
  if (edge === 'flat') return 'L 100 100'
  const depth = edge === 'tab' ? 118 : 82
  return `L 100 35 Q ${depth} 40 ${depth} 50 Q ${depth} 60 100 65 L 100 100`
}

function bottomSegment(edge) {
  if (edge === 'flat') return 'L 0 100'
  const depth = edge === 'tab' ? 118 : 82
  return `L 65 100 Q 60 ${depth} 50 ${depth} Q 40 ${depth} 35 100 L 0 100`
}

function leftSegment(edge) {
  if (edge === 'flat') return 'L 0 0'
  const depth = edge === 'tab' ? -18 : 18
  return `L 0 65 Q ${depth} 60 ${depth} 50 Q ${depth} 40 0 35 L 0 0`
}

export function getPiecePath(size, index) {
  const { top, right, bottom, left } = getPieceEdges(size, index)
  return `M 0 0 ${topSegment(top)} ${rightSegment(right)} ${bottomSegment(bottom)} ${leftSegment(left)} Z`
}
