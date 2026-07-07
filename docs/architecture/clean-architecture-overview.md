# Clean Architecture Overview

## Stack
- **Runtime**: Node.js (NestJS)
- **Database**: PostgreSQL + Prisma
- **Communication**: gRPC (inter-service), REST/GraphQL (API Gateway → external)
- **Message Broker**: Kafka (async events)
- **Search**: Elasticsearch
- **Media**: Object storage (MinIO/S3)
- **Cache**: Redis

## Services

| Service | Responsibility |
|---------|---------------|
| api-gateway | Entry point, route to internal gRPC |
| auth | Authentication, sessions |
| user | User profiles, addresses |
| product | Catalog, categories, wood species |
| inquiry | RFQ (request for quotation) |
| notification | Email notifications |
| media | Image/video upload & serving |
| search | Elasticsearch indexing & search |

## Layer Structure (per service)

```
src/
├── domain/          # Pure business logic — no framework deps
├── application/     # Use cases — orchestration
├── infrastructure/  # Technical implementations
└── presentation/    # Controllers, guards, interceptors, filters
```

### Layer Rules

- **Domain** knows nothing about outer layers
  - `entities/` — business objects (Product, Category, WoodSpecies)
  - `value-objects/` — Dimensions, Price, WoodGrade
  - `repositories/` — repository interfaces (contracts, no implementation)
  - `services/` — pure business logic
  - `events/` — domain events (ProductCreated, PriceChanged)
  - `exceptions/` — domain-specific errors

- **Application** imports domain only
  - `commands/` — write use cases
  - `queries/` — read use cases
  - `handlers/` — command/query handlers
  - `dto/` — data transfer objects
  - `interfaces/` — use case interfaces (optional)

- **Infrastructure** implements domain interfaces
  - `database/prisma/` — Prisma schema, migrations
  - `database/repositories/` — PrismaProductRepository implements IProductRepository
  - `cache/` — Redis client
  - `kafka/` — producer/consumer

- **Presentation** receives external requests
  - `controllers/` — gRPC controllers
  - `guards/` — auth guards
  - `interceptors/` — logging, response transformation
  - `filters/` — exception → gRPC error mapping

## Request Flow

```
[gRPC Request]
    ↓
Controller (presentation)   — map proto request → DTO
    ↓
Handler (application)       — orchestrate use case
    ↓
Domain Service (domain)     — pure business logic
    ↓
Repository Interface (domain) — contract
    ↓
Repository Impl (infrastructure) — Prisma implementation
    ↓
[PostgreSQL]
```

## Why This Matters

- **Testability**: swap infrastructure layer with mocks
- **Replaceability**: change database without touching business logic
- **Separation of Concerns**: framework code doesn't leak into domain
