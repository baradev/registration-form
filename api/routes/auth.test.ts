import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server';
import { userStorage } from '../models/User';

describe('Auth API', () => {
  beforeEach(() => {
    // Clear all users except the test user before each test
    userStorage.clear();
    userStorage.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@gmail.com',
      password: 'Password123!',
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Registration successful');
      expect(response.body.data).toMatchObject({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
      });
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should reject registration with missing firstName', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          lastName: 'Doe',
          email: 'john@gmail.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContainEqual({
        field: 'firstName',
        message: 'First name is required',
      });
    });

    it('should reject registration with invalid email (not Gmail)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@yahoo.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContainEqual({
        field: 'email',
        message: 'Only Gmail addresses are accepted',
      });
    });

    it('should reject registration with already registered email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@gmail.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already registered');
    });

    it('should reject registration with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@gmail.com',
          password: 'weak',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should reject password without uppercase letter', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@gmail.com',
          password: 'password123!',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContainEqual({
        field: 'password',
        message: 'Password must contain at least one uppercase letter',
      });
    });

    it('should reject password without special character', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@gmail.com',
          password: 'Password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContainEqual({
        field: 'password',
        message: 'Password must contain at least one special character',
      });
    });
  });

  describe('GET /api/auth/users', () => {
    it('should return all users', async () => {
      const response = await request(app).get('/api/auth/users');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should not include passwords in user data', async () => {
      const response = await request(app).get('/api/auth/users');

      expect(response.status).toBe(200);
      response.body.data.forEach((user: any) => {
        expect(user).not.toHaveProperty('password');
      });
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('API is running');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
