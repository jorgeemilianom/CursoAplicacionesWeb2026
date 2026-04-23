export const PETBOOK_BASE_PATH = '/apps/gabyapps/petbook-agenda-digital'

export const STORAGE_KEYS = {
  user: 'petbook_user',
  token: 'petbook_token',
  activePetId: 'petbook_active_pet_id',
}

export const ESPECIES = [
  { value: 'perro', label: 'Perro' },
  { value: 'gato', label: 'Gato' },
  { value: 'conejo', label: 'Conejo' },
  { value: 'hamster', label: 'Hamster' },
  { value: 'ave', label: 'Ave' },
  { value: 'otro', label: 'Otro' },
]

export const SEXOS = [
  { value: 'macho', label: 'Macho' },
  { value: 'hembra', label: 'Hembra' },
]

export const LINKS_PRIVADOS = [
  { to: '/mascotas', label: 'Mis mascotas' },
  { to: '/mascotas/nueva', label: 'Nueva mascota' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/calendario', label: 'Calendario' },
  { to: '/veterinarias', label: 'Veterinarias' },
  { to: '/configuracion', label: 'Configuracion' },
]

export const SPECIES_AVATARS = {
  perro: '🐶',
  gato: '🐱',
  conejo: '🐰',
  hamster: '🐹',
  ave: '🐦',
  otro: '🐾',
}

export const FALLBACK_RAZAS = {
  perro: ['Mestizo', 'Labrador', 'Caniche', 'Ovejero Aleman', 'Beagle'],
  gato: ['Mestizo', 'Siames', 'Persa', 'Maine Coon', 'Bengala'],
  conejo: ['Enano', 'Belier', 'Cabeza de leon'],
  hamster: ['Sirio', 'Ruso', 'Roborovski'],
  ave: ['Canario', 'Periquito', 'Cacatua'],
  otro: ['Mi mascota'],
}

export const RECORDATORIO_TIPOS = [
  { value: 'vacuna', label: 'Vacuna' },
  { value: 'desparasitacion', label: 'Desparasitacion' },
  { value: 'bano', label: 'Bano' },
  { value: 'peluqueria', label: 'Peluqueria' },
  { value: 'control', label: 'Control' },
  { value: 'medicacion', label: 'Medicacion' },
  { value: 'otro', label: 'Otro' },
]

export const RECORDATORIO_REPETICIONES = [
  { value: 'no', label: 'No repetir' },
  { value: 'mensual', label: 'Mensual' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'anual', label: 'Anual' },
]

export const EVENT_TYPE_META = {
  vacuna: { label: 'Vacuna', colorClass: 'success', colorHex: '#2f7d52', icon: 'V' },
  desparasitacion: { label: 'Desparasitacion', colorClass: 'warning', colorHex: '#d2872f', icon: 'D' },
  vencido: { label: 'Vencido', colorClass: 'danger', colorHex: '#b0493c', icon: '!' },
  consulta: { label: 'Consulta', colorClass: 'info', colorHex: '#4e89d8', icon: 'C' },
  gestacion: { label: 'Gestacion', colorClass: 'accent', colorHex: '#8b63d8', icon: 'G' },
  recordatorio: { label: 'Recordatorio', colorClass: 'sky', colorHex: '#54b8d8', icon: 'R' },
}

export const ALERT_PRIORITY_ORDER = {
  alta: 0,
  media: 1,
  baja: 2,
}

export const PETBOOK_TIPS = [
  'Lleva un registro del peso cada mes para detectar cambios antes de que se vuelvan un problema.',
  'Las vacunas y desparasitaciones son mas utiles cuando se controlan con fechas futuras, no solo historicas.',
  'Una nota corta sobre apetito, energia o sueno puede ayudar mucho en una consulta veterinaria.',
  'Si tu mascota esta gestando, dividir el seguimiento por semanas vuelve mas claro cada hito importante.',
]
