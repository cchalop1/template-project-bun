# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install          # Install dependencies
bun dev              # Start all services (API on :3000, UI on :5173)
bun dev:api          # Start API only
bun dev:ui           # Start UI only
bun lint             # Check linting (Biome)
bun lint:write       # Auto-fix linting issues
bun format           # Format code (Biome)
bun clean:modules    # Remove node_modules and lockfile
```

Database (from `apps/api`):
```bash
bun run db:generate  # Generate migrations from schema changes
bun run db:migrate   # Apply migrations
bun run db:push      # Push schema directly to DB (dev)
bun run db:studio    # Open Drizzle Studio GUI
```

Production builds:
```bash
cd apps/api && bun run build   # Compiles to native binary at dist/server
cd apps/ui && bun run build    # Vite production bundle
```

## Architecture

Bun monorepo with three packages:

- **`apps/api`** — Elysia HTTP backend. Entry: `src/index.ts`. Routes in `src/routes/`. Types exported via `src/exports.ts` for shared consumption.
- **`apps/ui`** — React 19 + Vite frontend. Entry: `src/main.tsx`. API client via Eden Treaty (`src/lib/api.ts`). TanStack Query for server state (`src/lib/queries.ts`).
- **`packages/contracts`** — Type-only package that re-exports the Elysia `App` type from the API. The UI imports from here to get end-to-end type safety.

### End-to-End Type Safety

The key architectural pattern: `apps/api/src/exports.ts` exports the `App` type → `packages/contracts` re-exports it → `apps/ui/src/lib/api.ts` uses Eden Treaty with that type to get fully typed API calls. Adding new routes to the API automatically surfaces type errors in the UI if the client usage doesn't match.

### Environment Variables

API (`apps/api/.env`):
```
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=your-secret-key-change-in-production
```

UI (`apps/ui/.env`):
```
VITE_API_URL=http://localhost:3000
```

### API Routes

| Route | Method | Description | Auth |
|-------|--------|-------------|------|
| `/health` | GET | Health check, returns `{ status: "ok" }` | None |
| `/auth/signin` | POST | Register user, returns JWT token | None |
| `/auth/login` | POST | Authenticate user, returns JWT token | None |
| `/form/submit` | POST | Submit a form (name, role?, comments?) | None |

Auth routes (`apps/api/src/routes/auth/`):
- **Signin body**: `{ email, username, password }` — hashes password with `Bun.password.hash()`
- **Login body**: `{ email, password }` — verifies with `Bun.password.verify()`, signs JWT (7-day expiry)
- Follow Service/Repository pattern: `service.ts` (business logic) + `repository.ts` (Drizzle queries) + `model.ts` (Elysia schemas)

### Database Schema

`users` table (`apps/api/src/db/schema.ts`):
- `id` — UUID primary key, auto-generated
- `email` — varchar(255), unique
- `username` — varchar(255), unique
- `password` — varchar(255), hashed
- `createdAt` — timestamp, default now()

## Tech Stack

- **Runtime/Package manager**: Bun
- **Backend**: Elysia (type-safe HTTP framework), `src/app.ts` configures CORS + routes, `src/index.ts` starts the server
- **Frontend**: React 19, Vite, TailwindCSS v4, shadcn/ui, React Hook Form, Sonner (toasts)
- **Auth**: `@elysiajs/jwt` (JWT signing), `Bun.password` (Argon2 hashing)
- **Database**: PostgreSQL + Drizzle ORM (Bun SQL driver), schema in `apps/api/src/db/schema.ts`
- **Validation**: Arktype (frontend forms), Elysia's built-in types (backend)
- **Linting/Formatting**: Biome (not ESLint/Prettier)
- **TypeScript**: Strict mode via `tsconfig.base.json`

## Elysia Best Practices

**Controllers** — Treat each Elysia instance as a controller and define routes directly on it. Destructure only the needed properties from `Context`, never pass the entire `Context` to a function.

**Services**
- No HTTP dependency → static class or plain function
- HTTP/request dependent → implement as an Elysia instance (preserves type inference). Name the plugin to enable deduplication.
- Use `decorate` only for request-scoped properties (`requestIP`, `session`, etc.)

**Models** — Use Elysia's validation schemas as the single source of truth for both runtime validation and TypeScript types. Avoid separate interface/class declarations alongside schemas.

**Folder structure** — Feature-based: each feature owns its routes, service, model, and repository files together. Example: `src/routes/auth/` contains `index.ts`, `model.ts`, `service.ts`, `repository.ts`.

## Adding New Packages

Follow the existing pattern: create under `packages/` or `apps/`, add to root `package.json` workspaces, extend `tsconfig.base.json` in the package's own `tsconfig.json`.
