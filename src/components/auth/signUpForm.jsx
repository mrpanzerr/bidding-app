import { useState } from "react";
import { validateAuthForm } from "../../utils/auth/validateAuthForm";
import AuthForm from "./AuthForm";

/**
 * SignUpForm component for user registration
 * @param {object} props
 * @param {(formData: {email: string, password: string}) => Promise<void>} props.onSubmit
 */
export default function SignUpForm({ onSubmit }) {
  const [errors, setErrors] = useState({});

  // Wrap onSubmit to handle form validation if needed
  const handleSubmit = async ({ email, password, confirmPassword }) => {
    // Example validation (you can replace this with your own)
    const newErrors = validateAuthForm({ email, password, confirmPassword }, "signup");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(email, password, confirmPassword);
  };

  return (
    <AuthForm
      initialValues={{ email: "", password: "", confirmPassword: "" }}
      onSubmit={handleSubmit}
      errors={errors}
      submitLabel="Sign Up"
      showConfirmPassword={true}
    />
  );
}
