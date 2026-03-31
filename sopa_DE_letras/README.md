🧩 Sopa de Letras Pro

¡Bienvenido! Este es un proyecto de Sopa de Letras Interactiva desarrollado con React y Vite. Está diseñado como una herramienta educativa, permitiendo la integración de imágenes dinámicas (señas de LSA) para reforzar el aprendizaje de forma visual.
🚀 Características

    Bilingüe: Soporte completo para Español e Inglés.

    Modo Oscuro/Claro: Interfaz adaptable para mejor legibilidad.

    Feedback Visual: Sistema de "Festejo" que muestra una imagen (seña o dibujo) al encontrar cada palabra.

    Cronómetro y Progreso: Barra de carga dinámica y tiempo ajustable para el desafío.

    Totalmente Responsivo: Diseñado para usarse en computadoras y dispositivos móviles.

🛠️ Tecnologías Utilizadas

    React 18 (Vite)

    CSS3 (Flexbox y CSS Grid manual, sin frameworks)

    JavaScript (ES6+)

    Linux Mint (Entorno de desarrollo)

📂 Estructura del Proyecto

Para que las imágenes de las palabras se carguen correctamente, deben seguir este esquema:
Plaintext

sopa_DE_letras/
├── public/
│   └── assets/           <-- Aquí van tus archivos .webp
│       ├── SOL.webp      (Nombre en mayúsculas)
│       └── CASA.webp
├── src/
│   ├── components/       (WordForm, WordList, Grid, Timer)
│   ├── utils/            (Lógica de generación de sopa)
│   ├── App.jsx           (Lógica principal)
│   └── App.css           (Estilos globales)

🔧 Instalación y Uso Local

Si querés correr este proyecto en tu máquina (Linux/Windows/Mac):

    Cloná el repositorio:
    Bash

    git clone https://github.com/tu-usuario/nombre-del-repo.git

    Entrá a la carpeta del proyecto:
    Bash

    cd sopa_DE_letras

    Instalá las dependencias:
    Bash

    npm install

    Iniciá el servidor de desarrollo:
    Bash

    npm run dev

    Luego, abrí http://localhost:5173 en tu navegador.