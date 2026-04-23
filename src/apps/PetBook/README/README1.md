# README1 — PetBook: Setup del Proyecto y Arquitectura Base

## 🎯 PROMPT PARA CLAUDE CODE — ETAPA 1

---

Quiero que me ayudes a construir una aplicación React llamada **PetBook**, una agenda digital de salud para dueños de mascotas. Esta es la ETAPA 1: configuración del proyecto y arquitectura base.

---

## 📦 Stack Tecnológico

- **React** con Vite (no Create React App)
- **React Router DOM v6** para navegación
- **Context API** para estado global
- **Custom Hooks** para lógica reutilizable
- **CSS Modules** o **Tailwind CSS** para estilos
- **JSON Server** como API REST simulada (archivo db.json)
- **Axios** para las llamadas HTTP
- **date-fns** para manejo de fechas

Instala todas las dependencias necesarias.

---

## 📁 Estructura de Carpetas

Genera la siguiente estructura de carpetas completa dentro de `/src`:

```
src/
├── api/
│   ├── axiosConfig.js          # instancia base de axios
│   ├── mascotasApi.js          # endpoints de mascotas
│   ├── vacunasApi.js           # endpoints de vacunas
│   ├── gestacionApi.js         # endpoints de gestación
│   └── externalApis.js         # llamadas a APIs externas
│
├── context/
│   ├── UserContext.jsx         # usuario logueado y sus mascotas
│   ├── MascotaContext.jsx      # mascota actualmente seleccionada
│   └── AlertasContext.jsx      # alertas y recordatorios globales
│
├── hooks/
│   ├── useUser.js              # consumir UserContext
│   ├── useMascota.js           # consumir MascotaContext + fetch
│   ├── useVacunas.js           # lógica de vacunas y vencimientos
│   ├── useGestacion.js         # cálculos de gestación y alertas
│   ├── useAlertas.js           # chequeo global de alertas
│   ├── useClima.js             # consumir OpenWeatherMap
│   ├── useRazas.js             # consumir The Dog API / The Cat API
│   └── useVeterinarias.js      # consumir mapa de veterinarias
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Badge.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── Alert.jsx
│   │   └── Loader.jsx
│   └── shared/
│       ├── MascotaCard.jsx
│       └── AlertaBanner.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Registro.jsx
│   ├── Dashboard.jsx
│   ├── MisMascotas.jsx
│   ├── FichaMascota.jsx
│   ├── NuevaMascota.jsx
│   ├── Vacunas.jsx
│   ├── Calendario.jsx
│   ├── Gestacion.jsx
│   ├── DiarioSalud.jsx
│   ├── Veterinarias.jsx
│   ├── AsistenteIA.jsx
│   └── Configuracion.jsx
│
├── router/
│   └── AppRouter.jsx           # todas las rutas de la app
│
├── utils/
│   ├── fechas.js               # helpers con date-fns
│   ├── gestacionUtils.js       # cálculos de semanas y fechas de parto
│   └── constants.js            # constantes globales (especies, razas, etc.)
│
├── assets/
│   └── images/
│
├── App.jsx
└── main.jsx
```

---

## 🗄️ Base de datos simulada (JSON Server)

Crea el archivo `db.json` en la raíz del proyecto con la siguiente estructura:

