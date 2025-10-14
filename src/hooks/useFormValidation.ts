import { useState } from 'react';
import { FormData, FormErrors, FormState } from '@/app/components/RegistrationForm/types';
import { validateField, validateForm } from '@/app/components/RegistrationForm/validation';

export const useFormValidation = (initialData: FormData) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formState, setFormState] = useState<FormState>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field on change if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }

    // Reset form state when user starts typing after success
    if (formState === 'success') {
      setFormState('idle');
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    // Set warning state if there are any errors after blur
    if (error) {
      setFormState('warning');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({
        ...acc,
        [key]: true,
      }),
      {}
    );
    setTouched(allTouched);

    // Validate form
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    const isValid = Object.keys(validationErrors).length === 0;

    if (!isValid) {
      setFormState('error');
      return;
    }

    // Success
    setFormState('success');
    console.log('Form submitted successfully:', formData);
  };

  return {
    formData,
    errors,
    touched,
    formState,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};
