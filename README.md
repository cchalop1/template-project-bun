# Bun Monorepo — Elysia + React + PostgreSQL

Monorepo full-stack avec **Bun**, **Elysia** (API), **React + Vite** (UI) et **PostgreSQL + Drizzle ORM** (base de données). Type-safety de bout en bout entre le frontend et le backend via Eden Treaty.

## Architecture

```
├── apps/
│   ├── api/             # Backend Elysia (port 3000)
│   └── ui/              # Frontend React + Vite (port 5173)
├── packages/
│   └── contracts/       # Types partagés (re-export du type App)
├── docker-compose.yml   # PostgreSQL local
├── biome.json           # Linting & formatting
└── tsconfig.base.json
```

**Type-safety end-to-end** : `apps/api/src/exports.ts` exporte le type `App` → `packages/contracts` le re-exporte → `apps/ui/src/lib/api.ts` l'utilise avec Eden Treaty pour des appels API entièrement typés.

## Prérequis

- [Bun](https://bun.sh) >= 1.3.5
- [Docker](https://www.docker.com/) (pour PostgreSQL)

## Installation

```bash
bun install
```

## Lancer le projet

### 1. Démarrer la base de données

```bash
docker compose up -d
```

Cela lance PostgreSQL sur le port `5432` avec les identifiants par défaut (voir variables d'environnement ci-dessous).

### 2. Configurer les variables d'environnement

**`apps/api/.env`**
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
```

**`apps/ui/.env`**
```env
VITE_API_URL=http://localhost:3000
```

### 3. Appliquer les migrations

```bash
cd apps/api
bun run db:push    # Push le schéma directement (dev)
# ou
bun run db:migrate # Appliquer les migrations
```

### 4. Lancer les services

```bash
bun dev         # Lance l'API et l'UI en parallèle
bun dev:api     # Lance uniquement l'API (port 3000)
bun dev:ui      # Lance uniquement l'UI (port 5173)
```

## Variables d'environnement

### API (`apps/api/.env`)

| Variable | Requis | Description |
|----------|--------|-------------|
| `PORT` | Non | Port du serveur. Par défaut `3000`. |
| `FRONTEND_URL` | Oui | URL du frontend pour le CORS. |
| `DATABASE_URL` | Oui | URL de connexion PostgreSQL. |

### UI (`apps/ui/.env`)

| Variable | Requis | Description |
|----------|--------|-------------|
| `VITE_API_URL` | Oui | URL de base de l'API. |

### Docker Compose (PostgreSQL)

Les identifiants par défaut dans `docker-compose.yml` :

| Variable | Valeur |
|----------|--------|
| `POSTGRES_USER` | `user` |
| `POSTGRES_PASSWORD` | `password` |
| `POSTGRES_DB` | `mydb` |
| Port exposé | `5432` |

## Commandes disponibles

### Racine du projet

| Commande | Description |
|----------|-------------|
| `bun dev` | Lance tous les services en mode développement |
| `bun dev:api` | Lance uniquement l'API |
| `bun dev:ui` | Lance uniquement l'UI |
| `bun lint` | Vérifie le linting (Biome) |
| `bun lint:write` | Corrige automatiquement le linting |
| `bun format` | Formate le code |
| `bun clean:modules` | Supprime node_modules et le lockfile |

### Base de données (depuis `apps/api`)

| Commande | Description |
|----------|-------------|
| `bun run db:generate` | Génère les migrations depuis le schéma |
| `bun run db:migrate` | Applique les migrations |
| `bun run db:push` | Push le schéma directement (dev) |
| `bun run db:studio` | Ouvre l'interface Drizzle Studio |

### Build de production

```bash
cd apps/api && bun run build   # Compile en binaire natif (dist/server)
cd apps/ui && bun run build    # Bundle Vite pour la production
```

## Stack technique

- **Runtime / Package manager** : Bun
- **Backend** : Elysia, JWT (authentification)
- **Frontend** : React 19, Vite, TailwindCSS v4, shadcn/ui
- **Base de données** : PostgreSQL + Drizzle ORM
- **Validation** : Arktype (frontend), Elysia built-in (backend)
- **Linting / Formatting** : Biome
- **TypeScript** : Mode strict

## License

MIT
