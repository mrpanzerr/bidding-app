import { useState } from "react";
import SignUpForm from "../components/auth/signUpForm";
import { useAuth } from "../contexts/AuthContext";
import { validateSignUpForm } from "../utils/validateSignUpForm";

// SignUpPage component for user registration
export default function SignUpPage() {
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const { signUp } = useAuth();

  const handleSignUp = async (email, password, confirmPassword) => {
    const fieldErrors = validateSignUpForm(email, password, confirmPassword);

    if (
      fieldErrors.email ||
      fieldErrors.password ||
      fieldErrors.confirmPassword
    ) {
      setErrors({ ...fieldErrors, general: "" });
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
        general: error.message,
      });
    }
  };

  return (
    <div>
      <SignUpForm onSubmit={handleSignUp} errors={errors} />
    </div>
  );
}
