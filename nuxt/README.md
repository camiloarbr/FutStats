# FutStats Nuxt

Mini version del proyecto FutStats construida con Nuxt. La app separa datos, tipos y vistas por dominio cuando es razonable, mantiene imports ordenados con bloques comentados y evita datos sensibles.

## Rutas y renderizado

| Ruta                 | Modo            | Descripcion                                                              |
| -------------------- | --------------- | ------------------------------------------------------------------------ |
| `/`                  | SSR por defecto | Entrada a la mini version del dashboard.                                 |
| `/players`           | SSR             | Lista jugadores consultando `/api/players` desde la capa server de Nuxt. |
| `/players/[id]`      | SSR             | Detalle de jugador consultando `/api/players/[id]`.                      |
| `/blog`              | SSG             | Lista los tres articulos quemados en codigo.                             |
| `/blog/[slug]`       | SSG             | Muestra el detalle de cada articulo.                                     |
| `/tools`             | CSR             | Ruta principal de herramientas.                                          |
| `/tools/calculadora` | CSR             | Calculadora de participacion directa.                                    |
| `/tools/faq`         | CSR             | Preguntas frecuentes sobre la entrega.                                   |

Los modos se configuran en `nuxt.config.ts` mediante `routeRules`. Las rutas del blog tambien se agregan a `nitro.prerender.routes` para que Nuxt las prerenderice.

## Organizacion principal

- `app/domains/blog`: tipos, datos y repositorio local de articulos.
- `server/domains/players`: datos quemados y repositorio server de jugadores.
- `server/api/players`: endpoints internos de Nuxt para `/api/players` y `/api/players/[id]`.
- `app/domains/players`: utilidades de presentacion y metricas para jugadores.
- `app/domains/tools`: datos del FAQ y calculos de la calculadora.
- `shared/domains/players`: tipo compartido `Player`.

## Comandos

```bash
cd nuxt
npm install
npm run dev
```

Validaciones antes de entregar:

```bash
npm run format
npm run lint
npm run build
```

Vista local por defecto:

```bash
http://localhost:3000
```
