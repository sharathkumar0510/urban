# Getting Started

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account and project

## Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in the required environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
```

3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## Project Structure

The project follows a feature-based architecture. See the [Architecture Documentation](./architecture.md) for details.

## Development Workflow

1. **Create a new feature**:
   - Create a new directory in `src/features`
   - Add components, API functions, hooks, and utils as needed

2. **Add a new page**:
   - Create a new file in `src/app`
   - Import components from the relevant features

3. **Add a new API endpoint**:
   - Create a new file in `src/app/api`
   - Use the API middleware for error handling and authentication

## Testing

Run tests with:

```bash
npm test
# or
yarn test
```

## Deployment

The application can be deployed to Vercel or any other Next.js-compatible hosting platform.

```bash
npm run build
# or
yarn build
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
