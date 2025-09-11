import AuthForm from "./AuthForm";

/**
 * SignUpForm component wraps the AuthForm for the signup page.
 * It sets initial form values, form type, and passes errors and submission handler.
 *
 * @param {Object} props
 * @param {function} props.onSubmit - Callback function invoked with email, password, and confirmPassword on form submission.
 * @param {Object} [props.errors={}] - Object containing field-specific or general error messages.
 * @returns {JSX.Element} Sign-up form component.
 */
export default function SignUpForm({ onSubmit, errors = {} }) {
  /**
   * Handle submission from AuthForm and forward email/password/confirmPassword to parent handler.
   *
   * @param {Object} values - Form values
   * @param {string} values.email - User email input
   * @param {string} values.password - User password input
   * @param {string} values.confirmPassword - User confirm password input
   */
  const handleSubmit = async ({ email, password, confirmPassword }) => {
    onSubmit(email, password, confirmPassword);
  };

  return (
    <AuthForm
      initialValues={{ email: "", password: "", confirmPassword: "" }}
      onSubmit={handleSubmit}
      errors={errors}
      showConfirmPassword={true} // Show confirm password field for signup
      pageType="signup" // Sets form title and behavior
    />
  );
}
