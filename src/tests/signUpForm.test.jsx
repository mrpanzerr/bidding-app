import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import SignUpForm from "../components/auth/SignUpForm";

describe("SignUpForm", () => {
  test("renders all fields and button", () => {
    render(<SignUpForm onSubmit={() => {}} errors={{}} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  test("calls onSubmit with input values", () => {
    const handleSubmit = jest.fn();
    render(<SignUpForm onSubmit={handleSubmit} errors={{}} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const signUpButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(signUpButton);

    expect(handleSubmit).toHaveBeenCalledWith(
      "test@example.com",
      "password123",
      "password123"
    );
  });

  test("displays error messages if errors are passed", () => {
    const errors = {
      email: "Email is required",
      password: "Password must be at least 6 characters",
      confirmPassword: "Confirm Password is required",
    };

    render(<SignUpForm onSubmit={() => {}} errors={errors} />);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(screen.getByText(errors.email)).toBeInTheDocument();
    expect(screen.getByText(errors.password)).toBeInTheDocument();
    expect(screen.getByText(errors.confirmPassword)).toBeInTheDocument();
  });
});
