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
