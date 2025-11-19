# NG Task API

REST API for content management and ratings built with NestJS, TypeScript, PostgreSQL, and Docker.

## 🚀 Quick Start

### With Docker (Recommended)

1. **Clone and configure**

```bash
git clone <repository-url>
cd ng-task
```

2. **Run with Docker Compose**

```bash
docker-compose up -d
```

The API will automatically:

- Start PostgreSQL database
- Run migrations
- Seed sample data (if database is empty)
- Start API on port 3000

3. **Access**

- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api
- PostgreSQL: localhost:5433

### Without Docker

1. **Prerequisites**

- Node.js 18+
- PostgreSQL 14+

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment**
   Create `.env` file:

```env
NODE_ENV=development
PORT=3000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=ng_task
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

JWT_SECRET=your-secret-key-here
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d
```

4. **Setup database**

```bash
npm run migration:run
npm run seed
```

5. **Start API**

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📚 API Endpoints

### Documentation

- **Swagger UI**: `GET /api` - Interactive API documentation

### Health Check

- **GET** `/health` - Check API status

### Authentication

- **POST** `/auth/login` - Login with email/username and password
  - Body: `{ "email": "user@example.com", "password": "password" }`
  - Returns: `{ accessToken, refreshToken, tokenType, expiresIn }`
- **POST** `/auth/refresh` - Refresh access token
  - Body: `{ "refreshToken": "token" }`

### Users

- **POST** `/users` - Create new user (public)
  - Body: `{ name, username, email, password }`
- **PATCH** `/users/:id` - Update user (authenticated)
  - Body: `{ name?, username?, email?, password? }`
- **DELETE** `/users/:id` - Delete user (authenticated)

### Contents

- **GET** `/contents` - List contents with pagination and filters
  - Query: `page, limit, search, category, createdBy, sortBy, order`
  - Returns: Content list with ratings
- **GET** `/contents/:id` - Get content by ID with ratings
- **POST** `/contents` - Create content (authenticated)
  - Body: `{ title, description, category, thumbnailUrl }`
- **PATCH** `/contents/:id` - Update content (authenticated)
  - Body: `{ title?, description?, category?, thumbnailUrl? }`
- **DELETE** `/contents/:id` - Delete content (authenticated)

### Ratings

- **POST** `/ratings` - Rate a content (authenticated)
  - Body: `{ contentId, rating, comment? }`
  - Rating: 1-5 stars
  - Note: Each user can only rate a content once

## 🔐 Authentication

Protected endpoints require Bearer token:

```
Authorization: Bearer <access_token>
```

### Sample Credentials (After Seeding)

```
Email: admin@example.com
Password: Admin123!

Email: john.doe@example.com
Password: User123!
```

## 🗄️ Database

### Migrations

```bash
# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate new migration
npm run migration:generate -- src/config/database/migrations/MigrationName
```

### Seed Data

```bash
# Run seeds manually
npm run seed
```

Seeds automatically run on first Docker Compose startup if database is empty.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:cov

# Watch mode
npm run test:watch
```

Current coverage: **100%** on all modules.

## 📦 Tech Stack

- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **Database**: PostgreSQL 14
- **ORM**: TypeORM
- **Authentication**: JWT
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose

## 🛠️ Available Scripts

```bash
npm run start:dev      # Start in development mode
npm run start:prod     # Start in production mode
npm run build          # Build for production
npm run migration:run  # Run pending migrations
npm run seed           # Seed sample data
npm run test           # Run tests
npm run test:cov       # Run tests with coverage
npm run lint           # Lint code
npm run format         # Format code with Prettier
```

## 📝 Content Categories

- `GAME` - Video games
- `VIDEO` - Videos and movies
- `ARTWORK` - Digital and physical artwork
- `MUSIC` - Music and audio content

## 🔄 Database Reset (Docker)

To reset database and start fresh:

```bash
docker-compose down -v
docker-compose up -d
```

This will recreate the database with migrations and seed data.

## 👤 Author

Carlos Alberto
