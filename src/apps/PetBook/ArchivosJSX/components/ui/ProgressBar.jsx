function ProgressBar({ value = 0, valor, color, etiqueta }) {
  const progress = Math.max(0, Math.min(100, valor ?? value))

  return (
    <div className="petbook-progress">
      <span style={{ width: `${progress}%`, background: color }} />
      <strong>{etiqueta || `${progress}%`}</strong>
    </div>
  )
}

export default ProgressBar
