# Worker Platform (Majstorija)

A full-stack web platform that connects clients with local workers for everyday jobs, and helps workers find new gigs. Clients can post jobs, hire workers, pay securely online, and leave reviews.

> **Team project (3 developers).** My role: backend REST API, JWT authentication with refresh tokens, database design, and Stripe payment integration.
> Main team repository: https://github.com/fstefan3108/majstorija-web-app

## Features

- User and worker (service provider) registration and login
- Posting, browsing, and managing jobs
- Reviews and ratings for completed work
- Secure online payments with Stripe Checkout
- JWT authentication with database-backed refresh tokens and token expiration

## Tech Stack

| Layer | Technologies |
|---|---|
| Backend | C#, ASP.NET Core Web API, ADO.NET |
| Frontend | React, React Router |
| Database | SQL Server |
| Auth | JWT, Refresh Tokens |
| Payments | Stripe API |

## Architecture

The backend follows a layered architecture:

- **Controllers** handle HTTP requests and responses
- **Services** contain the business logic
- **Repositories** handle data access with parameterized SQL queries (ADO.NET), protecting against SQL injection

Dependencies are wired through ASP.NET Core's built-in dependency injection.

## Getting Started

### Prerequisites

- .NET SDK
- Node.js and npm
- SQL Server
- A Stripe account (test mode keys)

### Backend

1. Create the database in SQL Server.
2. Set the connection string, JWT settings, and Stripe secret key in `backend/appsettings.json` (or use user secrets).
3. Run the API:
```bash
   cd backend
   dotnet run
```

### Frontend

```bash
cd frontend
npm install
npm start
```
