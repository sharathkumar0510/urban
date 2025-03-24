# API Conventions

## API Structure

The API layer is organized as follows:

```
src/
  ├── api/
  │   ├── client.ts           # Base API client
  │   ├── middleware/         # API middleware
  │   │   ├── auth.ts         # Authentication middleware
  │   │   └── error-handling.ts # Error handling middleware
  ├── features/
  │   ├── auth/
  │   │   ├── api/            # Auth-specific API functions
  │   ├── bookings/
  │   │   ├── api/            # Bookings-specific API functions
  │   ├── services/
  │   │   ├── api/            # Services-specific API functions
  │   └── users/
  │       ├── api/            # Users-specific API functions
```

## API Client

The base API client (`src/api/client.ts`) provides a consistent interface for making HTTP requests:

```typescript
import { apiClient } from '@/api/client';

// Example usage
const data = await apiClient('/api/services');
```

## Error Handling

API errors are handled consistently using the error handling middleware:

```typescript
import { withErrorHandling } from '@/api/middleware/error-handling';

export const GET = withErrorHandling(async (req) => {
  // Route handler implementation
});
```

## Authentication

Protected routes use the authentication middleware:

```typescript
import { withAuth } from '@/api/middleware/auth';

export const GET = withAuth(async (req) => {
  // Route handler implementation with authenticated user
  const { user } = req;
});
```

## Response Format

API responses follow a consistent format:

```json
{
  "data": {}, // The response data
  "error": null, // Error message if applicable
  "success": true // Whether the request was successful
}
```

## Feature-Specific API Functions

Each feature has its own API functions in the `api` directory:

```typescript
// src/features/services/api/servicesApi.ts
export async function fetchServices(category?: string) {
  // Implementation
}
```

These functions are used by the feature's hooks and components.
