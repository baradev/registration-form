# Registration Form

A registration form built with Next.js, React, and TypeScript featuring client-side validation and comprehensive tests.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Available commands**:
- `npm run dev` - Start the development server
- `npm test` - Run all tests

## Requirements Met

- React + TypeScript + Next.js
- Four fields: First Name, Last Name, Email, Password
- Client-side validation for all fields
- Gmail-only email validation
- `test@gmail.com` marked as already registered
- Password: 8-30 chars, lowercase, uppercase, number, special character
- Form states: idle, warning, error, success
- 59 unit tests with Vitest

## Validation Rules

**First Name & Last Name**: Required, cannot be empty

**Email**:

- Required
- Must be Gmail (@gmail.com)
- `test@gmail.com` is already registered

**Password**:

- 8-30 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character

## Testing

```bash
npm test  # Run all tests
```

**Test Coverage**: 59 tests total

- 26 validation tests
- 10 hook tests
- 13 component tests
- 10 API tests

## Architecture

```
src/
├── app/components/RegistrationForm/
│   ├── index.tsx         # UI component
│   ├── types.ts          # TypeScript types
│   ├── validation.ts     # Validation logic
│   └── *.test.tsx        # Tests
└── hooks/
    └── useFormValidation.ts  # Form state management
```

**Design approach**: Separation of concerns - validation logic, types, UI, and state management are separated into focused files for maintainability and testability.

## AI Usage

**How much AI was used**:

- I created the initial plan based on my knowledge and best practices from the industry, then I chatted about the approach with Claude Code
- I created some of the tests then asked Claude to create a few more based on my specification
- I provided architecture decisions, UX strategy, and complexity management
- Used AI more as an assistant for faster work and debugging

## Areas for Improvement

**Security**: Hash passwords with bcrypt, add HTTPS/TLS

**UX**: Password strength meter, show/hide password toggle, better loading states

**PostgreSQL**: Next step could include PostgreSQL database integration

## API (Extra)

The project includes a Node.js/Express API backend with in-memory storage. The API is optional - all form validation works client-side.

**Note**: The API can be run locally but is not configured for CodeSandbox.

API endpoints (when running locally on `http://localhost:3001`):

- `POST /api/auth/register` - Register new user
- `GET /api/auth/users` - Get all registered users (for testing)
- `GET /api/health` - Health check

**In-Memory Database**: User data is stored in a simple array-based storage (`api/models/User.ts`). The storage includes a pre-existing user (`test@gmail.com`) to demonstrate the "already registered" validation. Data persists only while the server is running.

**API Testing**: Includes 10 comprehensive API tests using Supertest covering:
- Successful user registration
- Duplicate email validation
- Server-side validation for all fields
- Error responses with proper HTTP status codes

## Technologies

- Next.js 15 + React 19
- TypeScript
- Tailwind CSS
- Vitest + React Testing Library
- Express (API only)
