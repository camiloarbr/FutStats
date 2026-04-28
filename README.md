# FutStats

FutStats is a football statistics dashboard built with Vue 3, TypeScript and Nest.js. The front-end renders teams, players, matches and analytics, while the back-end owns authentication, persistence and business rules.

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Axios
- TailwindCSS
- Chart.js
- Leaflet
- Nest.js
- TypeORM
- SQLite
- ESLint
- Prettier

## Team

| Role | Name |
| --- | --- |
| Architect | Camilo |
| Frontend Developer | Samuel |
| Frontend Developer | Victor |

## Requirements

- Node.js >= 20.19
- npm >= 9

## Installation & Setup

1. Clone the repository.

   ```bash
   git clone <repository-url>
   cd FutStats
   ```

2. Install and start the back-end.

   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run start:dev
   ```

3. Open another terminal, install and start the front-end.

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

The front-end runs at `http://localhost:5173` and the API runs at `http://localhost:3000/api`.

## Front-end Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Create production build |
| `npm run lint` | Run ESLint and automatic fixes |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript validation |

## Back-end Scripts

| Command | Description |
| --- | --- |
| `npm run start:dev` | Start Nest.js in watch mode |
| `npm run build` | Compile the back-end |
| `npm run lint` | Run ESLint and automatic fixes |
| `npm run format` | Format back-end TypeScript files |
| `npm run test` | Run TypeScript validation |

## Project Structure

```text
FutStats/
├── backend/
│   └── src/
│       ├── auth/
│       ├── database/
│       ├── matches/
│       ├── players/
│       ├── teams/
│       └── users/
└── frontend/
    └── src/
        ├── components/
        ├── dtos/
        ├── interfaces/
        ├── router/
        ├── services/
        ├── stores/
        ├── utils/
        └── views/
```

## Key Responsibilities

- The Nest.js back-end is the source of truth for teams, players, matches and users.
- The front-end consumes the API through Axios services.
- Pinia stores are used as reactive UI cache, not as persistent data storage.
- Front-end seeders and LocalStorage data persistence were removed.
- Authentication is handled by the back-end with JWT tokens.

## Demo Credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@futstats.com | admin123 |
| User | user@futstats.com | user123 |

## Documentation

Full technical documentation, architecture guidelines and contribution standards are available in the repository wiki.

Local wiki drafts for Entregable 2:

- [Entregable 2](docs/wiki/Entregable-2.md)
- [Guia de estilo de programacion Back-end](docs/wiki/Guia-de-estilo-de-programacion-Backend.md)
- [Reglas de programacion Back-end](docs/wiki/Reglas-de-programacion-Backend.md)

For detailed coding conventions and project rules, see [Copilot Instructions](.github/copilot-instructions.md).

## License

This project is licensed under the MIT License.
