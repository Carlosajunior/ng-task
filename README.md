# BFF Service

Backend For Frontend service built with NestJS, TypeScript, and PostgreSQL.

## 📋 Description

This is a BFF (Backend For Frontend) template project following clean architecture principles and SOLID design patterns. The project structure is organized for scalability and maintainability, with strong separation of concerns between infrastructure, business logic, and external integrations.

## 🏗️ Architecture

The project follows a modular structure inspired by enterprise BFF patterns:

```
src/
├── common/                      # Shared resources across the application
│   ├── apis/                    # External API integrations
│   ├── application/            # Application-level DTOs and interfaces
│   ├── enum/                   # Common enumerations
│   ├── error/                  # Custom error classes
│   ├── libs/                   # External library wrappers
│   ├── middleware/             # Global middleware
│   └── utils/                  # Utility functions
├── config/                     # Configuration modules
│   ├── env/                    # Environment variable validation (Zod)
│   ├── database/               # Database configuration and migrations
│   └── swagger.ts              # API documentation setup
├── modules/                    # Feature modules
│   └── infrastructure/         # Health checks and infrastructure
│       ├── config/             # Module configuration
│       └── controller/         # HTTP controllers
└── main.ts                     # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ng-task
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root:

```bash
# Application
APP_NAME=BFF Service
APP_DESCRIPTION=Backend For Frontend
APP_VERSION=1.0.0
APP_PORT=3000
SWAGGER_PATH=api
NODE_ENV=development

# Database PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=your_database
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
```

4. Run database migrations:

```bash
npm run migration:run
```

5. Start the application:

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📚 Available Scripts

| Script                       | Description                       |
| ---------------------------- | --------------------------------- |
| `npm run start`              | Start application                 |
| `npm run start:dev`          | Start in development mode (watch) |
| `npm run start:prod`         | Start in production mode          |
| `npm run build`              | Build the application             |
| `npm run lint`               | Run ESLint                        |
| `npm run format`             | Format code with Prettier         |
| `npm run test`               | Run unit tests                    |
| `npm run test:e2e`           | Run end-to-end tests              |
| `npm run migration:create`   | Create a new migration            |
| `npm run migration:run`      | Run pending migrations            |
| `npm run migration:revert`   | Revert last migration             |
| `npm run migration:generate` | Generate migration from entities  |

## 🗄️ Database

The project uses **TypeORM** with **PostgreSQL**. Migrations are located in `src/config/database/migrations/`.

### Creating Migrations

```bash
cd src/config/database/migrations
npm run migration:create MigrationName
```

### Running Migrations

```bash
npm run migration:run
```

### Generating Migrations from Entities

```bash
npm run migration:generate -- src/config/database/migrations/MigrationName
```

## 📖 API Documentation

Swagger documentation is available at:

```
http://localhost:3000/api
```

(Adjust port and path based on your `.env` configuration)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🛠️ Environment Variables

Environment variables are validated using **Zod** for type safety. See `src/config/env/handler.ts` for the complete schema.

### Required Variables

| Variable            | Description       | Example     |
| ------------------- | ----------------- | ----------- |
| `APP_PORT`          | Application port  | `3000`      |
| `POSTGRES_HOST`     | PostgreSQL host   | `localhost` |
| `POSTGRES_PORT`     | PostgreSQL port   | `5432`      |
| `POSTGRES_DATABASE` | Database name     | `bff_db`    |
| `POSTGRES_USER`     | Database user     | `postgres`  |
| `POSTGRES_PASSWORD` | Database password | `password`  |

### Optional Variables

| Variable          | Description             | Default                |
| ----------------- | ----------------------- | ---------------------- |
| `APP_NAME`        | Application name        | `BFF Service`          |
| `APP_DESCRIPTION` | Application description | `Backend For Frontend` |
| `APP_VERSION`     | Application version     | `1.0.0`                |
| `SWAGGER_PATH`    | Swagger docs path       | `api`                  |
| `NODE_ENV`        | Environment             | `development`          |

## 🎯 Key Features

✅ **Type-Safe Environment Variables** - Validated with Zod  
✅ **Clean Architecture** - Separation of concerns with clear module boundaries  
✅ **SOLID Principles** - Dependency injection and interface-based design  
✅ **Path Aliases** - Clean imports using `@/` aliases  
✅ **Swagger Documentation** - Auto-generated API docs  
✅ **Global Validation** - DTO validation with class-validator  
✅ **Database Migrations** - TypeORM migration system  
✅ **Error Handling** - Custom exception classes  
✅ **Code Quality** - ESLint + Prettier configured

## 📦 Tech Stack

- **Framework:** NestJS 10
- **Language:** TypeScript 5
- **Database:** PostgreSQL with TypeORM 0.3
- **Validation:** Zod (env) + class-validator (DTOs)
- **Documentation:** Swagger/OpenAPI
- **Testing:** Jest
- **Code Quality:** ESLint + Prettier

## 📝 License

This project is [UNLICENSED](LICENSE).

## 👥 Support

For questions or issues, please open an issue in the repository.
