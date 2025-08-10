import { useState } from "react";
import LoginForm from "../components/auth/LoginInForm";
import { useAuth } from "../contexts/AuthContext";
import { validateAuthForm } from "../utils/auth/validateAuthForm";

/**
 * LoginPage component for user login
 * @returns {JSX.Element}
 */
export default function LoginPage() {
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const { signIn } = useAuth();

  const handleSignIn = async (email, password) => {
    const validationErrors = validateAuthForm({ email, password }, "login");

    if (validationErrors.email || validationErrors.password) {
      setErrors(validationErrors);
      return;
    }

    try {
      await signIn(email, password);
      // Redirect or show success message after successful login
    } catch (error) {
      // Handle login errors
      setErrors({
        ...validationErrors,
        general: "Login failed. Please try again.",
      });
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleSignIn} errors={errors} />
    </div>
  );
}
