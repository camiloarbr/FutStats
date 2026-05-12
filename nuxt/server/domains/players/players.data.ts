// 1. External imports

// 2. Internal imports
import type { Player } from '../../../shared/domains/players/player.types'

export const players = [
  {
    id: 1,
    slug: 'lionel-messi',
    nombre: 'Lionel Messi',
    equipo: 'Inter Miami',
    posicion: 'Delantero',
    goles: 28,
    asistencias: 18,
    partidosJugados: 34,
    descripcion:
      'Lider creativo con alta participacion en goles, lectura entre lineas y remate desde media distancia.',
  },
  {
    id: 2,
    slug: 'erling-haaland',
    nombre: 'Erling Haaland',
    equipo: 'Manchester City',
    posicion: 'Delantero centro',
    goles: 36,
    asistencias: 7,
    partidosJugados: 39,
    descripcion:
      'Finalizador de elite que domina el area, ataca espacios cortos y convierte volumen alto de ocasiones.',
  },
  {
    id: 3,
    slug: 'kylian-mbappe',
    nombre: 'Kylian Mbappe',
    equipo: 'Real Madrid',
    posicion: 'Extremo izquierdo',
    goles: 31,
    asistencias: 11,
    partidosJugados: 41,
    descripcion:
      'Atacante vertical con aceleracion sostenida, diagonales agresivas y peso decisivo en transiciones.',
  },
  {
    id: 4,
    slug: 'vinicius-junior',
    nombre: 'Vinicius Junior',
    equipo: 'Real Madrid',
    posicion: 'Extremo izquierdo',
    goles: 22,
    asistencias: 14,
    partidosJugados: 37,
    descripcion:
      'Desequilibrante por banda, genera ventajas en uno contra uno y aumenta el volumen ofensivo del equipo.',
  },
  {
    id: 5,
    slug: 'jude-bellingham',
    nombre: 'Jude Bellingham',
    equipo: 'Real Madrid',
    posicion: 'Mediocampista',
    goles: 19,
    asistencias: 13,
    partidosJugados: 40,
    descripcion:
      'Mediocampista total con llegada al area, recuperacion alta y capacidad para activar la presion.',
  },
  {
    id: 6,
    slug: 'kevin-de-bruyne',
    nombre: 'Kevin De Bruyne',
    equipo: 'Manchester City',
    posicion: 'Mediocampista ofensivo',
    goles: 10,
    asistencias: 22,
    partidosJugados: 32,
    descripcion:
      'Constructor principal de juego, especialista en pases filtrados y cambios de ritmo cerca del area.',
  },
] satisfies readonly Player[]
