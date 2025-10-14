# Registration Form

A comprehensive registration form built with Next.js, React, TypeScript, and Tailwind CSS, featuring client-side validation and unit tests.

## 📋 Project Overview

This project implements a registration form with the following requirements:

- Four input fields: First Name, Last Name, Email, and Password
- Client-side validation for all fields
- Gmail-only email validation
- Strong password requirements
- Multiple form states (idle, warning, error, success)
- Full accessibility support (ARIA attributes)
- Comprehensive unit tests

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd registration-form
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Running with API

To use the full-stack application with the API:

1. Start the API server (in one terminal)
```bash
npm run dev:api
```

2. Start the Next.js frontend (in another terminal)
```bash
npm run dev
```

Or run both simultaneously:
```bash
npm run dev:all
```

The API will run on `http://localhost:3001` and the frontend on `http://localhost:3000`.

### Available Scripts

**Frontend:**
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server

**API:**
- `npm run dev:api` - Start API server in watch mode
- `npm run start:api` - Start API server
- `npm run dev:all` - Run both frontend and API

**Testing:**
- `npm test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

**Other:**
- `npm run lint` - Run ESLint

## 🎯 Problem-Solving Approach

### 1. Understanding Requirements

I started by breaking down the requirements into clear, actionable items:

- Field validation rules
- Form states needed
- User experience considerations
- Accessibility requirements

### 2. Planning the Architecture

Instead of building everything in one large component, I used **separation of concerns**:

```
src/
├── app/components/RegistrationForm/
│   ├── index.tsx           # Main component (UI only)
│   ├── types.ts            # Type definitions
│   ├── validation.ts       # Validation logic
│   └── *.test.tsx         # Component tests
└── hooks/
    └── useFormValidation.ts # Form state management
```

**Why this structure?**

- **Easier to understand**: Each file has one responsibility
- **Easier to test**: Small, focused units are simpler to test
- **Easier to maintain**: Changes are isolated to specific files
- **Reusable**: Validation logic and hooks can be used elsewhere

### 3. Implementation Steps

#### Step 1: Define Types (`types.ts`)

Started with TypeScript types to ensure type safety:

```typescript
export type FormState = 'idle' | 'warning' | 'error' | 'success';
export interface FormData { ... }
export interface FormErrors { ... }
```

**Learning**: Define types first - it helps you think through the data structure.

#### Step 2: Build Validation Logic (`validation.ts`)

Created pure functions for validation - they don't depend on React:

```typescript
export const validateField = (name: string, value: string) => { ... }
export const validateForm = (formData: FormData) => { ... }
```

**Why pure functions?**

- Easier to test (no React needed)
- Predictable (same input = same output)
- Reusable in different contexts

#### Step 3: Create Custom Hook (`useFormValidation.ts`)

Separated form logic from UI:

```typescript
export const useFormValidation = (initialData) => {
  // All state management here
  return { formData, errors, handleChange, handleSubmit, ... }
}
```

**Benefits**:

- Component stays clean and focused on rendering
- Logic can be reused in other components
- Easier to test separately

#### Step 4: Build UI Component (`index.tsx`)

The component only handles presentation:

```typescript
export default function RegistrationForm() {
  const { formData, errors, handleChange, ... } = useFormValidation(...)
  return <form>...</form>
}
```

### 4. Validation Strategy

I implemented **progressive validation** for better UX:

1. **On Load (Idle State)**: No errors shown, form is clean
2. **On Blur**: Validate field when user leaves it
3. **After Touch**: Continue validating as user types to give immediate feedback
4. **On Submit**: Validate all fields and show appropriate state

**Why not validate immediately on typing?**

- It's annoying for users to see errors before they finish typing
- Blur validation gives them a chance to complete the field first

### 5. Email Validation Logic

**Requirement**: Only Gmail addresses allowed, "test@gmail.com" already registered

```typescript
// Check if it's Gmail
const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i
if (!gmailRegex.test(value)) {
  return 'Only Gmail addresses are accepted'
}

