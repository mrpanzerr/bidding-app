import AuthForm from "./AuthForm";

/**
 * LoginForm component wraps the AuthForm for the login page.
 * It sets initial form values, form type, and passes errors and submission handler.
 *
 * @param {Object} props
 * @param {function} props.onSubmit - Callback function invoked with email and password on form submission.
 * @param {Object} [props.errors={}] - Object containing field-specific or general error messages.
 * @returns {JSX.Element} Login form component.
 */
export default function LoginForm({ onSubmit, errors = {} }) {
  /**
   * Handle submission from AuthForm and forward email/password to parent handler.
   *
   * @param {Object} values - Form values
   * @param {string} values.email - User email input
   * @param {string} values.password - User password input
   */
  const handleSubmit = async ({ email, password }) => {
    onSubmit(email, password);
  };

  return (
    <AuthForm
      initialValues={{ email: "", password: "" }}
      onSubmit={handleSubmit}
      errors={errors}
      showConfirmPassword={false} // Login form does not require confirm password
      showLogin={true} // Show the login button
      pageType="login" // Sets form title and behavior
    />
  );
}
