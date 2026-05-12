// 1. External imports

// 2. Internal imports
import type { Player } from '../../../shared/domains/players/player.types'

export const players = [
  {
    asistencias: 18,
    descripcion:
      'Lider creativo con alta participacion en goles, lectura entre lineas y remate desde media distancia.',
    equipo: 'Inter Miami',
    goles: 28,
    id: 1,
    nombre: 'Lionel Messi',
    partidosJugados: 34,
    posicion: 'Delantero',
  },
  {
    asistencias: 7,
    descripcion:
      'Finalizador de elite que domina el area, ataca espacios cortos y convierte volumen alto de ocasiones.',
    equipo: 'Manchester City',
    goles: 36,
    id: 2,
    nombre: 'Erling Haaland',
    partidosJugados: 39,
    posicion: 'Delantero centro',
  },
  {
    asistencias: 11,
    descripcion:
      'Atacante vertical con aceleracion sostenida, diagonales agresivas y peso decisivo en transiciones.',
    equipo: 'Real Madrid',
    goles: 31,
    id: 3,
    nombre: 'Kylian Mbappe',
    partidosJugados: 41,
    posicion: 'Extremo izquierdo',
  },
  {
    asistencias: 14,
    descripcion:
      'Desequilibrante por banda, genera ventajas en uno contra uno y aumenta el volumen ofensivo del equipo.',
    equipo: 'Real Madrid',
    goles: 22,
    id: 4,
    nombre: 'Vinicius Junior',
    partidosJugados: 37,
    posicion: 'Extremo izquierdo',
  },
  {
    asistencias: 13,
    descripcion:
      'Mediocampista total con llegada al area, recuperacion alta y capacidad para activar la presion.',
    equipo: 'Real Madrid',
    goles: 19,
    id: 5,
    nombre: 'Jude Bellingham',
    partidosJugados: 40,
    posicion: 'Mediocampista',
  },
  {
    asistencias: 22,
    descripcion:
      'Constructor principal de juego, especialista en pases filtrados y cambios de ritmo cerca del area.',
    equipo: 'Manchester City',
    goles: 10,
    id: 6,
    nombre: 'Kevin De Bruyne',
    partidosJugados: 32,
    posicion: 'Mediocampista ofensivo',
  },
] satisfies readonly Player[]
