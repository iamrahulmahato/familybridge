# FamilyBridge: Cross-Generational Care Coordination Platform

FamilyBridge is a comprehensive platform designed to address the growing "sandwich generation" challenge – adults who find themselves simultaneously caring for aging parents and their own children.

## Features

- Cross-Generation Calendar Orchestration
- Health Guardian Module
- Family Task Distribution Engine
- Multi-Modal Communication Hub
- Care Journey Documentation
- Resource and Knowledge Exchange

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- PostgreSQL
- Redis

## Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/familybridge.git
cd familybridge
```

### 2. Install dependencies

Install server dependencies:
```bash
cd server
npm install
```

Install client dependencies:
```bash
cd ../client
npm install
```

### 3. Environment setup

Create a `.env` file in the server directory with the following variables:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/familybridge
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=familybridge
PG_PASSWORD=your_password
PG_PORT=5432
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

Create a `.env` file in the client directory with:
```
REACT_APP_API_URL=http://localhost:5000
```

### 4. Database setup

Set up PostgreSQL database:
```bash
cd server
npm run db:setup
```

Seed the database with sample data:
```bash
npm run db:seed
```

### 5. Running the application

Terminal 1: Start the server
```bash
cd server
npm run dev
```

Terminal 2: Start the client
```bash
cd client
npm start
```

The application will be available at http://localhost:3000

## Testing

Run server tests:
```bash
cd server
npm test
```

Run client tests:
```bash
cd client
npm test
```

## Deployment

### Docker deployment
```bash
docker-compose up -d
```

### Manual deployment

1. Build the React frontend:
```bash
cd client
npm run build
```

2. Set up and start the server with production environment:
```bash
cd server
NODE_ENV=production npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

