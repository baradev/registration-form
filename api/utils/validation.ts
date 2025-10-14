export interface ValidationError {
  field: string;
  message: string;
}

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

export const validateRegistrationData = (data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  // First Name validation
  if (!data.firstName || !data.firstName.trim()) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }

  // Last Name validation
  if (!data.lastName || !data.lastName.trim()) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }

  // Email validation
  if (!data.email || !data.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!GMAIL_REGEX.test(data.email)) {
    errors.push({ field: 'email', message: 'Only Gmail addresses are accepted' });
  }

  // Password validation
  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else {
    if (data.password.length < 8 || data.password.length > 30) {
      errors.push({
        field: 'password',
        message: 'Password must be between 8 and 30 characters',
      });
    }

    if (!/[a-z]/.test(data.password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one lowercase letter',
      });
    }

    if (!/[A-Z]/.test(data.password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one uppercase letter',
      });
    }

    if (!/[0-9]/.test(data.password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one number',
      });
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(data.password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one special character',
      });
    }
  }

  return errors;
};
