# Contributions Guide

This document provides an overview of the project's folder structure and the rationale behind its organization. Understanding this structure will help contributors navigate the codebase efficiently and make meaningful contributions.

## Thought Process

The folder structure is designed to promote modularity, scalability, and maintainability. Each component of the application is organized into distinct directories, allowing for clear separation of concerns. This approach facilitates easier debugging, testing, and future enhancements. The structure also aligns with common best practices in Node.js and Express.js applications, making it intuitive for developers familiar with these technologies.

## Folder Structure

```
project-root/
│
├── src/
│   ├── config/
│   │   ├── generateToken.js
│   │   └── environment.js
│   │
│   ├── database/
│   │   ├── mongo/
│   │   │   └── mongoDatabase.js
│   │   ├── postgres/
│   │   └── oracle/
│   │
│   ├── db/
│   │   ├── databaseOrchestrator.js
│   │   └── databaseInterface.js
│   │
│   ├── frontend/
│   │
│   ├── keys/
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── authorizeMiddleware.js
│   │
│   ├── models/
│   │   ├── schemas/
│   │   │   ├── application.schema.js
│   │   │   ├── intent.schema.js
│   │   │   └── user.schema.js
│   │   ├── intent.js
│   │   ├── application.js
│   │   └── user.js
│   │
│   ├── routes/
│   │   ├── user.js
│   │   ├── application.js
│   │   └── health.js
│   │
│   └── index.js
│
├── docs/
│   ├── user-api.md
│   ├── application-api.md
│   ├── health-check-api.md
│   └── postman/
│
└── .env
```

### Directory Breakdown

- **src/**: Contains the main source code for the application.
  - **config/**: Holds configuration files, such as token generation logic and imports for environment variable configuration.
  - **database/**: Contains database-specific configurations and connection logic for different database types (e.g., MongoDB, PostgreSQL, Oracle). Currently only MongoDB is supported. But, in future, we can add support for other databases by adding classes for each DB which implement the db/databaseInterface.js.
  - **db/**: Provides database orchestration and interface utilities for managing data transactions across different databases. It provides a single interface for the API later of the server to interact with the database without worrying about the underlying database technology.
  - **frontend/**: Placeholder for any frontend-related code or assets.
  - **keys/**: Placeholder for storing cryptographic keys or certificates. You will need to replace your keys with your own.
  - **middleware/**: Includes middleware functions for handling authentication and authorization processes, and some environment specific logging configurations.
  - **models/**: Defines the data models and schemas used in the application.
    - **schemas/**: Contains schema definitions for the entities in the models folder. These schemas are swagger documentations for the various model classes.
    - **application.js**: Created using the FDC3 charter contract as established in the OpenAPI specification present at: <https://editor.swagger.io/?url=https://fdc3.finos.org/schemas/2.1/appd.schema.json>
    - **intent.js**: Created using the FDC3 charter contract as established in the OpenAPI specification present at: <https://editor.swagger.io/?url=https://fdc3.finos.org/schemas/2.1/intent.schema.json>
    - **user.js**: Defines the user model class. This is a custom object which is created for authentication and authorization purposes. Users are created with the following roles to manage authorization:
      - **admin**: Has access to all endpoints.
      - **user**: Has access to endpoints related to applications and intents.
      - **editor**: Has access to endpoints related to applications and intents.
      - **desktopAgent**: Has access to endpoints related to applications and intents. This is created for the desktop agent to interact with the API in a secured manner.
  - **routes/**: Houses the route handlers for different API endpoints, organizing them by functionality (e.g., user, application, health). This is the place where you can add new functionalities to be supported for users or applications stored in the app directory.
  - **index.js**: The main entry point for the application, setting up the Express server and middleware and the UI.
  - **seeds/**: Contains seed files for the database. These are used to populate the database with initial data. Creates few admin users to support initial login.

- **docs/**: Contains documentation files for the API and other components.
  - **.md**: Documentation for various API endpoints.
  - **postman/**: Contains Postman collections or environment files for API testing.

- **.env**: Environment configuration file for setting up environment-specific variables.

## Contribution Guidelines

1. **Follow the Folder Structure**: Ensure that new files are placed in the appropriate directories.
2. **Maintain Code Consistency**: Adhere to the existing coding style and conventions.
3. **Document Your Changes**: Update relevant documentation files in the `docs/` directory.
4. **Write Tests**: If applicable, include tests for new features or bug fixes.
5. **Submit Pull Requests**: Use pull requests for code reviews and discussions before merging changes.

By following these guidelines and understanding the folder structure, contributors can effectively collaborate and enhance the project.
