import { useState } from "react";
import SignUpForm from "../components/auth/SignUpForm";
import { useAuth } from "../contexts/AuthContext";
import { validateSignUpForm } from "../utils/validateSignUpForm";

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
    const fieldErrors = validateSignUpForm(email, password, confirmPassword);

    if (
      fieldErrors.email ||
      fieldErrors.password ||
      fieldErrors.confirmPassword
    ) {
      setErrors({ ...fieldErrors });
      return;
    }

    try {
      await signUp(email, password);
      // Redirect or show success message after successful sign-up
      alert("User signed up successfully");
    } catch (error) {
      // Handle sign-up errors
      setErrors({
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div>
      <SignUpForm onSubmit={handleSignUp} errors={errors} />
    </div>
  );
}
