# LoginGuard

LoginGuard starts as a Spring Boot security lab and grows into a platform that generates runnable Spring Boot starter apps. The first public release serves the Sessions + Rate limiting starter and supports validated custom generation in one AWS region. JWT-protected APIs and company SSO follow.

The current scaffold includes a React landing page, a Spring Boot backend and a PostgreSQL migration.

## Getting started

The local setup runs the React frontend, a Spring Boot backend, and PostgreSQL. These commands assume Bash in WSL, Git, [mise](https://mise.jdx.dev/), [direnv](https://direnv.net/), and Docker with Compose.

Clone the project and install the locked Java 25 and Node.js 26 toolchains:

```bash
git clone https://github.com/jasonkwtan/loginguard.git
cd loginguard
mise install --locked
cp -n .env.example .env
```

On first setup, edit `.env` and replace the example password with a private local value. Review `.envrc`, which loads these variables for the backend. Then start the database and application:

```bash
direnv allow
docker compose up -d --wait postgres
direnv exec . mise exec -- ./backend/mvnw -f backend/pom.xml spring-boot:run
```

In a second terminal, run the following from the repository root, then open [http://localhost:15173](http://localhost:15173):

```bash
mise exec -- npm --prefix frontend ci
mise exec -- npm --prefix frontend run dev
```

## Configuration

Compose reads `.env` directly. The `direnv exec .` commands above and below load the same settings for Spring Boot.

| Variable | Purpose |
| --- | --- |
| `POSTGRES_DB` | Database name (default in the example: `loginguard`) |
| `POSTGRES_USER` | Database user (default in the example: `loginguard`) |
| `POSTGRES_PASSWORD` | Password used when PostgreSQL initializes the data volume |
| `POSTGRES_PORT` | Optional local PostgreSQL host port (defaults to `15432`) |

LoginGuard uses `15432` for PostgreSQL and `15173` for Vite so it can run on Windows setups where the default ports (`5432` and `5173`) fall within excluded TCP port ranges.

Spring and local database clients connect to `localhost:15432` by default. Compose publishes the container’s port `5432` on the host’s IPv4 loopback address (`127.0.0.1`) using the configured host port. The named volume preserves data between restarts, including the database credentials set at initialization.

## Development

Run checks from the repository root. For routine backend changes, start local PostgreSQL and run Maven verification:

```bash
direnv exec . mise exec -- ./backend/mvnw -f backend/pom.xml verify
```

For frontend-only changes, run lint and the production build. Both run independently of PostgreSQL.

```bash
mise exec -- npm --prefix frontend run lint
mise exec -- npm --prefix frontend run build
```

Stop the frontend and backend with Ctrl+C in their terminals. Run `docker compose stop postgres` to stop the database. If you use [just](https://just.systems/), run `just --list` for shortcuts.

### Isolated migration check

For schema changes, run Maven verification against a fresh PostgreSQL instance. This command creates a separate Compose project and volume, asks Docker for an available loopback port, and passes that port to Spring. It removes the test project and its volume when the check finishes.

```bash
direnv exec . bash -eu -c '
  export COMPOSE_PROJECT_NAME="loginguard-migration-$(cat /proc/sys/kernel/random/uuid)"
  export POSTGRES_PORT=0
  trap "docker compose down --volumes" EXIT
  docker compose up -d --wait postgres
  endpoint=$(docker compose port postgres 5432)
  POSTGRES_PORT="${endpoint##*:}" mise exec -- ./backend/mvnw -f backend/pom.xml verify
'
```

## Architecture

The React 19 and TypeScript frontend lives in [frontend/](frontend/). The Java 25 backend in [backend/](backend/) uses Spring Boot 4.2, Spring Security, and Spring Data JPA. PostgreSQL 17 stores application data. Flyway applies [versioned migrations](backend/src/main/resources/db/migration/), and Hibernate validates entity mappings at startup.

The design starts with a modular monolith. The first browser authentication flow will use server-side sessions and CSRF protection.

## Project plan

Use the [roadmap](docs/ROADMAP.md) for the delivery milestones, authorization contract, starter release checks and Runbook Search adoption plan. The [API protection exercise](docs/API-PROTECTION.md) covers single-process limits, Redis, AWS WAF and DDoS readiness. Start with the [current handoff](docs/ROADMAP.md#current-handoff) for the latest verified state and next task.
