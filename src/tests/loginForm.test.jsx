import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import LoginForm from "../components/auth/LoginInForm";

describe("LoginForm", () => {
  test("renders email, password fields and login button", () => {
    render(<LoginForm onSubmit={() => {}} errors={{}} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/confirm password/i)
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  test("calls onSubmit with input values", () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} errors={{}} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    expect(handleSubmit).toHaveBeenCalledWith(
      "user@example.com",
      "password123"
    );
  });

  test("displays error messages if errors are passed", () => {
    const errors = {
      email: "Email is required.",
      password: "Password is required.",
    };

    render(<LoginForm onSubmit={() => {}} errors={errors} />);

    expect(screen.getByText(errors.email)).toBeInTheDocument();
    expect(screen.getByText(errors.password)).toBeInTheDocument();
  });
});
