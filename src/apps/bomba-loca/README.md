# Bomba Loca

Juego web hecho con **React + Vite** donde una bomba va pasando entre jugadores y tenés que evitar quedarte con ella cuando explota.

## Descripcion

En cada ronda participan 8 jugadores (vos + 7 bots). La bomba circula en cadena y, cuando te toca, decidis si pasarla a la izquierda o a la derecha. La IA responde segun la dificultad y puede leer patrones de juego para contrarrestarte.

## Funcionalidades principales

- Menu inicial con seleccion de dificultad (`facil`, `medio`, `dificil`)
- Pantalla de ayuda con reglas del juego
- Sistema de rondas con explosion aleatoria por tiempo
- IA de bots con comportamiento dinamico
- Deteccion de patrones del jugador
- Mensajes de aviso por cambios sorpresivos de la IA
- Efectos de sonido (`tick` y `explosion`)
- Reinicio de partida y vuelta al menu
- Interfaz responsive para desktop y mobile

## Como jugar

1. Elegi la dificultad en el menu.
2. Presiona **Jugar**.
3. Cuando la bomba este en tu turno, usa:
   - **Pasar a la izquierda**
   - **Pasar a la derecha**
4. Si la bomba explota en tu turno, perdes la ronda.
5. Al finalizar podes reiniciar o volver al menu.

## Tecnologias

- React
- Vite
- Context API (`GameContext`)
- CSS modular por componente

## Estructura del proyecto

```bash
src/
  App.jsx
  Game.jsx
  Game.css
  GameContext.jsx
  Menu.jsx
  Menu.css
public/
  tick.mp3
  explosion.mp3
```

## Scripts

- `npm run dev`: inicia el servidor de desarrollo
- `npm run build`: genera build de produccion
- `npm run preview`: previsualiza la build
- `npm run lint`: ejecuta ESLint

## Instalacion y ejecucion

```bash
npm install
npm run dev
```

Luego abri la URL local que muestra Vite (por defecto `http://localhost:5173`).

## Proximas mejoras sugeridas

- Puntaje por rondas ganadas
- Modos de juego (rapido/supervivencia)
- Animaciones extra de explosion
- Ranking local con `localStorage`
