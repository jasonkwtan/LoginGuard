default:
    @just --list

# Start PostgreSQL and wait until it is healthy.
db-up:
    docker compose up -d --wait postgres

# Stop PostgreSQL and preserve its data volume.
db-down:
    docker compose stop postgres

# Follow PostgreSQL logs.
db-logs:
    docker compose logs -f postgres

# Start the Spring Boot backend.
backend-run:
    mise exec -- ./backend/mvnw -f backend/pom.xml spring-boot:run

# Run backend tests and verification checks.
backend-test:
    mise exec -- ./backend/mvnw -f backend/pom.xml verify

# Start the Vite development server.
frontend-dev:
    mise exec -- npm --prefix frontend run dev

# Build the frontend.
frontend-build:
    mise exec -- npm --prefix frontend run build

# Run the configured backend tests; frontend tests are not configured yet.
test: backend-test
