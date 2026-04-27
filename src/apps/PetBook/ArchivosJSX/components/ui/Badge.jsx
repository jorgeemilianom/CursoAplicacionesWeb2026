function Badge({ children, tone = 'neutral', tipo, texto }) {
  const resolvedTone = tipo || tone
  const content = texto || children

  return <span className={`petbook-badge petbook-badge--${resolvedTone}`}>{content}</span>
}

export default Badge
