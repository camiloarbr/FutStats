# ⚽ FutStats

A comprehensive football statistics dashboard built with modern web technologies. FutStats provides real-time team, player, and match analytics with interactive visualizations and data management capabilities. Designed as a scalable SPA with a clear separation between frontend and backend layers.

## 🚀 Tech Stack

- **Vue 3** — Progressive JavaScript framework
- **TypeScript** — Type-safe JavaScript
- **Vite** — Lightning-fast build tool
- **Pinia** — State management with setup syntax
- **Vue Router 4** — Client-side routing
- **TailwindCSS** — Utility-first CSS framework
- **Chart.js** — Powerful charting library
- **Leaflet** — Interactive maps
- **ESLint** — Code quality and consistency
- **Prettier** — Code formatter

## 👥 Team

| Role | Name |
|------|------|
| Architect | Camilo |
| Frontend Developer | Samuel |
| Frontend Developer | Victor |

## 📋 Requirements

- Node.js >= 18
- npm >= 9

## ⚙️ Installation & Setup

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FutStats
   ```

2. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at **http://localhost:5173**

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run lint` | Run ESLint and apply automatic fixes |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type validation |

## 🏗️ Project Structure

```
frontend/src/
├── components/          # Reusable Vue components
│   ├── charts/         # Chart components (BaseChart)
│   ├── filters/        # Filter components (SelectFilter)
│   ├── layout/         # Layout components (Header, Sidebar, Footer)
│   ├── tables/         # Table components (DataTable)
│   └── ui/             # UI components (StatCard, LeafletMap)
├── composables/         # Reusable Vue composition functions
├── interfaces/          # TypeScript interfaces and types
├── router/              # Vue Router configuration and navigation guards
├── services/            # Business logic and data access layer
├── stores/              # Pinia store definitions (state management)
├── utils/               # Utility functions (formatters, localStorage)
└── views/               # Page components (Views for each route)
    ├── teams/          # Team-related views
    ├── players/        # Player-related views
    └── matches/        # Match-related views
```

**Key Responsibility:**
- **Services** layer is the only place allowed to access localStorage or backend APIs
- All data persists in localStorage with mock data during development
- Architecture supports seamless migration to a backend when ready

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@futstats.com | admin123 |
| User | user@futstats.com | user123 |

## 📚 Documentation

Full technical documentation, architecture guidelines, and contribution standards are available in the [Wiki](../../wiki).

For detailed coding conventions and project rules, see [Copilot Instructions](.github/copilot-instructions.md).

## 🚀 Deployment

Production deployment to Google Cloud Platform coming soon.

## 📄 License

This project is licensed under the MIT License.
