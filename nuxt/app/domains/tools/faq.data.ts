export interface FaqItem {
  answer: string
  id: number
  question: string
}

export const faqItems = [
  {
    answer:
      'El blog se prerenderiza como SSG porque sus articulos estan quemados en codigo y no dependen de peticiones dinamicas.',
    id: 1,
    question: 'Por que el blog usa SSG?',
  },
  {
    answer:
      'La seccion players usa SSR porque la vista consulta datos desde la capa server de Nuxt antes de entregar la pagina.',
    id: 2,
    question: 'Por que players usa SSR?',
  },
  {
    answer:
      'Las herramientas usan CSR porque la calculadora y el FAQ son interacciones simples que pueden resolverse en el navegador.',
    id: 3,
    question: 'Por que tools usa CSR?',
  },
] satisfies readonly FaqItem[]
