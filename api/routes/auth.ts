import { Router, Request, Response } from 'express';
import { userStorage } from '../models/User';
import { validateRegistrationData } from '../utils/validation';

const router = Router();

// POST /api/auth/register
router.post('/register', (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    const validationErrors = validateRegistrationData({
      firstName,
      lastName,
      email,
      password,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Check if email already exists
    const existingUser = userStorage.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
        errors: [{ field: 'email', message: 'This email is already registered' }],
      });
    }

    // Create user
    const user = userStorage.create({
      firstName,
      lastName,
      email,
      password, // In production, hash the password before storing
    });

    // Return success (excluding password)
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// GET /api/auth/users (for testing purposes)
router.get('/users', (_req: Request, res: Response) => {
  const users = userStorage.getAll().map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt,
  }));

  return res.json({
    success: true,
    data: users,
  });
});

export default router;