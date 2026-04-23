# 4 Imagenes 1 Palabra

Juego web desarrollado con React + Vite en el que el usuario debe adivinar una palabra a partir de una imagen antes de que se termine el tiempo.

## Caracteristicas

- Flujo de juego por niveles con palabras y tiempos definidos.
- Temporizador por nivel con barra de progreso visual.
- Validacion de respuesta en tiempo real.
- Pantalla de acierto con celebracion y sonido de victoria.
- Pantalla de fin de juego (ganaste o tiempo agotado) con opcion de reiniciar.
- Diseno adaptado a formato de pagina para integracion en una SPA.
- Componentes separados para una mejor mantenibilidad (`App`, `PantallaInicio`, `TableroJuego`).

## Accesibilidad (ARIA)

Este proyecto incluye practicas de accesibilidad para mejorar la experiencia con lector de pantalla y navegacion por teclado:

- Uso de etiquetas ARIA (`aria-label`, `aria-live`, `aria-invalid`, `aria-describedby`).
- Regiones semanticas con `role="region"` y estados importantes con `role="alert"` / `role="status"`.
- Manejo de foco automatico en inicio y cambio de nivel.
- Mensajes de error compatibles con asistencia tecnologica.
- Estilos de foco visibles en botones e inputs.

## Tecnologias

- React
- Vite
- JavaScript (JSX)
- CSS

## Estructura principal

- `src/App.jsx`: flujo principal del juego y estados globales.
- `src/PantallaInicio.jsx`: pantalla inicial.
- `src/TableroJuego.jsx`: UI del nivel en curso.
- `src/App.css`: estilos del juego.

## Requisitos

- Node.js 18+ (recomendado)
- npm

## Instalacion y ejecucion

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev      # entorno de desarrollo
npm run build    # build de produccion
npm run preview  # previsualizar build
npm run lint     # analizar codigo con ESLint
```
