import AuthForm from "./AuthForm";

/**
 * SignUpForm component for user registration
 * @param {function} onSubmit - Function to handle form submission with email, password, and confirmPassword
 * @param {object} errors - Object containing error messages for the form fields
 */
export default function SignUpForm({ onSubmit, errors }) {
  // Wrap onSubmit to handle form validation if needed
  const handleSubmit = async ({ email, password, confirmPassword }) => {
    onSubmit(email, password, confirmPassword);
  };

  return (
    <AuthForm
      initialValues={{ email: "", password: "", confirmPassword: "" }}
      onSubmit={handleSubmit}
      errors={errors}
      showConfirmPassword={true}
    />
  );
}