```json
{
  "usuarios": [
    {
      "id": 1,
      "nombre": "María González",
      "email": "maria@email.com",
      "password": "1234",
      "telefono": "3764000000",
      "ubicacion": "Posadas, Misiones",
      "foto": ""
    }
  ],
  "mascotas": [
    {
      "id": 1,
      "usuarioId": 1,
      "nombre": "Firulais",
      "especie": "perro",
      "raza": "Labrador",
      "sexo": "macho",
      "fechaNacimiento": "2021-03-15",
      "color": "amarillo",
      "peso": 25,
      "foto": "",
      "veterinario": "Dr. Pérez",
      "telefonoVet": "3764111111",
      "microchip": "123456789",
      "esterilizado": false,
      "activo": true
    }
  ],
  "vacunas": [
    {
      "id": 1,
      "mascotaId": 1,
      "nombre": "Antirrábica",
      "fecha": "2024-01-10",
      "proxima": "2025-01-10",
      "veterinario": "Dr. Pérez",
      "lote": "ABC123",
      "notas": ""
    }
  ],
  "desparasitaciones": [
    {
      "id": 1,
      "mascotaId": 1,
      "tipo": "interna",
      "producto": "Milbemax",
      "fecha": "2024-06-01",
      "proxima": "2024-09-01",
      "notas": ""
    }
  ],
  "gestaciones": [
    {
      "id": 1,
      "mascotaId": 1,
      "fechaCruce": "2024-11-01",
      "fechaPartoProbable": "2025-01-03",
      "cantidadCriasEsperadas": 5,
      "veterinarioSeguimiento": "Dr. Pérez",
      "estado": "en_curso",
      "notas": "",
      "crias": []
    }
  ],
  "consultas": [
    {
      "id": 1,
      "mascotaId": 1,
      "fecha": "2024-05-20",
      "motivo": "Control anual",
      "diagnostico": "Saludable",
      "tratamiento": "Ninguno",
      "veterinario": "Dr. Pérez",
      "peso": 24.5,
      "notas": "",
      "costo": 3500
    }
  ],
  "recordatorios": [
    {
      "id": 1,
      "mascotaId": 1,
      "usuarioId": 1,
      "titulo": "Vacuna antirrábica",
      "fecha": "2025-01-10",
      "tipo": "vacuna",
      "notificado": false,
      "notas": ""
    }
  ]
}
```

Configura el script en `package.json` para correr JSON Server:
```json
"server": "json-server --watch db.json --port 3001"
```

---

## 🔗 Contextos a implementar

### UserContext.jsx
```jsx
// Debe manejar:
// - usuario logueado (objeto o null)
// - función login(email, password)
// - función logout()
// - función registrarUsuario(datos)
// - isAuthenticated (booleano)
// Persistir sesión en localStorage
```

### MascotaContext.jsx
```jsx
// Debe manejar:
// - mascotaActiva (objeto o null)
// - lista de mascotas del usuario
// - función seleccionarMascota(id)
// - función agregarMascota(datos)
// - función actualizarMascota(id, datos)
// - función eliminarMascota(id)
```

### AlertasContext.jsx
```jsx
// Debe manejar:
// - lista de alertas activas
// - función agregarAlerta(alerta)
// - función marcarLeida(id)
// - función limpiarAlertas()
// Al iniciar la app, chequear vencimientos de vacunas y gestaciones
```

---

## 🧭 Router (AppRouter.jsx)

Configura React Router con las siguientes rutas:

```
/                    → Home (landing pública)
/login               → Login
/registro            → Registro
/dashboard           → Dashboard (privada)
/mascotas            → MisMascotas (privada)
/mascotas/nueva      → NuevaMascota (privada)
/mascotas/:id        → FichaMascota (privada)
/vacunas/:mascotaId  → Vacunas (privada)
/calendario          → Calendario (privada)
/gestacion/:mascotaId → Gestacion (privada)
/diario/:mascotaId   → DiarioSalud (privada)
/veterinarias        → Veterinarias (privada)
/asistente           → AsistenteIA (privada)
/configuracion       → Configuracion (privada)
*                    → 404 NotFound
```

Crea un componente `PrivateRoute.jsx` que redirija a `/login` si el usuario no está autenticado.

---

## ⚙️ axiosConfig.js

```js
// Crear instancia de axios con:
// baseURL apuntando a JSON Server (http://localhost:3001)
// headers por defecto
// Interceptor para agregar token si existe en localStorage
// Interceptor de respuesta para manejo global de errores
```

---

## ✅ Resultado esperado al final de esta etapa

- Proyecto Vite + React corriendo sin errores
- JSON Server corriendo en puerto 3001 con datos de prueba
- Estructura de carpetas completa creada
- Contextos funcionando (UserContext, MascotaContext, AlertasContext)
- Router configurado con rutas públicas y privadas
- Axios configurado apuntando al JSON Server
- Páginas vacías (placeholder) en cada ruta para confirmar la navegación
- Login básico funcional conectado al JSON Server

---

> ⚠️ IMPORTANTE: No avances a la siguiente etapa hasta que todo lo anterior esté funcionando sin errores en consola.
