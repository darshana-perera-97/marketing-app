# Backend Server - AI Marketing Assistant

A Node.js/Express backend server for the AI Marketing Assistant application.

## Installation

```bash
npm install
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### User
- `GET /api/user/profile` - Get user profile

### Content Generation
- `POST /api/content/social-media` - Generate social media posts
- `POST /api/content/ad-copy` - Generate ad copy
- `POST /api/content/email` - Generate email campaigns

### Content History
- `GET /api/content/history` - Get content history with filters

### Credits
- `GET /api/credits` - Get current credits
- `GET /api/credits/transactions` - Get credit transactions

### Admin
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/users` - Get user list
- `GET /api/admin/plans` - Get subscription plans

### Brand Setup
- `POST /api/brand/setup` - Save brand configuration

## Demo Credentials

- **Admin**: `admin@demo.com` (any password)
- **User**: Any email address (any password)

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)

## Features

- CORS enabled for frontend integration
- JSON request/response handling
- Request logging
- Error handling
- Mock data for development

