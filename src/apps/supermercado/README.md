# Supermercado de Colores

Mini juego educativo para ninos en el que deben observar una fruta y arrastrarla a la canasta del color correcto.

## Objetivo

El jugador debe identificar el color de la fruta mostrada en la banda transportadora y soltarla en la canasta correspondiente.

## Que practica esta app

- Interaccion con `drag and drop`
- Manejo de estado con `useState`
- Renderizado condicional
- Uso de componentes reutilizables
- Asociacion visual entre objeto y color

## Estructura

- `JuegoSupermercado.jsx`: controla la logica general del juego
- `BandaTransportadora.jsx`: muestra la fruta actual sobre la banda
- `Producto.jsx`: renderiza la card visual de la fruta
- `Cesta.jsx`: representa cada canasta donde se suelta la fruta
- `Marcador.jsx`: muestra aciertos, meta y pista

## Flujo del juego

1. Se mezcla el orden de las frutas al iniciar la partida.
2. Se muestra una fruta en la banda transportadora.
3. El jugador la arrastra a una canasta.
4. Si acierta, suma un punto y aparece la siguiente fruta.
5. Si completa todas las frutas, se muestra una pantalla final.

## Recursos visuales

Las imagenes del juego estan en la carpeta `ImgSuperColor` del proyecto:

- frutas
- canastas
- banda transportadora
- imagen final del juego

## Idea a futuro

- Agregar sonidos
- Mejorar animaciones
- Incluir mas frutas y colores
- Sumar una dificultad por niveles
