import { FormData, FormErrors, FormField } from './types';

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
const REGISTERED_EMAILS = ['test@gmail.com'];

export const validateField = (name: string, value: string): string | undefined => {
  switch (name) {
    case 'firstName':
    case 'lastName':
      if (!value.trim()) {
        return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
      }
      break;

    case 'email':
      if (!value.trim()) {
        return 'Email is required';
      }

      // Check if it's a Gmail address
      if (!GMAIL_REGEX.test(value)) {
        return 'Only Gmail addresses are accepted';
      }

      // Check if email is already registered
      if (REGISTERED_EMAILS.includes(value.toLowerCase())) {
        return 'This email is already registered';
      }
      break;

    case 'password':
      if (!value) {
        return 'Password is required';
      }

      if (value.length < 8 || value.length > 30) {
        return 'Password must be between 8 and 30 characters';
      }

      if (!/[a-z]/.test(value)) {
        return 'Password must contain at least one lowercase letter';
      }

      if (!/[A-Z]/.test(value)) {
        return 'Password must contain at least one uppercase letter';
      }

      if (!/[0-9]/.test(value)) {
        return 'Password must contain at least one number';
      }

      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
        return 'Password must contain at least one special character';
      }
      break;
  }

  return undefined;
};

export const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  (Object.keys(formData) as FormField[]).forEach((key) => {
    const error = validateField(key, formData[key]);
    if (error) {
      errors[key] = error;
    }
  });

  return errors;
};
