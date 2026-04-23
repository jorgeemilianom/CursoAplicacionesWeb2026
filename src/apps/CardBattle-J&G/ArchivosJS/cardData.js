/**
 * cardData.js
 * Base de datos estática de todas las cartas del juego Card Battle.
 * Cada carta tiene propiedades de combate y un efecto especial.
 */

export const cardData = [
  // ==================== COMUNES (4 cartas) ====================
  {
    id: 'guardian_shield',
    name: 'Escudo del Guardián',
    attack: 1,
    defense: 4,
    effectType: 'shield',
    effectValue: 3,
    description: 'Gana 3 puntos de escudo. Reduce el daño del próximo ataque.',
    rarity: 'common'
  },
  {
    id: 'apprentice_heal',
    name: 'Poción del Aprendiz',
    attack: 1,
    defense: 1,
    effectType: 'heal',
    effectValue: 2,
    description: 'Recupera 2 puntos de vida.',
    rarity: 'common'
  },
  {
    id: 'swift_arrow',
    name: 'Flecha Veloz',
    attack: 3,
    defense: 1,
    effectType: 'damage',
    effectValue: 2,
    description: 'Inflige 2 puntos de daño adicional al oponente.',
    rarity: 'common'
  },
  {
    id: 'scroll_wisdom',
    name: 'Pergamino de Sabiduría',
    attack: 0,
    defense: 2,
    effectType: 'draw',
    effectValue: 1,
    description: 'Roba 1 carta del mazo.',
    rarity: 'common'
  },

  // ==================== RARAS (5 cartas) ====================
  {
    id: 'paladin_hammer',
    name: 'Martillo del Paladín',
    attack: 4,
    defense: 3,
    effectType: 'damage',
    effectValue: 3,
    description: 'Un golpe devastador que inflige 3 puntos de daño adicional.',
    rarity: 'rare'
  },
  {
    id: 'forest_blessing',
    name: 'Bendición del Bosque',
    attack: 2,
    defense: 2,
    effectType: 'heal',
    effectValue: 4,
    description: 'La naturaleza cura 4 puntos de vida.',
    rarity: 'rare'
  },
  {
    id: 'crystal_barrier',
    name: 'Barrera de Cristal',
    attack: 0,
    defense: 5,
    effectType: 'shield',
    effectValue: 5,
    description: 'Una barrera mágica que absorbe 5 puntos de daño.',
    rarity: 'rare'
  },
  {
    id: 'arcane_tome',
    name: 'Tomo Arcano',
    attack: 2,
    defense: 3,
    effectType: 'draw',
    effectValue: 2,
    description: 'Conocimiento antiguo que permite robar 2 cartas.',
    rarity: 'rare'
  },
  {
    id: 'shadow_dagger',
    name: 'Daga de las Sombras',
    attack: 5,
    defense: 1,
    effectType: 'damage',
    effectValue: 2,
    description: 'Ataque sigiloso que inflige 2 puntos de daño extra.',
    rarity: 'rare'
  },

  // ==================== LEGENDARIAS (3 cartas) ====================
  {
    id: 'excalibur',
    name: 'Excalibur',
    attack: 8,
    defense: 5,
    effectType: 'damage',
    effectValue: 6,
    description: 'La espada legendaria del rey Arturo. Inflige 6 puntos de daño devastador.',
    rarity: 'legendary'
  },
  {
    id: 'elysium_chalice',
    name: 'Cáliz de Elíseo',
    attack: 3,
    defense: 4,
    effectType: 'heal',
    effectValue: 8,
    description: 'El cáliz bendito. Restaura 8 puntos de vida al portador.',
    rarity: 'legendary'
  },
  {
    id: 'aegis_of_eternity',
    name: 'Égida de la Eternidad',
    attack: 2,
    defense: 10,
    effectType: 'shield',
    effectValue: 10,
    description: 'El escudo de los dioses. Absorbe 10 puntos de daño y protege completamente.',
    rarity: 'legendary'
  },
  {
  id: 'dragon_rojo',
  name: 'Dragón Rojo',
  attack: 6,
  defense: 4,
  effectType: 'damage',
  effectValue: 3,
  description: 'Escupe fuego devastador.',
  rarity: 'rare',
  tipo: 'fuego',
  image: '/cards/dragon_rojo.png'
},
  {
  id: 'cocodrilo_bebe',
  name: 'Cocodrilo Bebé',
  attack: 3,
  defense: 5,
  effectType: 'shield',
  effectValue: 2,
  description: 'Resiste ataques con su piel dura.',
  rarity: 'common',
  tipo: 'agua',
  image: '/cards/cocodrilo_bebe.png'
},

{
  id: 'ballena_blanca',
  name: 'Ballena Blanca',
  attack: 5,
  defense: 6,
  effectType: 'heal',
  effectValue: 3,
  description: 'Cura con su energía marina.',
  rarity: 'rare',
  tipo: 'agua',
  image: '/cards/ballena_blanca.png'
},

{
  id: 'orca',
  name: 'Orca Guerrera',
  attack: 6,
  defense: 5,
  effectType: 'damage',
  effectValue: 2,
  description: 'Ataca con fuerza en el océano.',
  rarity: 'rare',
  tipo: 'agua',
  image: '/cards/orca.png'
},

{
  id: 'tortuga',
  name: 'Tortuga Ancestral',
  attack: 2,
  defense: 8,
  effectType: 'shield',
  effectValue: 4,
  description: 'Gran defensa impenetrable.',
  rarity: 'common',
  tipo: 'tierra',
  image: '/cards/tortuga.png'
},

{
  id: 'ave',
  name: 'Ave Voladora',
  attack: 4,
  defense: 2,
  effectType: 'damage',
  effectValue: 2,
  description: 'Ataque rápido desde el cielo.',
  rarity: 'common',
  tipo: 'aire',
  image: '/cards/ave.png'
},

{
  id: 'arquero',
  name: 'Arquero',
  attack: 5,
  defense: 3,
  effectType: 'damage',
  effectValue: 2,
  description: 'Dispara flechas precisas.',
  rarity: 'common',
  tipo: 'aire',
  image: '/cards/arquero_comun.png'
},

{
  id: 'espadachin',
  name: 'Espadachín',
  attack: 6,
  defense: 4,
  effectType: 'damage',
  effectValue: 1,
  description: 'Experto en combate cercano.',
  rarity: 'common',
  tipo: 'tierra',
  image: '/cards/espadachin.png'
},

{
  id: 'lancero',
  name: 'Lancero',
  attack: 5,
  defense: 5,
  effectType: 'damage',
  effectValue: 2,
  description: 'Ataca desde distancia media.',
  rarity: 'common',
  tipo: 'tierra',
  image: '/cards/lancero.png'
},

{
  id: 'elefante',
  name: 'Elefante de Guerra',
  attack: 7,
  defense: 7,
  effectType: 'damage',
  effectValue: 3,
  description: 'Carga devastadora.',
  rarity: 'legendary',
  tipo: 'tierra',
  image: '/cards/elefante.png'
},

{
  id: 'pirata',
  name: 'Pirata',
  attack: 5,
  defense: 4,
  effectType: 'draw',
  effectValue: 1,
  description: 'Roba recursos del enemigo.',
  rarity: 'common',
  tipo: 'agua',
  image: '/cards/pirata.png'
},

{
  id: 'pirata_doble',
  name: 'Pirata Doble Espada',
  attack: 7,
  defense: 3,
  effectType: 'damage',
  effectValue: 3,
  description: 'Ataques rápidos y agresivos.',
  rarity: 'rare',
  tipo: 'agua',
  image: '/cards/pirata_espadas.png'
},

{
  id: 'pirata_canon',
  name: 'Pirata Cañonero',
  attack: 8,
  defense: 2,
  effectType: 'damage',
  effectValue: 4,
  description: 'Dispara cañones devastadores.',
  rarity: 'rare',
  tipo: 'agua',
  image: '/cards/pirata_boom.png'
},

{
  id: 'chancla',
  name: 'Chancla de Mamá',
  attack: 10,
  defense: 1,
  effectType: 'damage',
  effectValue: 5,
  description: 'Ataque crítico inevitable.',
  rarity: 'legendary',
  tipo: 'vacio',
  image: '/cards/chancla.png'
},

]

/**
 * Función auxiliar para obtener cartas por rareza
 * @param {string} rarity - 'common' | 'rare' | 'legendary'
 * @returns {Array} Cartas filtradas por rareza
 */
export const getCardsByRarity = (rarity) => {
  return cardData.filter(card => card.rarity === rarity)
}

  

/**
 * Función auxiliar para obtener una carta por ID
 * @param {string} id - ID de la carta
 * @returns {Object|undefined} La carta encontrada o undefined
 */
export const getCardById = (id) => {
  return cardData.find(card => card.id === id)
}

/**
 * Función para barajar un array (algoritmo Fisher-Yates)
 * @param {Array} array - Array a barajar
 * @returns {Array} Nuevo array barajado
 */
export const shuffleDeck = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}