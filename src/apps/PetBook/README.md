# 🐾 PetBook - Agenda Digital de Salud para Mascotas

> La aplicación completa para gestionar la salud y bienestar de tus mascotas de forma profesional y organizada.

[![React](https://img.shields.io/badge/React-19.2.4-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0.1-646CFF.svg)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg)](https://vercel.com)

## 📋 Descripción

PetBook es una aplicación web moderna desarrollada con React que revoluciona la gestión de la salud animal. Combina un calendario inteligente, asistente de IA, integración con APIs externas y una interfaz intuitiva para que los dueños de mascotas puedan mantener un seguimiento completo y profesional de la salud de sus compañeros.

### 🎯 Propósito

- **Centralizar** toda la información de salud de mascotas en un solo lugar
- **Automatizar** recordatorios de vacunas, consultas y tratamientos
- **Facilitar** el acceso a veterinarias cercanas y consejos personalizados
- **Proporcionar** asistencia inteligente con IA para consultas sobre salud animal

## ✨ Características Principales

### 🏥 Gestión Completa de Mascotas
- **CRUD completo** de mascotas con información detallada
- **Historial médico** organizado por categorías (vacunas, consultas, tratamientos)
- **Seguimiento de gestación** con línea de tiempo interactiva
- **Registro de partos** y gestión de crías

### 📅 Calendario Inteligente
- **Vista mensual** consolidada de todos los eventos de salud
- **Recordatorios automáticos** configurables por anticipación
- **Alertas inteligentes** que se activan al iniciar la app
- **Filtros** por mascota, tipo de evento y fecha

### 🤖 Asistente IA Avanzado
- **Consultas en español** sobre salud, alimentación y comportamiento
- **Contexto personalizado** basado en datos de la mascota
- **Historial de conversaciones** para seguimiento continuo
- **Recomendaciones seguras** con disclaimer profesional

### 🌤️ Integraciones Externas
- **Clima inteligente** con consejos adaptados a mascotas (OpenWeatherMap)
- **Mapa de veterinarias** cercanas con OpenStreetMap
- **Notificaciones por email** automáticas (EmailJS)
- **APIs de razas** para perros y gatos (The Dog/Cat API)

### 💎 Plan Premium (Próximamente)
- **WhatsApp y SMS** para notificaciones urgentes (Twilio)
- **Google Maps** con Street View para veterinarias
- **Sincronización con Google Calendar** para eventos
- **Asistente IA avanzado** con Claude Opus

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Framework principal
- **React Router** - Navegación SPA
- **Vite** - Build tool y dev server
- **Leaflet + React-Leaflet** - Mapas interactivos
- **Recharts** - Gráficos y visualizaciones
- **Axios** - Cliente HTTP
- **Date-fns** - Manipulación de fechas

### Backend & APIs
- **JSON Server** - API REST mock para desarrollo
- **Anthropic Claude** - IA conversacional
- **OpenWeatherMap** - Datos meteorológicos
- **EmailJS** - Servicio de email
- **OpenStreetMap** - Mapas gratuitos
- **The Dog/Cat API** - Información de razas

### DevOps & Deploy
- **Vercel** - Plataforma de deploy
- **ESLint** - Linting y calidad de código
- **Git** - Control de versiones

## 🏗️ Arquitectura

```
src/
├── apps/PetBook/                 # Aplicación principal
│   ├── ArchivosJS/              # Lógica de negocio
│   │   ├── api/                 # Servicios externos
│   │   ├── hooks/               # Custom hooks
│   │   ├── utils/               # Utilidades
│   │   └── contexts/            # Context API
│   ├── ArchivosJSX/             # Componentes UI
│   │   ├── components/          # Componentes reutilizables
│   │   ├── pages/               # Páginas principales
│   │   └── router/              # Configuración de rutas
│   ├── PetBookAgendaDigital.css # Estilos globales
│   └── PetBookAgendaDigital.jsx # Punto de entrada
├── components/                   # Componentes compartidos
├── pages/                        # Páginas del sitio
└── utils/                        # Utilidades globales
```

### Principios Arquitectónicos

- **Separación de responsabilidades** entre UI y lógica de negocio
- **Custom hooks** para lógica reutilizable
- **Context API** para estado global
- **Componentes modulares** y reutilizables
- **APIs externas** centralizadas en servicios dedicados

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Git

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd CursoAplicacionesWeb2026
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```

   Editar `.env` con tus API keys:
   ```env
   VITE_OPENWEATHER_API_KEY=tu_api_key
   VITE_EMAILJS_SERVICE_ID=tu_service_id
   VITE_EMAILJS_TEMPLATE_ID=tu_template_id
   VITE_EMAILJS_PUBLIC_KEY=tu_public_key
   VITE_ANTHROPIC_API_KEY=tu_api_key
   # ... otras variables
   ```

4. **Iniciar desarrollo completo**
   ```bash
   npm run dev:full
   ```

   Esto inicia:
   - Frontend en `http://localhost:5173`
   - JSON Server en `http://localhost:3001`

### Uso Básico

1. **Registro/Login** - Crear cuenta o iniciar sesión
2. **Agregar mascota** - Registrar primera mascota con datos básicos
3. **Completar historial** - Agregar vacunas, consultas y tratamientos
4. **Configurar alertas** - Activar notificaciones automáticas
5. **Explorar features** - Usar calendario, asistente IA, mapas

## 📦 Deploy

### Vercel (Recomendado)

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel login
   vercel
   ```

3. **Configurar variables de entorno** en Vercel Dashboard

### Variables de Entorno Requeridas

```env
# APIs Activas
VITE_OPENWEATHER_API_KEY=...
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
VITE_ANTHROPIC_API_KEY=...

# APIs Premium (pendiente)
VITE_TWILIO_ACCOUNT_SID=pendiente
VITE_GOOGLE_MAPS_API_KEY=pendiente
VITE_GOOGLE_CALENDAR_CLIENT_ID=pendiente
```

## 🔧 Desarrollo

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Vista previa del build
npm run lint         # Ejecutar ESLint
npm run server       # JSON Server standalone
npm run dev:full     # Frontend + Backend simultáneo
```

### Estructura de Commits

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de estilo
refactor: refactorización de código
test: agregar tests
chore: cambios de configuración
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Guías de Contribución

- Seguir estándares de código con ESLint
- Mantener cobertura de funcionalidades existentes
- Documentar nuevas features
- Usar conventional commits

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Anthropic** por la API de Claude
- **OpenWeatherMap** por datos meteorológicos
- **OpenStreetMap** por mapas gratuitos
- **EmailJS** por servicio de email
- **Vercel** por plataforma de deploy

## 📞 Contacto

**PetBook Team**
- Email: contacto@petbook.app
- Web: [petbook.app](https://petbook.app)
- Demo: [demo.petbook.app](https://demo.petbook.app)

---

⭐ **Si te gusta PetBook, dale una estrella en GitHub!** ⭐

*Desarrollado con ❤️ para amantes de las mascotas*