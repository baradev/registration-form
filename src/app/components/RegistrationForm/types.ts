export type FormState = 'idle' | 'warning' | 'error' | 'success';

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export type FormField = keyof FormData;
