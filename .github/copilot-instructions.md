# FutStats — GitHub Copilot Instructions

## Project Overview
FutStats is a football statistics dashboard SPA built with Vue 3 + TypeScript + Vite.
All data is mocked and persisted in LocalStorage. The architecture must anticipate
a future backend migration — the Services layer is the only layer allowed to touch data.

---

## Tech Stack
- Vue 3 + TypeScript + Vite
- Pinia (state management, setup syntax only)
- Vue Router 4
- TailwindCSS v3
- Chart.js + vue-chartjs
- Leaflet + @types/leaflet
- ESLint + Prettier

---

## Absolute Rules — Never Violate

- Never use `any` — implicit or explicit. Always type everything.
- Never use Options API. Only Composition API with `<script setup lang="ts">`.
- Never access `localStorage` directly from a View, Component, or Store.
  All LocalStorage interactions go through `LocalStorageUtils`.
- Never put business logic in a View or Component template.
- Never instantiate a Service class. All methods are static.
- Never use relative imports. Always use the `@/` alias for internal imports.
- Every file must have on line 1: `// @author: [Name] | FutStats`
- Run `npm run format` and `npm run lint` before every commit.

---

## Folder Structure
```
src/
├── components/
│   ├── charts/       # BaseChart.vue
│   ├── tables/       # DataTable.vue
│   ├── filters/      # SelectFilter.vue
│   ├── layout/       # AppHeader.vue, AppSidebar.vue, AppFooter.vue
│   └── ui/           # StatCard.vue, LeafletMap.vue
├── composables/
├── interfaces/       # One file per entity, Interface suffix
├── router/           # index.ts with navigation guards
├── services/         # Static class methods, one file per domain
├── stores/           # Pinia setup syntax, one file per domain
├── utils/            # Formatters.ts, LocalStorageUtils.ts
└── views/
    ├── teams/
    ├── players/
    └── matches/
```

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase multi-word | `StatCard.vue`, `DataTable.vue` |
| Views | PascalCase + View suffix | `TeamsView.vue`, `LoginView.vue` |
| Stores | camelCase + use prefix | `useTeamsStore`, `useAuthStore` |
| Interfaces | PascalCase + Interface suffix | `TeamInterface`, `PlayerInterface` |
| Services | PascalCase + Service suffix | `TeamService`, `PlayerService` |
| Utils | PascalCase | `Formatters`, `LocalStorageUtils` |
| Variables / functions | camelCase | `matchesPlayed`, `goalsFor` |
| Routes (named) | dot.notation | `teams.index`, `teams.show`, `teams.edit` |

---

## Domain Interfaces

Always use these exact shapes. Relations are always IDs, never nested objects.
```typescript
export interface TeamInterface {
  id: number
  imageUrl: string
  name: string
  country: string
  league: string
  foundedYear: number
  matchesPlayed: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

export interface PlayerInterface {
  id: number
  imageUrl: string
  fullName: string
  position: string
  nationality: string
  shirtNumber: number
  matchesPlayed: number
  goals: number
  assists: number
  shots: number
  passes: number
  yellowCards: number
  redCards: number
  minutesPlayed: number
  teamId: number
}

export interface MatchInterface {
  id: number
  date: Date
  stadium: string
  homeScore: number
  awayScore: number
  possessionHome: number
  possessionAway: number
  shotsHome: number
  shotsAway: number
  foulsHome: number
  foulsAway: number
  homeTeamId: number
  awayTeamId: number
}

export interface UserInterface {
  id: number
  username: string
  email: string
  passwordHash: string
  role: 'admin' | 'user'
  createdAt: Date
  isActive: boolean
}
```

---

## DTOs

DTOs are used only for create and update operations.
Never include `id` or auto-generated fields.
Always derive from the interface using `Omit`.
```typescript
export type CreateTeamDTO    = Omit<TeamInterface,   'id'>
export type CreatePlayerDTO  = Omit<PlayerInterface, 'id'>
export type CreateMatchDTO   = Omit<MatchInterface,  'id'>
export type CreateUserDTO    = Omit<UserInterface,   'id' | 'createdAt'>
```

---

## Views

- One View per route. Views only compose layout and delegate to stores or services.
- No business logic. No direct LocalStorage access.
- Always define `meta.title` and `meta.requiresAuth` in the route.
```typescript
// Good
<script setup lang="ts">
// @author: [Name] | FutStats
import { useTeamsStore } from '@/stores/useTeamsStore'
import DataTable from '@/components/tables/DataTable.vue'

const store = useTeamsStore()
</script>
```

