# App Directory for FDC3

## Overview

An application directory (appD) is a structured repository of information about apps that can be used in an FDC3-enabled desktop. It provides a secure and efficient way of storing and managing metadata about apps in your ecosystem, with role-based access control and comprehensive API documentation. App Directory (<https://fdc3.finos.org/docs/app-directory/overview>) is a component of the FDC3 platform (<https://fdc3.finos.org/docs/fdc3-intro>).

## Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## Quick Start

To quickly get the app up and running, follow these steps:

1. Install the necessary dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

This will start the API server and the UI, both running on port `8080`. You can access the UI at `http://localhost:8080/login`. API docs can be accessed at: `http://localhost:8080/api-docs`.

## Features

### Core Features

- User authentication and authorization with JWT (RS256)
- Role-based access control (User, Admin, Editor, Desktop Agent)
- User and Application CRUD operations
- Application approval workflow
- Health monitoring endpoints
- MongoDB integration
- Environment-based configuration
- Seed data support
- Swagger API documentation

### Platform Support

- Cross-platform compatibility (Windows, macOS, Linux)

### Security Features

- JWT-based authentication with RS256 algorithm
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Request validation
- Error handling middleware
- CORS support

### Developer Features

- Hot reload in development mode
- Environment-based configuration
- Comprehensive error logging
- Testing support
- Seed data generation

### User Roles

- Admin: Full system access
- Editor: Can manage applications and content
- User: Basic access to applications
- Desktop Agent: Special access for FDC3 desktop agents

### API Features

- RESTful endpoints
- JSON payload support
- Search functionality
- Filtering capabilities
- Detailed error responses
- Rate limiting
- API versioning (v1, v2)

### Database Features

- MongoDB integration
- Schema validation
- Indexing for performance

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## API Documentation

For comprehensive API documentation, please refer to the following markdown files in the `docs/` folder:

- [Health Check API](docs/health-check.md)
- [User API](docs/user-api.md)
- [Application API](docs/application-api.md)

Access the Swagger documentation at:

```
http://localhost:8080/api-docs
```

### Key Endpoints

#### Authentication

```bash
POST   /v1/users/login    # User login
```

#### User Management

```bash
POST   /v1/users          # Create user
GET    /v1/users          # Get all users (Admin only)
GET    /v1/users/:email   # Get user by email
PATCH  /v1/users/:email   # Update user (Admin/Editor)
DELETE /v1/users/:email   # Delete user (Admin only)
PATCH  /v1/users-approve  # Approve/reject user (Admin only)
```

#### Application Management

```bash
POST   /api/v2/apps              # Create application
GET    /api/v2/apps              # Get all applications
GET    /api/v2/apps/{appId}      # Get application by ID
PATCH  /api/v2/apps/{appId}      # Update application
DELETE /api/v2/apps/{appId}      # Delete application
POST   /api/v2/apps/search       # Search applications
PATCH  /api/v2/apps/approve      # Approve/reject application
```

#### Health Monitoring

```bash
GET    /v1/health         # Basic health check
GET    /v1/health/detailed # Detailed health status
GET    /v1/health/live    # Kubernetes liveness probe
GET    /v1/health/ready   # Kubernetes readiness probe
```

## Contributing

For local setup and development instructions, please refer to the [Development Instructions](docs/DEVELOPMENT.md) file. For detailed information on the codebase, please refer to the [Contributions](docs/Contributions.md) file.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Project Maintainer: Vishal Gautam, Yousuf Ejaz Ahmad, Kushagra Asthana
- Email: <Vishalgautam.tech@gmail.com>, <ejazahmadyousuf2@gmail.com>, <kushagra661@gmail.com>

## Acknowledgments

- MongoDB Team
- Express.js Team
- Node.js Community
