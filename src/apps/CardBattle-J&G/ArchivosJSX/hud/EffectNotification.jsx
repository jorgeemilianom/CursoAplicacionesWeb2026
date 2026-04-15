import CardEffect from '../card/CardEffect'
import './HUD.css'

/**
 * EffectNotification - Muestra una notificación de efecto activo
 * @param {Object} effect - Efecto activo { card, message }
 */
function EffectNotification({ effect }) {
  if (!effect) return null

  return (
    <div className="effect-notification">
      <CardEffect effect={effect} />
    </div>
  )
}

export default EffectNotification