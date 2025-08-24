import { useState } from "react";
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

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
      navigateToDashboard();
    } catch (error) {
      // Handle sign-up errors
      setErrors({
        ...validationErrors,
      });
    }
  };

  return (
    <div>
      <SignUpForm onSubmit={handleSignUp} errors={errors} />
    </div>
  );
}