// Check if already registered
if (value.toLowerCase() === 'test@gmail.com') {
  return 'This email is already registered'
}
```

**Learning**: Validate in order - format first, then business rules.

### 6. Password Validation

Password must have:

- 8-30 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character

```typescript
if (value.length < 8 || value.length > 30) {
  return 'Password must be between 8 and 30 characters';
}
if (!/[a-z]/.test(value)) { ... }
if (!/[A-Z]/.test(value)) { ... }
// etc.
```

**Why separate checks?**

- Give specific feedback to users
- Easier to understand what's wrong
- Each check is simple and testable

### 7. Form States

Implemented four distinct states following web standards:

| State       | When                     | Visual        |
| ----------- | ------------------------ | ------------- |
| **Idle**    | Initial load             | No message    |
| **Warning** | Field blur with error    | Yellow banner |
| **Error**   | Submit with invalid data | Red banner    |
| **Success** | Valid submission         | Green banner  |

**Learning**: Clear visual feedback helps users understand what to do.

### 8. Accessibility (ARIA)

Added proper ARIA attributes for screen readers:

```typescript
aria-invalid={touched.firstName && !!errors.firstName}
aria-describedby={errors.firstName ? 'firstName-error' : undefined}
```

**Why accessibility matters?**

- Everyone should be able to use your form
- It's a legal requirement in many places
- Good ARIA also helps with testing

### 9. Testing Strategy

Wrote tests at three levels:

1. **Unit Tests (validation.ts)**: Test pure functions

   - Fast to run
   - Easy to write
   - High confidence in logic

2. **Hook Tests (useFormValidation.ts)**: Test state management

   - Test React hooks in isolation
   - Verify state changes

3. **Component Tests (index.tsx)**: Test user interactions
   - Simulate real user behavior
   - Test full integration

**Total: 49 tests covering all scenarios**

**Learning**: Test small units first, then integration. It's easier to debug.

## 🏗️ Project Structure

```
registration-form/
├── api/                                   # Node.js API
│   ├── models/
│   │   └── User.ts                        # User model & storage
│   ├── routes/
│   │   ├── auth.ts                        # Auth endpoints
│   │   └── auth.test.ts                   # API tests
│   ├── utils/
│   │   └── validation.ts                  # API validation
│   └── server.ts                          # Express server
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── RegistrationForm/
│   │   │       ├── index.tsx              # Main form component
│   │   │       ├── index.test.tsx         # Component tests
│   │   │       ├── types.ts               # TypeScript types
│   │   │       ├── validation.ts          # Client validation
│   │   │       └── validation.test.ts     # Validation tests
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── hooks/
│   │   ├── useFormValidation.ts           # Custom form hook
│   │   └── useFormValidation.test.ts      # Hook tests
│   └── services/
│       └── api.ts                         # API client
├── vitest.config.ts                       # Vitest configuration
├── vitest.setup.ts                        # Test setup
└── package.json
```

## 📝 Validation Rules

### First Name & Last Name

- ✅ Required
- ✅ Cannot be empty or whitespace only

### Email

- ✅ Required
- ✅ Must be a Gmail address (@gmail.com)
- ✅ Cannot be "test@gmail.com" (already registered)
- ❌ Other email providers rejected (Yahoo, Outlook, etc.)

### Password

- ✅ Required
- ✅ 8-30 characters long
- ✅ At least one lowercase letter (a-z)
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one number (0-9)
- ✅ At least one special character (!@#$%^&\*...)

## 🧪 Testing

This project uses **Vitest** with React Testing Library.

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Coverage

**Frontend Tests:**
- ✅ 26 validation tests
- ✅ 10 hook tests
- ✅ 13 component/integration tests

**API Tests:**
- ✅ 10 API endpoint tests

**Total: 59 tests**

## 🛠️ Technologies Used

**Frontend:**
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

**Backend:**
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **TypeScript** - Type safety

**Testing:**
- **Vitest** - Testing framework
- **React Testing Library** - Component testing
- **Supertest** - API testing

**Development:**
- **ESLint** - Code linting
- **tsx** - TypeScript execution

## 🔌 API Documentation

### Base URL
```
http://localhost:3001
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 2. Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@gmail.com",
  "password": "Password123!"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@gmail.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Only Gmail addresses are accepted"
    }
  ]
}
```

**Duplicate Email Response (409):**
```json
{
  "success": false,
  "message": "Email already registered",
  "errors": [
    {
      "field": "email",
      "message": "This email is already registered"
    }
  ]
}
```

#### 3. Get All Users (Testing)
```http
GET /api/auth/users
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "firstName": "Test",
      "lastName": "User",
      "email": "test@gmail.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### API Architecture

The API follows a clean architecture pattern:

1. **Routes (`api/routes/`)**: Handle HTTP requests and responses
2. **Models (`api/models/`)**: Define data structures and storage
3. **Utils (`api/utils/`)**: Reusable validation and helper functions
4. **Server (`api/server.ts`)**: Express app configuration and middleware

### Key Features

- ✅ **RESTful API design**
- ✅ **Server-side validation** (same rules as client)
- ✅ **CORS enabled** for frontend communication
- ✅ **Type-safe** with TypeScript
- ✅ **In-memory storage** (easy to swap with real database)
- ✅ **Comprehensive tests** with Supertest
- ✅ **Error handling** with proper status codes

### Why Build an API?

1. **Real-world experience**: Most applications need a backend
2. **Full-stack skills**: Shows you can work on both ends
3. **Validation**: Demonstrates understanding of client + server validation
4. **Architecture**: Clean separation between frontend and backend
5. **Testing**: Different testing strategies for API vs UI

---