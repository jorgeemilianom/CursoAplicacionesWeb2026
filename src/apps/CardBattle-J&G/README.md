
## Prompt para Claude Code

```
Necesito refactorizar el layout de BattleField.jsx, PlayerZone.jsx y Battle.css
para lograr que toda la mesa de juego quede integrada en una sola banda horizontal,
sin scroll. El resultado visual debe parecerse al sketch adjunto (imagen 4).

---

CONTEXTO DE ARCHIVOS:
- BattleBoard.jsx: orquesta todo, contiene sidebar + main con PlayerZone × 2 + BattleField
- PlayerZone.jsx: renderiza stats del jugador + slot de carta + mano
- BattleField.jsx: renderiza slot oponente (izq), VS + botón Combatir (centro), slot jugador (der)
- Battle.css: estilos de todos estos componentes

NO modificar la lógica de juego (handlers, contextos, hooks). Solo layout y estilos.

---

CAMBIOS REQUERIDOS:

1. BATTLE-FIELD como banda central única:
   BattleField debe convertirse en una banda horizontal que ocupe todo el ancho
   disponible con 3 columnas: [slot oponente + stats P2] [VS + Combatir] [stats P1 + slot P1]
   
   - Columna izquierda: slot de carta del oponente a la izquierda, stats de Jugador 2
     (nombre + barra de vida + escudo) a la derecha del slot, alineados verticalmente al centro
   - Columna central: texto "VS" arriba, botón "Combatir" abajo (igual que ahora)
   - Columna derecha: stats de Jugador 1 a la izquierda del slot, slot de carta del jugador
     a la derecha, alineados verticalmente al centro

2. TAMAÑO DEL SLOT DE CARTA:
   Reducir el slot de 160×230px a aproximadamente 100×145px para que sea
   visualmente proporcional dentro de la banda sin dominar el espacio.

3. STATS (PlayerStats / HealthBar):
   La barra de vida y el nombre del jugador deben ser más compactos:
   - Fuente del nombre: reducir a ~14px
   - Barra de vida: height de ~8px en lugar del tamaño actual
   - Ancho máximo de la sección de stats: ~260px

4. ELIMINAR las PlayerZone como secciones separadas del battle-board__main.
   Toda la información (stats + slot) queda dentro de BattleField en la banda.
   La mano del jugador (PlayerHand) sigue debajo de la banda, separada.

5. ALINEACIÓN: oponente (izq) y jugador (der) deben estar alineados en el mismo
   eje vertical dentro de la banda. El centro visual de la carta del oponente debe
   coincidir con el centro visual de la carta del jugador.

6. La banda debe tener un fondo diferenciado (como el battle-field actual:
   rgba(9, 18, 36, 0.78)) para que el usuario perciba claramente que es la
   "mesa de juego".

7. FUNCIONALIDAD: no romper ningún handler existente:
   - onSlotClick, onSlotDrop, onCardDragStart deben seguir funcionando igual
   - El botón Combatir (canResolve / onResolve) debe seguir respondiendo igual
   - Los props que recibe BattleField desde BattleBoard no deben cambiar de firma,
     pero pueden recibir props adicionales si se necesitan para mostrar los stats

---

RESTRICCIONES:
- Mantener el patrón BEM de clases CSS existente (card-battle .battle-field__xxx)
- No usar librerías externas de layout
- No modificar GameContext, BattleContext, DeckContext ni useCardGame.js
- La mano del jugador (cards en abanico) sigue renderizándose debajo de la banda
```

