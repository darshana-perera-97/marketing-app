# Frontend - AI Marketing Assistant

React application for the AI Marketing Assistant marketing platform.

## Features

- User authentication with localStorage persistence
- Content generation (Social Media, Ad Copy, Email)
- Content history and management
- Credits and billing management
- Admin dashboard
- Responsive design with Tailwind CSS

## Setup

```bash
npm install --legacy-peer-deps
npm start
```

## Environment Variables

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Authentication

The app stores user data in browser localStorage:
- `userId` - User ID
- `userToken` - Authentication token
- `userData` - Complete user object
- `isAdmin` - Admin flag

## API Integration

All API calls are made through `src/utils/api.js` which automatically includes authentication tokens from localStorage.

## Demo Credentials

- **Admin**: `admin@demo.com` / `demo123`
- **User**: `user@example.com` / `demo123`
