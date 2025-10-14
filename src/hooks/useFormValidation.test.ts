import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from './useFormValidation';

describe('useFormValidation', () => {
  const initialData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  it('should initialize with empty form data', () => {
    const { result } = renderHook(() => useFormValidation(initialData));

    expect(result.current.formData).toEqual(initialData);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.formState).toBe('idle');
  });

  it('should update form data on change', () => {
    const { result } = renderHook(() => useFormValidation(initialData));

    act(() => {
      const event = {
        target: { name: 'firstName', value: 'John' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });

    expect(result.current.formData.firstName).toBe('John');
  });

  it('should mark field as touched on blur', () => {
    const { result } = renderHook(() => useFormValidation(initialData));

    act(() => {
      const event = {
        target: { name: 'firstName', value: '' },
      } as React.FocusEvent<HTMLInputElement>;
      result.current.handleBlur(event);
    });

    expect(result.current.touched.firstName).toBe(true);
  });

  it('should show validation error on blur for invalid field', () => {
    const { result } = renderHook(() => useFormValidation(initialData));

    act(() => {
      const event = {
        target: { name: 'firstName', value: '' },
      } as React.FocusEvent<HTMLInputElement>;
      result.current.handleBlur(event);
    });

    expect(result.current.errors.firstName).toBe('First name is required');
    expect(result.current.formState).toBe('warning');
  });

  it('should validate on change after field is touched', () => {
    const { result } = renderHook(() => useFormValidation(initialData));

    // First blur to touch the field
    act(() => {
      const blurEvent = {
        target: { name: 'email', value: 'invalid' },
      } as React.FocusEvent<HTMLInputElement>;
      result.current.handleBlur(blurEvent);
    });

    // Then change the value
    act(() => {
      const changeEvent = {
        target: { name: 'email', value: 'valid@gmail.com' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(changeEvent);
    });

    expect(result.current.formData.email).toBe('valid@gmail.com');
    expect(result.current.errors.email).toBeUndefined();
  });

  it('should set error state on submit with invalid data', () => {
    const { result } = renderHook(() => useFormValidation(initialData));

    act(() => {
      const event = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent;
      result.current.handleSubmit(event);
    });

    expect(result.current.formState).toBe('error');
    expect(result.current.errors).not.toEqual({});
  });

  it('should set success state on submit with valid data', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@gmail.com',
      password: 'Password123!',
    };

    const { result } = renderHook(() => useFormValidation(validData));

    act(() => {
      const event = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent;
      result.current.handleSubmit(event);
    });

    expect(result.current.formState).toBe('success');
    expect(result.current.errors).toEqual({});
  });

  it('should mark all fields as touched on submit', () => {
    const { result } = renderHook(() => useFormValidation(initialData));

    act(() => {
      const event = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent;
      result.current.handleSubmit(event);
    });

    expect(result.current.touched.firstName).toBe(true);
    expect(result.current.touched.lastName).toBe(true);
    expect(result.current.touched.email).toBe(true);
    expect(result.current.touched.password).toBe(true);
  });

  it('should reset form state to idle when typing after success', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@gmail.com',
      password: 'Password123!',
    };

    const { result } = renderHook(() => useFormValidation(validData));

    // Submit to get success state
    act(() => {
      const submitEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent;
      result.current.handleSubmit(submitEvent);
    });

    expect(result.current.formState).toBe('success');

    // Type to reset state
    act(() => {
      const changeEvent = {
        target: { name: 'firstName', value: 'Jane' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(changeEvent);
    });

    expect(result.current.formState).toBe('idle');
  });

  it('should fail validation for registered email', () => {
    const dataWithRegisteredEmail = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@gmail.com',
      password: 'Password123!',
    };

    const { result } = renderHook(() => useFormValidation(dataWithRegisteredEmail));

    act(() => {
      const event = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent;
      result.current.handleSubmit(event);
    });

    expect(result.current.formState).toBe('error');
    expect(result.current.errors.email).toBe('This email is already registered');
  });
});
