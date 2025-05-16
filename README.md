REST API service for product management with the ability to import data from external API.

## Technologies

- NestJS
- PostgreSQL
- Redis
- Bull (for queues)
- Docker & Docker Compose
- Swagger (for API documentation)

## Requirements

- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 14+ (for local development)
- Redis 6+ (for local development)

## Quick Start

1. Clone the repository:

```bash
git clone <repository-url>
cd testUDTeCommerce
```

2. Start the application using Docker Compose:

```bash
docker-compose up -d
```

The application will be available at: http://localhost:3000

Swagger documentation: http://localhost:3000/api

## Project Structure

```
src/
├── common/          # Common components (filters, exceptions)
├── config/         # Application configuration
├── migrations/     # Database migrations
└── modules/        # Application modules
    ├── products/   # Product management
    └── import/     # Data import
```

## API Endpoints

### Products

- `GET /products` - Get list of products
- `GET /products/:id` - Get product by ID

### Import

- `POST /import` - Start data import
- `GET /import/status/:jobId` - Get import status
- `GET /import/active` - Get list of active imports
- `GET /import/history` - Get import history

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start database and Redis:

```bash
docker-compose up -d postgres redis
```

3. Run migrations:

```bash
npm run migration:run
```

4. Start the application:

```bash
npm run start:dev
```

## Configuration

Main application settings are located in:

- `.env.development` - environment variables
- `src/config/configuration.ts` - application configuration
- `docker-compose.yml` - Docker settings

## Monitoring and Logging

- Application logs are available through Docker:

```bash
docker-compose logs -f app
```

- Queue status can be monitored via API endpoints `/import/active` and `/import/history`
