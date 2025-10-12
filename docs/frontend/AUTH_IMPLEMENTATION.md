# Authentication Implementation

This document describes the complete authentication flow implementation for the EV Rental System web application.

## Overview

The authentication system has been implemented using:

- **API Client**: Axios instance with interceptors for automatic token handling
- **State Management**: Zustand store with persistence
- **Form Management**: React Hook Form with Zod validation
- **Notifications**: Sonner for toast messages
- **Routing**: Next.js middleware for route protection

## Components

### 1. Authentication Service (`src/services/auth.service.ts`)

- Handles all authentication-related API calls
- Manages token storage and retrieval
- Provides error handling with custom `AuthError` class
- Methods:
  - `login(credentials)` - Authenticate user
  - `getCurrentUser()` - Fetch user information
  - `logout()` - Clear tokens
  - `isAuthenticated()` - Check authentication status

### 2. Authentication Store (`src/stores/auth.store.ts`)

- Global state management using Zustand
- Persistent storage with localStorage
- Automatic token refresh on app load
- Cookie management for middleware
- State includes:
  - `user` - Current user data
  - `isAuthenticated` - Authentication status
  - `isLoading` - Loading states
  - `error` - Error messages

### 3. Login Form (`src/components/login-form.tsx`)

- Form validation with Zod schema
- Email/phone number support
- Error handling and display
- Automatic redirect after successful login

### 4. User Menu (`src/components/auth/user-menu.tsx`)

- User profile display
- Logout functionality
- Role-based display

### 5. Protected Routes (`src/components/protected-route.tsx`)

- Route protection based on authentication status
- Role-based access control
- Loading states and redirects

### 6. Middleware (`src/middleware.ts`)

- Server-side route protection
- Cookie-based authentication check
- Role-based redirects

## API Endpoints

### Login

- **POST** `/auth/login`
- **Payload**: `{ emailOrPhone: string, password: string }`
- **Response**: `{ success: boolean, message: string, data: { accessToken: string, user: {...} } }`

### Get User Info

- **GET** `/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success: boolean, message: string, data: { ...userData } }`

## Usage

### Basic Authentication Check

```tsx
import { useAuth } from "@/stores/auth.store";

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return <div>Welcome, {user?.fullName}!</div>;
}
```

### Login

```tsx
import { useAuth } from "@/stores/auth.store";

function LoginComponent() {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login("user@example.com", "password123");
      // User will be automatically redirected
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
}
```

### Protected Routes

```tsx
import {
  ProtectedRoute,
  StaffOnly,
  RenterOnly,
} from "@/components/protected-route";

function App() {
  return (
    <StaffOnly>
      <StaffDashboard />
    </StaffOnly>
  );
}
```

## Configuration

### Environment Variables

Create a `.env.local` file in the web app root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Token Storage

- Access tokens are stored in localStorage
- Cookies are set for middleware access
- Automatic cleanup on logout

## Error Handling

The system handles various error scenarios:

- Invalid credentials
- Network errors
- Token expiration
- Server errors

All errors are displayed to users via toast notifications.

## Testing

A test page is available at `/test-auth` to verify the authentication flow:

- Shows current authentication status
- Displays user information
- Provides logout functionality

## Security Features

- JWT token-based authentication
- Automatic token refresh
- Secure cookie handling
- Route protection at middleware level
- Role-based access control
- CSRF protection via SameSite cookies
