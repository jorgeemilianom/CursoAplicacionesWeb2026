// ─── TABLERO ────────────────────────────────────────────────────────────────
// 40 casilleros en sentido horario, empezando por SALIDA (esquina inferior-izquierda)
// rent: [sin_casa, 1_casa, 2_casas, 3_casas, 4_casas, hotel]

export const BOARD = [
  // ── FILA INFERIOR (izq → der), índices 0-10 ──────────────────────────────
  { id: 0,  type: 'go',        name: 'SALIDA',              side: 'bottom' },
  { id: 1,  type: 'property',  name: 'Sauce Viejo',         color: 'brown',    price: 60,  rent: [2,10,30,90,160,250],   houseCost: 50,  mortgage: 30  },
  { id: 2,  type: 'community', name: 'Comunidad',           side: 'bottom' },
  { id: 3,  type: 'property',  name: 'Santo Tomé',          color: 'brown',    price: 100, rent: [4,20,60,180,320,450],  houseCost: 50,  mortgage: 50  },
  { id: 4,  type: 'tax',       name: 'Impuesto Municipal',  amount: 200 },
  { id: 5,  type: 'railroad',  name: 'Ruta 11',             price: 200, mortgage: 100 },
  { id: 6,  type: 'property',  name: 'Recreo',              color: 'lightblue',price: 100, rent: [6,30,90,270,400,550],  houseCost: 50,  mortgage: 50  },
  { id: 7,  type: 'chance',    name: 'Suerte' },
  { id: 8,  type: 'property',  name: 'Laguna Paiva',        color: 'lightblue',price: 100, rent: [6,30,90,270,400,550],  houseCost: 50,  mortgage: 50  },
  { id: 9,  type: 'property',  name: 'Gálvez',              color: 'lightblue',price: 120, rent: [8,40,100,300,450,600], houseCost: 50,  mortgage: 60  },
  { id: 10, type: 'jail',      name: 'Cárcel / Visita' },

  // ── COLUMNA DERECHA (abajo → arriba), índices 11-19 ──────────────────────
  { id: 11, type: 'property',  name: 'San Justo',           color: 'pink',     price: 140, rent: [10,50,150,450,625,750],  houseCost: 100, mortgage: 70  },
  { id: 12, type: 'utility',   name: 'Puerto de Santa Fe',  price: 150, mortgage: 75 },
  { id: 13, type: 'property',  name: 'San Lorenzo',         color: 'pink',     price: 140, rent: [10,50,150,450,625,750],  houseCost: 100, mortgage: 70  },
  { id: 14, type: 'property',  name: 'Cap. Bermúdez',       color: 'pink',     price: 160, rent: [12,60,180,500,700,900],  houseCost: 100, mortgage: 80  },
  { id: 15, type: 'railroad',  name: 'Ruta 168',            price: 200, mortgage: 100 },
  { id: 16, type: 'property',  name: 'Cañada de Gómez',    color: 'orange',   price: 180, rent: [14,70,200,550,750,950],  houseCost: 100, mortgage: 90  },
  { id: 17, type: 'community', name: 'Comunidad' },
  { id: 18, type: 'property',  name: 'Armstrong',           color: 'orange',   price: 180, rent: [14,70,200,550,750,950],  houseCost: 100, mortgage: 90  },
  { id: 19, type: 'property',  name: 'Rafaela',             color: 'orange',   price: 200, rent: [16,80,220,600,800,1000], houseCost: 100, mortgage: 100 },

  // ── FILA SUPERIOR (izq → der), índices 20-30 ─────────────────────────────
  { id: 20, type: 'parking',   name: 'Estacionamiento Libre' },
  { id: 21, type: 'property',  name: 'Venado Tuerto',       color: 'red',      price: 220, rent: [18,90,250,700,875,1050],  houseCost: 150, mortgage: 110 },
  { id: 22, type: 'chance',    name: 'Suerte' },
  { id: 23, type: 'property',  name: 'Firmat',              color: 'red',      price: 220, rent: [18,90,250,700,875,1050],  houseCost: 150, mortgage: 110 },
  { id: 24, type: 'property',  name: 'Villa Constitución',  color: 'red',      price: 240, rent: [20,100,300,750,925,1100], houseCost: 150, mortgage: 120 },
  { id: 25, type: 'railroad',  name: 'Ruta 19',             price: 200, mortgage: 100 },
  { id: 26, type: 'property',  name: 'Reconquista',         color: 'yellow',   price: 260, rent: [22,110,330,800,975,1150], houseCost: 150, mortgage: 130 },
  { id: 27, type: 'property',  name: 'Avellaneda',          color: 'yellow',   price: 260, rent: [22,110,330,800,975,1150], houseCost: 150, mortgage: 130 },
  { id: 28, type: 'utility',   name: 'Aeropuerto',          price: 150, mortgage: 75 },
  { id: 29, type: 'property',  name: 'Tostado',             color: 'yellow',   price: 280, rent: [24,120,360,850,1025,1200],houseCost: 150, mortgage: 140 },
  { id: 30, type: 'gotojail',  name: 'IR A LA CÁRCEL' },

  // ── COLUMNA IZQUIERDA (arriba → abajo), índices 31-39 ────────────────────
  { id: 31, type: 'property',  name: 'Esperanza',           color: 'green',    price: 300, rent: [26,130,390,900,1100,1275], houseCost: 200, mortgage: 150 },
  { id: 32, type: 'property',  name: 'Roldán',              color: 'green',    price: 300, rent: [26,130,390,900,1100,1275], houseCost: 200, mortgage: 150 },
  { id: 33, type: 'community', name: 'Comunidad' },
  { id: 34, type: 'property',  name: 'Pérez',               color: 'green',    price: 320, rent: [28,150,450,1000,1200,1400],houseCost: 200, mortgage: 160 },
  { id: 35, type: 'railroad',  name: 'Autopista Rosario-SF',price: 200, mortgage: 100 },
  { id: 36, type: 'chance',    name: 'Suerte' },
  { id: 37, type: 'property',  name: 'Santa Fe Capital',    color: 'darkblue', price: 350, rent: [35,175,500,1100,1300,1500],houseCost: 200, mortgage: 175 },
  { id: 38, type: 'tax',       name: 'Impuesto Provincial', amount: 100 },
  { id: 39, type: 'property',  name: 'Rosario',             color: 'darkblue', price: 400, rent: [50,200,600,1400,1700,2000],houseCost: 200, mortgage: 200 },
]

