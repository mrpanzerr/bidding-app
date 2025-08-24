import { useState } from "react";
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  const handleSignIn = async (email, password) => {
    const validationErrors = validateAuthForm({ email, password }, "login");

    if (validationErrors.email || validationErrors.password) {
      setErrors(validationErrors);
      return;
    }

    try {
      await signIn(email, password);
      navigateToDashboard();
    } catch (error) {
      // Handle login errors
      setErrors({
        ...validationErrors,
      });
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleSignIn} errors={errors} />
    </div>
  );
}