---

## Components

- Reusable, never represent full pages.
- Single responsibility.
- Always type props and emits.
```typescript
// @author: [Name] | FutStats
<script setup lang="ts">
interface Props {
  title: string
  value: number
  icon?: string
}

const props = withDefaults(defineProps<Props>(), { icon: 'default' })
defineEmits<{ (e: 'click', id: number): void }>()
</script>
```

---

## Stores (Pinia)

- Setup syntax only. One store per domain.
- Fully typed state. Return only what needs to be exposed.
- Never called directly from templates for writes — use services.
```typescript
// @author: [Name] | FutStats
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TeamInterface } from '@/interfaces/TeamInterface'

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<TeamInterface[]>([])

  return { teams }
})
```

---

## Services

- Static methods only. Never instantiated.
- The ONLY layer allowed to read/write data (LocalStorage or future API).
- When backend is ready, only service internals change — never views or components.
- `create()` receives a DTO and assigns `id` and auto-generated fields.
```typescript
// @author: [Name] | FutStats
import { useTeamsStore } from '@/stores/useTeamsStore'
import type { TeamInterface } from '@/interfaces/TeamInterface'
import type { CreateTeamDTO } from '@/interfaces/TeamInterface'

export class TeamService {
  static getAll(): TeamInterface[] {
    return useTeamsStore().teams
  }

  static getById(id: number): TeamInterface | undefined {
    return useTeamsStore().teams.find((t) => t.id === id)
  }

  static create(dto: CreateTeamDTO): void {
    const store = useTeamsStore()
    const id = store.teams.length + 1
    store.teams.push({ id, ...dto })
  }

  static update(id: number, dto: Partial<CreateTeamDTO>): void {
    const store = useTeamsStore()
    const index = store.teams.findIndex((t) => t.id === id)
    if (index !== -1) store.teams[index] = { ...store.teams[index], ...dto }
  }

  static delete(id: number): void {
    const store = useTeamsStore()
    store.teams = store.teams.filter((t) => t.id !== id)
  }
}
```

---

## Utils

- Static classes only. No side effects. No store access.
- Input → predictable output.
```typescript
// @author: [Name] | FutStats
export class Formatters {
  static formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB')
  }

  static formatScore(home: number, away: number): string {
    return `${home} - ${away}`
  }

  static formatMinutes(minutes: number): string {
    return `${minutes}'`
  }
}
```

---

## Router

- Named routes with dot notation.
- RESTful paths only — no verbs.
- Guards in router file, never in views.
- Every route must define `meta.title` and `meta.requiresAuth`.
```typescript
{
  path: '/teams/:id/edit',
  name: 'teams.edit',
  component: () => import('@/views/teams/TeamFormView.vue'),
  meta: { title: 'Edit Team', requiresAuth: true },
}
```

---

## LocalStorage

- All access goes through `LocalStorageUtils`.
- Seed on first load using a boolean flag.
- Key always from `import.meta.env.VITE_STORAGE_KEY`.
```typescript
// @author: [Name] | FutStats
export class LocalStorageUtils {
  private static readonly KEY = import.meta.env.VITE_STORAGE_KEY as string
  private static readonly SEEDED_FLAG = `${LocalStorageUtils.KEY}_seeded`

  static isSeeded(): boolean {
    return localStorage.getItem(LocalStorageUtils.SEEDED_FLAG) === 'true'
  }

  static markAsSeeded(): void {
    localStorage.setItem(LocalStorageUtils.SEEDED_FLAG, 'true')
  }

  static seed(): void {
    if (LocalStorageUtils.isSeeded()) return
    // populate stores with mock data here
    LocalStorageUtils.markAsSeeded()
  }
}
```

---

## Import Order

Always in this order, alphabetical within each group:
```typescript
// 1. External packages
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

// 2. Internal — stores
import { useTeamsStore } from '@/stores/useTeamsStore'

// 3. Internal — services
import { TeamService } from '@/services/TeamService'

// 4. Internal — components
import DataTable from '@/components/tables/DataTable.vue'

// 5. Internal — interfaces / types
import type { TeamInterface } from '@/interfaces/TeamInterface'
```

---

## Environment Variables
```
VITE_APP_NAME=FutStats
VITE_APP_VERSION=1.0.0
VITE_STORAGE_KEY=futstats_data
```

Always access via `import.meta.env.VITE_*`. Never hardcode values.