// Propiedades por grupo de color
export const COLOR_GROUPS = {
  brown:    [1, 3],
  lightblue:[6, 8, 9],
  pink:     [11, 13, 14],
  orange:   [16, 18, 19],
  red:      [21, 23, 24],
  yellow:   [26, 27, 29],
  green:    [31, 32, 34],
  darkblue: [37, 39],
}

export const RAILROAD_IDS  = [5, 15, 25, 35]
export const UTILITY_IDS   = [12, 28]

// ─── CARTAS DE SUERTE ────────────────────────────────────────────────────────
export const CHANCE_CARDS = [
  { id: 'c1',  text: '¡Avanzá hasta la Salida! Cobrá $200.',         action: { type: 'moveTo', to: 0, collect: true } },
  { id: 'c2',  text: 'Avanzá hasta Rosario.',                         action: { type: 'moveTo', to: 39 } },
  { id: 'c3',  text: 'Avanzá hasta Santa Fe Capital.',               action: { type: 'moveTo', to: 37 } },
  { id: 'c4',  text: 'Avanzá hasta la Ruta más cercana.',            action: { type: 'nearestRailroad' } },
  { id: 'c5',  text: 'Cobrá dividendos bancarios: $50.',             action: { type: 'gain', amount: 50 } },
  { id: 'c6',  text: 'Guardá esta carta. Salí de la cárcel gratis.', action: { type: 'jailFree' } },
  { id: 'c7',  text: 'Retrocedé 3 casilleros.',                      action: { type: 'moveBack', steps: 3 } },
  { id: 'c8',  text: '¡Andá directo a la cárcel!',                   action: { type: 'goToJail' } },
  { id: 'c9',  text: 'Hacé reparaciones: $25 por casa, $100 por hotel.', action: { type: 'repairs', house: 25, hotel: 100 } },
  { id: 'c10', text: 'Multa de velocidad: pagá $15.',                action: { type: 'pay', amount: 15 } },
  { id: 'c11', text: 'Cobrá $50 de cada jugador.',                   action: { type: 'collectFromAll', amount: 50 } },
  { id: 'c12', text: 'Cobrá premio por segunda plaza: $150.',        action: { type: 'gain', amount: 150 } },
]

// ─── CARTAS DE COMUNIDAD ─────────────────────────────────────────────────────
export const COMMUNITY_CARDS = [
  { id: 'cm1',  text: 'Error bancario a tu favor. Cobrá $200.',       action: { type: 'gain', amount: 200 } },
  { id: 'cm2',  text: 'Pagá gastos médicos: $50.',                    action: { type: 'pay', amount: 50 } },
  { id: 'cm3',  text: 'Cobrá honorarios: $25 de cada jugador.',       action: { type: 'collectFromAll', amount: 25 } },
  { id: 'cm4',  text: 'Guardá esta carta. Salí de la cárcel gratis.', action: { type: 'jailFree' } },
  { id: 'cm5',  text: '¡Andá directo a la cárcel!',                   action: { type: 'goToJail' } },
  { id: 'cm6',  text: 'Herencia recibida: cobrá $100.',               action: { type: 'gain', amount: 100 } },
  { id: 'cm7',  text: 'Pagá cuota del club: $50.',                    action: { type: 'pay', amount: 50 } },
  { id: 'cm8',  text: 'Premio de concurso: cobrá $10.',               action: { type: 'gain', amount: 10 } },
  { id: 'cm9',  text: 'Cobrá alquiler devengado: $45.',               action: { type: 'gain', amount: 45 } },
  { id: 'cm10', text: 'Cobrá intereses sobre valores: $25.',          action: { type: 'gain', amount: 25 } },
  { id: 'cm11', text: 'Pagá al médico: $50.',                         action: { type: 'pay', amount: 50 } },
  { id: 'cm12', text: '¡Avanzá hasta la Salida! Cobrá $200.',         action: { type: 'moveTo', to: 0, collect: true } },
]

export const PLAYER_COLORS = ['#e74c3c','#3498db','#2ecc71','#f39c12']
export const PLAYER_TOKENS  = ['🚗','🎩','🐶','⚓']
export const STARTING_MONEY = 1500
