# LoginGuard

LoginGuard is a learning project focused on browser authentication, login security, and bot protection with Spring Boot and React.

## Getting started

The local setup runs a React starter UI, a Spring Boot backend, and PostgreSQL. These commands assume Bash in WSL, Git, [mise](https://mise.jdx.dev/), [direnv](https://direnv.net/), and Docker with Compose.

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

LoginGuard adds `10000` to the standard ports for local development, using `15432` for PostgreSQL (default `5432`) and `15173` for Vite (default `5173`). This keeps the port numbers recognizable and lets LoginGuard run alongside projects that use the defaults.

Spring and local database clients connect to `localhost:15432` by default. Compose maps that loopback port to `5432` inside the PostgreSQL container. The named volume preserves data between restarts, including the database credentials set at initialization.

## Development

Run checks from the repository root with PostgreSQL running:

```bash
direnv exec . mise exec -- ./backend/mvnw -f backend/pom.xml verify
mise exec -- npm --prefix frontend run lint
mise exec -- npm --prefix frontend run build
```

Stop the frontend and backend with Ctrl+C in their terminals. Run `docker compose stop postgres` to stop the database. If you use [just](https://just.systems/), run `just --list` for shortcuts.

## Architecture

The React 19 and TypeScript frontend lives in [frontend/](frontend/). The Java 25 backend in [backend/](backend/) uses Spring Boot 4.2, Spring Security, and Spring Data JPA. PostgreSQL 17 stores application data. Flyway applies [versioned migrations](backend/src/main/resources/db/migration/), and Hibernate validates entity mappings at startup.

The design starts with a modular monolith. The first browser authentication flow will use server-side sessions and CSRF protection.
