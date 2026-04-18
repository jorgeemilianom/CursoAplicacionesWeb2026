import './HUD.css'

function OpponentThinking({ visible }) {
  if (!visible) return null

  return (
    <div className="opponent-thinking" aria-live="polite" aria-atomic="true">
      <div className="opponent-thinking__dialog">
        <span className="opponent-thinking__eyebrow">Turno del rival</span>
        <h3 className="opponent-thinking__title">El oponente esta eligiendo su carta</h3>
        <div className="opponent-thinking__dots" aria-hidden="true">
          <span className="opponent-thinking__dot" />
          <span className="opponent-thinking__dot" />
          <span className="opponent-thinking__dot" />
        </div>
      </div>
    </div>
  )
}

export default OpponentThinking
