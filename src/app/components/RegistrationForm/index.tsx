'use client';

import { useFormValidation } from '@/hooks/useFormValidation';
import { FormErrors } from './types';

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

export default function RegistrationForm() {
  const { formData, errors, touched, formState, handleChange, handleBlur, handleSubmit } =
    useFormValidation(initialFormData);

  const getFieldClassName = (fieldName: string) => {
    const baseClass = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2';
    const hasError = touched[fieldName] && errors[fieldName as keyof FormErrors];

    if (hasError) {
      return `${baseClass} border-red-500 focus:ring-red-500`;
    }

    return `${baseClass} border-gray-300 focus:ring-blue-500`;
  };

  const getFormStateMessage = () => {
    switch (formState) {
      case 'warning':
        return (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
            Please review the form and correct any errors.
          </div>
        );
      case 'error':
        return (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
            Unable to submit. Please fix all errors before continuing.
          </div>
        );
      case 'success':
        return (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
            Registration successful! Your account has been created.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Registration</h2>

      {getFormStateMessage()}

      <div>
        <label htmlFor="firstName" className="block text-sm font-medium mb-1">
          First Name *
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getFieldClassName('firstName')}
          aria-invalid={touched.firstName && !!errors.firstName}
          aria-describedby={errors.firstName ? 'firstName-error' : undefined}
        />
        {touched.firstName && errors.firstName && (
          <p id="firstName-error" className="mt-1 text-sm text-red-600">
            {errors.firstName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium mb-1">
          Last Name *
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getFieldClassName('lastName')}
          aria-invalid={touched.lastName && !!errors.lastName}
          aria-describedby={errors.lastName ? 'lastName-error' : undefined}
        />
        {touched.lastName && errors.lastName && (
          <p id="lastName-error" className="mt-1 text-sm text-red-600">
            {errors.lastName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getFieldClassName('email')}
          aria-invalid={touched.email && !!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {touched.email && errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password *
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getFieldClassName('password')}
          aria-invalid={touched.password && !!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {touched.password && errors.password && (
          <p id="password-error" className="mt-1 text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={formState === 'success'}
      >
        {formState === 'success' ? 'Registered' : 'Register'}
      </button>
    </form>
  );
}
