import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationForm from './index';

describe('RegistrationForm', () => {
  it('should render all form fields', () => {
    render(<RegistrationForm />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('should display form in idle state initially', () => {
    render(<RegistrationForm />);

    expect(screen.queryByText(/please review the form/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/unable to submit/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/registration successful/i)).not.toBeInTheDocument();
  });

  it('should show error messages when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('should show error state banner when submitting invalid form', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    expect(await screen.findByText(/unable to submit/i)).toBeInTheDocument();
  });

  it('should show warning state when field loses focus with error', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.click(firstNameInput);
    await user.tab();

    expect(await screen.findByText(/please review the form/i)).toBeInTheDocument();
  });

  it('should validate email is Gmail only', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@yahoo.com');
    await user.tab();

    expect(await screen.findByText(/only gmail addresses are accepted/i)).toBeInTheDocument();
  });

  it('should reject registered email', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@gmail.com');
    await user.tab();

    expect(await screen.findByText(/this email is already registered/i)).toBeInTheDocument();
  });

  it('should validate password requirements', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'weak');
    await user.tab();

    expect(await screen.findByText(/password must be between 8 and 30 characters/i)).toBeInTheDocument();
  });

  it('should show success state when form is valid', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john.doe@gmail.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123!');

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    expect(await screen.findByText(/registration successful/i)).toBeInTheDocument();
  });

  it('should disable submit button after successful registration', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john.doe@gmail.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123!');

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    expect(await screen.findByRole('button', { name: /registered/i })).toBeDisabled();
  });

  it('should clear error when user corrects the field', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    const emailInput = screen.getByLabelText(/email/i);

    // Type invalid email
    await user.type(emailInput, 'test@yahoo.com');
    await user.tab();
    expect(await screen.findByText(/only gmail addresses are accepted/i)).toBeInTheDocument();

    // Clear and type valid email
    await user.clear(emailInput);
    await user.type(emailInput, 'valid@gmail.com');

    expect(screen.queryByText(/only gmail addresses are accepted/i)).not.toBeInTheDocument();
  });

  it('should apply error styling to invalid fields', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.click(firstNameInput);
    await user.tab();

    expect(firstNameInput).toHaveClass('border-red-500');
  });

  it('should set ARIA attributes when field has error', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.click(firstNameInput);
    await user.tab();

    expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
    expect(firstNameInput).toHaveAttribute('aria-describedby', 'firstName-error');
  });
});
