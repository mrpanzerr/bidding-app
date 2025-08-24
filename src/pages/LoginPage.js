import { useState } from "react";
import { useNavigate } from "react-router";
import AuthForm from "../components/auth/AuthForm";
import { useAuth } from "../contexts/AuthContext";
import { validateAuthForm } from "../utils/auth/validateAuthForm";

/**
 * LoginPage component handles user login.
 * Renders the AuthForm for login and manages validation and submission.
 *
 * @returns {JSX.Element} Login page component.
 */
export default function LoginPage() {
  // State for form field errors and general error messages
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { signIn } = useAuth();
  const navigate = useNavigate();

  /**
   * Navigate to the dashboard after successful login.
   */
  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  /**
   * Handle login form submission, validate input fields, and sign in the user.
   *
   * @param {string} email - User email input
   * @param {string} password - User password input
   */
  const handleSignIn = async (email, password) => {
    // Validate email and password fields
    const validationErrors = validateAuthForm({ email, password }, "login");

    if (validationErrors.email || validationErrors.password) {
      setErrors(validationErrors);
      return;
    }

    try {
      await signIn(email, password);
      navigateToDashboard();
    } catch (error) {
      // Set general login failure message
      setErrors({
        ...validationErrors,
        general: "Failed to log in. Please try again.",
      });
    }
  };

  return (
    <AuthForm
      onSubmit={(formValues) =>
        handleSignIn(formValues.email, formValues.password)
      }
      errors={errors}
      showLogin={true}       // Display login button
      showSignUp={true}      // Display signup button for navigation
      showGuest={true}       // Optional guest access button
      pageType="login"       // Sets form title and behavior
    />
  );
}
