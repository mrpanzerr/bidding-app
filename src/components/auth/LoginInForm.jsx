import AuthForm from "./AuthForm";

/**
 * LoginForm component for user login
 * @param {function} onSubmit - Function to handle form submission with email and password
 * @param {object} errors - Object containing error messages for the form fields
 */
export default function LoginForm({ onSubmit, errors }) {
  const handleSubmit = async ({ email, password }) => {
    onSubmit(email, password);
  };

  return (
    <AuthForm
      initialValues={{ email: "", password: "" }}
      onSubmit={handleSubmit}
      errors={errors}
      showConfirmPassword={false}
      showLogin={true}
      pageType="login"
    />
  );
}
