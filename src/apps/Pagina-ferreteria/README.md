# FERRETRIA EL VIEJO VITE

Landing page desarrollada con React + Vite para una ferreteria conectada a MockAPI.

La app muestra:

- una landing principal con hero visual
- un carrusel conectado al endpoint `Carousel`
- un catalogo de productos conectado al endpoint `Ferreteria`
- un chatbot llamado `Don Bot` para ayudar con consultas simples y agregar productos al carrito

## Tecnologias

- React
- Vite
- CSS
- MockAPI

## Estructura principal

- [src/Pagina.jsx](./src/Pagina.jsx): layout general de la landing, carga de datos y carrito
- [src/Pantalla.css](./src/Pantalla.css): estilos principales de la pantalla
- [src/Carousel.jsx](./src/Carousel.jsx): carrusel visual del hero
- [src/Carousel.css](./src/Carousel.css): estilos del carrusel
- [src/ChatBot.jsx](./src/ChatBot.jsx): logica del chatbot
- [src/ChatBot.css](./src/ChatBot.css): estilos del chatbot

## Endpoints usados

Productos:

```txt
https://69e8dd9b55d62f347979fb23.mockapi.io/Ferreteria/Ferreteria
```

Carrusel:

```txt
https://69e8dd9b55d62f347979fb23.mockapi.io/Ferreteria/Carousel
```

## Funcionalidades

- carga de productos desde API
- carga independiente del carrusel desde API
- tarjetas de productos con precio, descripcion, categoria y stock
- carrito con total acumulado
- chatbot con respuestas basicas
- deteccion de productos por nombre en el chat
- confirmacion para agregar productos al carrito desde el bot
- diseño responsive

## Como ejecutar el proyecto

Instalar dependencias:

```bash
npm install
```

Levantar entorno de desarrollo:

```bash
npm run dev
```

Generar build de produccion:

```bash
npm run build
```

## Notas

- el proyecto adapta los datos recibidos desde MockAPI para mostrarlos en la interfaz
- si el endpoint del carrusel falla, la pagina puede seguir mostrando el catalogo
- el chatbot usa los productos cargados para responder consultas como el mas barato o coincidencias por nombre
