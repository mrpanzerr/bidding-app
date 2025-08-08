import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import SignUpForm from '../components/auth/signUpForm';

describe('SignUpForm', () => {
  test('renders all fields and button', () => {
    render(<SignUpForm onSubmit={() => {}} errors={{}} />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('calls onSubmit with input values', () => {
    const handleSubmit = jest.fn();
    render(<SignUpForm onSubmit={handleSubmit} errors={{}} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(signUpButton);

    expect(handleSubmit).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      'password123'
    );
  });

  test('displays error messages if errors are passed', () => {
    const errors = {
      email: 'Invalid email',
      password: 'Too short',
      confirmPassword: 'Does not match',
      general: 'Sign up failed',
    };

    render(<SignUpForm onSubmit={() => {}} errors={errors} />);
    expect(screen.getByText(errors.email)).toBeInTheDocument();
    expect(screen.getByText(errors.password)).toBeInTheDocument();
    expect(screen.getByText(errors.confirmPassword)).toBeInTheDocument();
    expect(screen.getByText(errors.general)).toBeInTheDocument();
  });
});
