import { Link } from 'react-router-dom'
import './CardBattleJG.css'

function CardBattleJG() {
  return (
    <div className="app-wrapper card-battle">
      <div className="card-battle__container">
        <Link to="/apps" className="app-volver">← Volver a aplicaciones</Link>

        <header className="app-header">
          <span className="app-modulo">Modulo 06</span>
          <h1>CardBattle-J&amp;G</h1>
          <p>
            Esta ruta ya esta lista dentro del proyecto. La estructura base quedo preparada
            para que despues podamos sumar la logica, cartas, reglas y pantalla de juego.
          </p>
        </header>

        <section className="card-battle__placeholder">
          <h2>Proximamente</h2>
          <p>
            Aca va a vivir la experiencia principal de <strong>CardBattle-J&amp;G</strong>.
            Por ahora dejamos la navegacion conectada y una base visual simple.
          </p>
        </section>

        <section className="app-conceptos">
          <h2>Base preparada</h2>
          <ul>
            <li>
              <span className="tag-neutro">Ruta</span>
              <span>La app ya responde en <code>/apps/CardBattle-J&amp;G</code>.</span>
            </li>
            <li>
              <span className="tag-neutro">Placeholder</span>
              <span>Hay una pantalla inicial lista para reemplazar cuando armemos el juego.</span>
            </li>
            <li>
              <span className="tag-neutro">Navegacion</span>
              <span>Incluye acceso de vuelta al indice general de aplicaciones.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default CardBattleJG
