// 1. External imports

// 2. Internal imports
import type { BlogArticle } from './blog.types'

export const blogArticles = [
  {
    category: 'Analisis ofensivo',
    heroStat: '4 indicadores clave',
    publishedAt: '2026-05-11',
    readingMinutes: 4,
    sections: [
      {
        body: 'El rendimiento ofensivo no depende solo del total de goles. Un equipo puede marcar mucho en partidos aislados y aun asi tener problemas para sostener ataques de calidad durante una temporada.',
        heading: 'Mirar produccion, no solo resultado',
      },
      {
        body: 'Cruzar goles, asistencias, partidos jugados y participacion directa ayuda a detectar si la ofensiva esta concentrada en pocos jugadores o si varias lineas contribuyen al marcador.',
        heading: 'Distribucion de responsabilidades',
      },
      {
        body: 'Cuando el dashboard muestra jugadores con alto aporte por partido, el analista puede comparar continuidad, posicion y rol tactico antes de concluir que un equipo ataca bien.',
        heading: 'Contexto para decidir',
      },
    ],
    slug: 'interpretar-rendimiento-ofensivo-equipo',
    summary:
      'Una guia corta para leer goles, asistencias y participacion directa sin quedarse solo con el marcador.',
    title: 'Como interpretar el rendimiento ofensivo de un equipo',
  },
  {
    category: 'Ranking de jugadores',
    heroStat: 'Goles + asistencias',
    publishedAt: '2026-05-11',
    readingMinutes: 3,
    sections: [
      {
        body: 'El goleador que convierte mucho puede no ser el jugador que mas impacto total tiene. Las asistencias, los partidos jugados y la regularidad cambian la lectura del ranking.',
        heading: 'El gol es la puerta de entrada',
      },
      {
        body: 'Comparar participacion directa por partido permite separar volumen bruto de eficiencia. Un jugador con menos goles puede sostener mejor el ataque si tambien crea ocasiones para sus companeros.',
        heading: 'Participacion directa',
      },
      {
        body: 'FutStats puede resaltar a los atacantes que mantienen aporte estable y no solo a quienes lideran una tabla despues de una racha corta.',
        heading: 'Lectura de rendimiento',
      },
    ],
    slug: 'top-goleadores-mas-alla-cantidad-goles',
    summary:
      'El ranking de goleadores mejora cuando se combina con asistencias, minutos y contexto de equipo.',
    title: 'Top goleadores: mas alla de la cantidad de goles',
  },
  {
    category: 'Previo de partido',
    heroStat: 'Checklist de datos',
    publishedAt: '2026-05-11',
    readingMinutes: 5,
    sections: [
      {
        body: 'Antes de analizar un partido conviene revisar forma reciente, jugadores disponibles y produccion ofensiva. Una tabla aislada puede ocultar tendencias recientes importantes.',
        heading: 'Estado del equipo',
      },
      {
        body: 'Los jugadores con alta participacion directa suelen explicar mejor el plan ofensivo. Si uno de ellos falta, el equipo puede necesitar otra ruta para generar peligro.',
        heading: 'Jugadores determinantes',
      },
      {
        body: 'Cruzar estadisticas de ambos equipos ayuda a preparar preguntas mas precisas: quien genera mas, quien concede menos y donde puede aparecer la ventaja tactica.',
        heading: 'Comparacion previa',
      },
    ],
    slug: 'datos-revisar-antes-analizar-partido',
    summary:
      'Un checklist simple para preparar el analisis de un partido con datos de equipos y jugadores.',
    title: 'Que datos revisar antes de analizar un partido',
  },
] satisfies readonly BlogArticle[]
