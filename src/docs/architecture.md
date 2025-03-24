# Project Architecture

## Overview

This project follows a feature-based architecture, organizing code by business domain rather than technical role. This approach makes the codebase more maintainable, scalable, and easier to navigate.

## Directory Structure

```
src/
  ├── features/           # Feature-based organization
  │   ├── auth/           # Authentication feature
  │   ├── bookings/       # Bookings feature
  │   ├── services/       # Services feature
  │   └── users/          # Users feature
  ├── api/                # API client and middleware
  ├── components/         # Shared UI components
  ├── constants/          # Application constants
  ├── hooks/              # Custom React hooks
  ├── lib/                # Utility libraries
  ├── store/              # State management
  ├── types/              # TypeScript type definitions
  └── utils/              # Utility functions
```

## Features

Each feature directory contains:

- `components/`: UI components specific to the feature
- `api/`: API functions for the feature
- `hooks/`: Custom hooks for the feature
- `utils/`: Utility functions specific to the feature

## State Management

The application uses React Context API for global state management. The store is organized in the `src/store` directory.

## API Layer

The API layer is organized in the `src/api` directory, with middleware for error handling and authentication.

## Type System

The application uses TypeScript for type safety. Type definitions are organized in the `src/types` directory.

## Styling

The application uses Tailwind CSS for styling.

## Testing

Tests are organized alongside the code they test, following the feature-based structure.
