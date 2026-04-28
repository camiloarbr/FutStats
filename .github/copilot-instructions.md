# FutStats - GitHub Copilot Instructions

## Project Overview

FutStats is a football statistics dashboard with a Vue 3 + TypeScript front-end and a Nest.js + TypeORM + SQLite back-end.

The back-end is the source of truth for teams, players, matches and users. The front-end consumes the API with Axios services and keeps Pinia only as a reactive UI cache.

---

## Tech Stack

- Front-end: Vue 3, TypeScript, Vite, Pinia, Vue Router, Axios, TailwindCSS, Chart.js, Leaflet
- Back-end: Nest.js, TypeScript, TypeORM, SQLite, JWT, class-validator
- Quality: ESLint, Prettier, strict TypeScript

---

## Absolute Rules

- Never use `any`, implicit or explicit.
- Never use Vue Options API. Use Composition API with `<script setup lang="ts">`.
- Never put business logic in Vue templates.
- Front-end domain data must come from the Nest.js API.
- Do not add front-end seeders for teams, players, matches or users.
- Do not persist domain data in LocalStorage.
- Pinia stores are cache/state only; services own API reads and writes.
- Never instantiate front-end service classes. All methods are static.
- Every TypeScript/Vue file starts with `// @author: [Name] | FutStats`.
- Imports must use comment blocks and spacing:

```typescript
// 1. External imports
import { computed } from 'vue'

// 2. Internal imports
import { TeamService } from '@/services/TeamService'
```

- Imports must be ordered alphabetically inside each block.
- Run format, lint and type checks before committing.

---

## Front-end Structure

```text
frontend/src/
├── components/
├── dtos/
├── interfaces/
├── router/
├── services/
├── stores/
├── utils/
└── views/
```

## Front-end Responsibilities

- Views compose layout and call services or stores.
- Components are reusable and receive typed props/emits.
- Services use `apiClient` for HTTP calls.
- Stores keep reactive data already received from the API.
- `AuthStorage` is the only utility allowed to use LocalStorage, and only for auth session data.
- DTOs represent create/update payloads.
- Interfaces represent API response shapes.

## Front-end Domain Interfaces

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
  role: 'admin' | 'user'
  createdAt: Date
  isActive: boolean
}
```

---

## Back-end Structure

```text
backend/src/
├── auth/
├── database/
├── matches/
├── players/
├── teams/
└── users/
```

## Back-end Responsibilities

- Controllers only receive requests and delegate to services.
- Services own business rules and repository coordination.
- DTOs validate request bodies with `class-validator`.
- Entities map database tables and relationships.
- Guards protect private/admin endpoints.
- Authentication logic stays inside `auth`.
- Password hashes are never returned to the front-end.
- Use Nest exceptions instead of manual error objects.

## Back-end Import Format

```typescript
// 1. External imports
import { Controller, Get, Param } from '@nestjs/common'

// 2. Internal imports
import { TeamsService } from './teams.service'
```

---

## Environment Variables

Front-end:

```env
VITE_APP_NAME=FutStats
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=http://localhost:3000/api
```

Back-end:

```env
PORT=3000
API_PREFIX=api
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=change-me
JWT_EXPIRES_IN=1d
DATABASE_PATH=futstats.sqlite
TYPEORM_SYNCHRONIZE=true
```
