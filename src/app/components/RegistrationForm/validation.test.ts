import { describe, it, expect } from 'vitest';
import { validateField, validateForm } from './validation';

describe('validateField', () => {
  describe('firstName validation', () => {
    it('should return error when firstName is empty', () => {
      expect(validateField('firstName', '')).toBe('First name is required');
    });

    it('should return error when firstName is only whitespace', () => {
      expect(validateField('firstName', '   ')).toBe('First name is required');
    });

    it('should return undefined when firstName is valid', () => {
      expect(validateField('firstName', 'John')).toBeUndefined();
    });
  });

  describe('lastName validation', () => {
    it('should return error when lastName is empty', () => {
      expect(validateField('lastName', '')).toBe('Last name is required');
    });

    it('should return error when lastName is only whitespace', () => {
      expect(validateField('lastName', '   ')).toBe('Last name is required');
    });

    it('should return undefined when lastName is valid', () => {
      expect(validateField('lastName', 'Doe')).toBeUndefined();
    });
  });

  describe('email validation', () => {
    it('should return error when email is empty', () => {
      expect(validateField('email', '')).toBe('Email is required');
    });

    it('should return error when email is not Gmail', () => {
      expect(validateField('email', 'test@yahoo.com')).toBe(
        'Only Gmail addresses are accepted'
      );
    });

    it('should return error when email is not Gmail (outlook)', () => {
      expect(validateField('email', 'user@outlook.com')).toBe(
        'Only Gmail addresses are accepted'
      );
    });

    it('should return error when email is already registered', () => {
      expect(validateField('email', 'test@gmail.com')).toBe(
        'This email is already registered'
      );
    });

    it('should return error when email is already registered (case insensitive)', () => {
      expect(validateField('email', 'TEST@GMAIL.COM')).toBe(
        'This email is already registered'
      );
    });

    it('should return undefined when email is valid Gmail', () => {
      expect(validateField('email', 'user@gmail.com')).toBeUndefined();
    });

    it('should return undefined when email is valid Gmail with dots', () => {
      expect(validateField('email', 'user.name@gmail.com')).toBeUndefined();
    });

    it('should return undefined when email is valid Gmail with plus', () => {
      expect(validateField('email', 'user+tag@gmail.com')).toBeUndefined();
    });
  });

  describe('password validation', () => {
    it('should return error when password is empty', () => {
      expect(validateField('password', '')).toBe('Password is required');
    });

    it('should return error when password is too short', () => {
      expect(validateField('password', 'Aa1!')).toBe(
        'Password must be between 8 and 30 characters'
      );
    });

    it('should return error when password is too long', () => {
      const longPassword = 'A'.repeat(31) + 'a1!';
      expect(validateField('password', longPassword)).toBe(
        'Password must be between 8 and 30 characters'
      );
    });

    it('should return error when password has no lowercase', () => {
      expect(validateField('password', 'ABCDEF123!')).toBe(
        'Password must contain at least one lowercase letter'
      );
    });

    it('should return error when password has no uppercase', () => {
      expect(validateField('password', 'abcdef123!')).toBe(
        'Password must contain at least one uppercase letter'
      );
    });

    it('should return error when password has no number', () => {
      expect(validateField('password', 'Abcdefgh!')).toBe(
        'Password must contain at least one number'
      );
    });

    it('should return error when password has no special character', () => {
      expect(validateField('password', 'Abcdef123')).toBe(
        'Password must contain at least one special character'
      );
    });

    it('should return undefined when password is valid', () => {
      expect(validateField('password', 'Password123!')).toBeUndefined();
    });

    it('should return undefined when password has various special characters', () => {
      expect(validateField('password', 'Pass@word1')).toBeUndefined();
      expect(validateField('password', 'Pass#word1')).toBeUndefined();
      expect(validateField('password', 'Pass$word1')).toBeUndefined();
    });
  });
});

describe('validateForm', () => {
  it('should return no errors for valid form data', () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
      password: 'Password123!',
    };

    const errors = validateForm(formData);
    expect(errors).toEqual({});
  });

  it('should return errors for all invalid fields', () => {
    const formData = {
      firstName: '',
      lastName: '',
      email: 'invalid@yahoo.com',
      password: '123',
    };

    const errors = validateForm(formData);
    expect(errors).toHaveProperty('firstName');
    expect(errors).toHaveProperty('lastName');
    expect(errors).toHaveProperty('email');
    expect(errors).toHaveProperty('password');
  });

  it('should return error for registered email', () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@gmail.com',
      password: 'Password123!',
    };

    const errors = validateForm(formData);
    expect(errors).toEqual({
      email: 'This email is already registered',
    });
  });
});