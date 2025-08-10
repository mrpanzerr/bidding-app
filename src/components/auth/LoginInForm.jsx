import { useState } from "react";
import AuthForm from "./AuthForm";

/**
 * LoginForm component for user login
 * @param {object} props
 * @param {(formData: {email: string, password: string}) => Promise<void>} props.onSubmit
 */
export default function LoginForm({ onSubmit }) {
  const [errors, setErrors] = useState({});

  const handleSubmit = async ({ email, password }) => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({ email, password });
  }; 

  return (
    <AuthForm
      initialValues={{ email: "", password: "" }}
      onSubmit={handleSubmit}
      errors={errors}
      submitLabel="Log In"
      showConfirmPassword={false}
    />
  );
}
