import { useState } from "react";
import { useNavigate } from "react-router";
import AuthForm from "../components/auth/AuthForm";
import { useAuth } from "../contexts/AuthContext";
import { validateAuthForm } from "../utils/auth/validateAuthForm";

/**
 * SignupPage component handles user registration.
 * It renders the AuthForm for signup and manages form validation and submission.
 *
 * @returns {JSX.Element} Signup page component.
 */
export default function SignupPage() {
  // State for field-specific and general errors
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const { signUp } = useAuth();
  const navigate = useNavigate();

  /**
   * Navigate to the user dashboard after successful signup.
   */
  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  /**
   * Handle signup form submission, validate fields, and register user.
   *
   * @param {string} email - User email input
   * @param {string} password - User password input
   * @param {string} confirmPassword - User confirm password input
   */
  const handleSignUp = async (email, password, confirmPassword) => {
    // Validate form inputs
    const validationErrors = validateAuthForm(
      { email, password, confirmPassword },
      "signup"
    );

    if (validationErrors.email || validationErrors.password || validationErrors.confirmPassword) {
      setErrors(validationErrors);
      return;
    }

    try {
      await signUp(email, password);
      navigateToDashboard();
    } catch (error) {
      // Show general signup failure message
      setErrors({
        ...validationErrors,
        general: "Failed to sign up. Please try again.",
      });
    }
  };

  return (
    <AuthForm
      onSubmit={(formValues) =>
        handleSignUp(
          formValues.email,
          formValues.password,
          formValues.confirmPassword
        )
      }
      errors={errors}
      showConfirmPassword={true}   // Show confirm password input for signup
      showLogin={true}             // Include login button for navigation
      showSignUp={true}            // Include signup button
      showGuest={true}             // Optional guest access button
      pageType="signup"            // Determines form title and behavior
    />
  );
}
