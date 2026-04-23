# Scape-Room

Miniapp desarrollada para la materia como practica de trabajo colaborativo con ramas, commits y futura integracion por Pull Request.

## Ruta

- `/apps/scape-room`

## Objetivo de la app

Construir un juego tipo escape room dividido en 3 niveles. Cada nivel presenta una habitacion distinta, objetos interactivos y una secuencia de pistas que el jugador debe resolver para avanzar.

## Estado actual de esta rama

### Nivel 1

- Integrado en el indice general de apps.
- Habitacion principal con hotspots ocultos.
- Sistema de inventario para manija, llave y perilla.
- Secuencia de uso de objetos para abrir heladera, maletin y caja fuerte.
- Caja fuerte con combinacion `2145`.
- Sonidos de recogida, error y apertura.
- Transicion visual al nivel 2.

### Nivel 2

- Habitacion principal implementada con nuevas zonas interactivas.
- Inventario propio del nivel 2.
- Flujo de objetos: destapador -> papel -> tenaza -> libro.
- Interacciones clave con drag and drop real:
  - destapador -> botella
  - tenaza -> candado
  - libro -> estante
- Cofre con teclado numerico y clave `1212`.
- Boton para reiniciar solo el nivel 2.
- Transicion al nivel 3 con cartel de "Proximamente".

### Nivel 3

- Vista previa visual integrada.
- Logica completa pendiente de desarrollo.

## Archivos principales

- `src/apps/scape-room/ScapeRoom.jsx`
- `src/apps/scape-room/ScapeRoom.css`
- `src/App.jsx`
- `src/pages/AppsIndex.jsx`

## Recursos graficos usados

Las imagenes del juego estan almacenadas en:

- `src/apps/scape-room/ImgScapeRoom/`
- `src/apps/scape-room/ImgScapeRoom/Nivel 2/`

## Como probar la app

1. Ejecutar el proyecto con `npm run dev`
2. Abrir `http://localhost:5173/apps/scape-room`
3. Resolver el nivel 1 para desbloquear el nivel 2
4. Probar el flujo del inventario y el drag and drop del nivel 2

## Notas para revision

- La app fue desarrollada por etapas dentro de la rama `feature/scape-room`.
- Se priorizo una experiencia tipo juego con hotspots invisibles, inventario lateral, overlays y feedback sonoro.
- Todavia quedan ajustes finos de posicionamiento visual y el desarrollo completo del nivel 3.
