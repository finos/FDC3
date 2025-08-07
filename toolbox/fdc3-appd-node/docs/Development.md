# Development Instructions

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/kushagraGit/finos_hackathon_citi_vikings.git

# Install dependencies
npm install

# Copy environment file and update with your MongoDB URL
cp .env.example .env
```

### Environment Variables

Create/update a `.env` file with the following variables:

```env
# Server Configuration
PORT=8080 --> Port where the server will be hosted
HOST=localhost --> Host where the server will be hosted
NODE_ENV=development --> Environment in which the server will run. 

# Database Configuration
DB_TYPE=mongo
MONGODB_URL=mongodb+srv://kushagrapaypal1:xLrTk1hVSACABnkH@finoshackathon.6tc7q.mongodb.net/app-directory?retryWrites=true&w=majority&appName=finosHackathon

```

### Seeding Commands

```bash
# Seed all data (users and applications)
npm run seed

# Seed only users
npm run seed:users
# Creates default users:
# - Vishal Gautam (Admin)
# - Kushagra Asthana (User)
# - Yousuf Ejaz Ahmad (User)

# Seed only applications
npm run seed:apps
# Creates default applications:
# - FDC3 Workbench
# - Trading View
# - Market Data Terminal
```

### Running the Application

```bash
# Development mode (includes auto-seeding)
npm run dev

# Production mode
npm start
```

### Steps to generate a public-private key pair

```
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private.key -out public.key
```

## Development

In the project directory, you can run:

### `npm start`

Runs the app in production mode.

```bash
npm start
```

### `npm run dev`

Runs the app in development mode with hot reload.

```bash
npm run dev
```

### `npm test`

Launches the test runner.

```bash
npm test
```

### `npm run seed`

Seeds both users and applications data in development mode.

```bash
npm run seed
```

### `npm run seed:users`

Seeds only user data in development mode. This will create default users with the following data:

```bash
npm run seed:users
```

Example users created:

- Vishal Gautam (Admin)
- Kushagra Asthana
- Yousuf Ejaz Ahmad

### `npm run seed:apps`

Seeds only application data in development mode. This will create default FDC3 applications:

```bash
npm run seed:apps
```

Example applications created:

- FDC3 Workbench
- Trading View
- Market Data Terminal

## Configuration

Configure the application using environment variables:

```env
# Server Configuration
PORT=8080
HOST=localhost
NODE_ENV=development

# Database Configuration
DB_TYPE=mongo
MONGODB_URL=mongodb+srv://kushagrapaypal1:xLrTk1hVSACABnkH@finoshackathon.6tc7q.mongodb.net/app-directory?retryWrites=true&w=majority&appName=finosHackathon

```
