import { useState } from "react";
import SignUpForm from "../components/auth/SignUpForm";
import { useAuth } from "../contexts/AuthContext";
import { validateAuthForm } from "../utils/auth/validateAuthForm";

/**
 * SignUpPage component for user registration
 * @returns {JSX.Element}
 */
export default function SignUpPage() {
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signUp } = useAuth();

  const handleSignUp = async (email, password, confirmPassword) => {
    const validationErrors = validateAuthForm(
      { email, password, confirmPassword },
      "signup"
    );

    if (validationErrors.email ||
      validationErrors.password ||
      validationErrors.confirmPassword
    ) {
      setErrors(validationErrors);
      return;
    }

    try {
      await signUp(email, password);
      // Redirect or show success message after successful sign-up
    } catch (error) {
      // Handle sign-up errors
      setErrors({
        ...validationErrors,
        general: "Sign up failed. Please try again.",
      });
    }
  };

  return (
    <div>
      <SignUpForm onSubmit={handleSignUp} errors={errors} />
    </div>
  );
}
