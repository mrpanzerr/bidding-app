import { useState } from "react";
import AuthForm from "./AuthForm"; // Adjust the path as needed

export default function SignUpForm({ onSubmit }) {
  const [errors, setErrors] = useState({});

  // Wrap onSubmit to handle form validation if needed
  const handleSubmit = ({ email, password, confirmPassword }) => {
    // Example validation (you can replace this with your own)
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

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
