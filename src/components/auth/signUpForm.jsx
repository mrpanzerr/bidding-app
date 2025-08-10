import AuthForm from "./AuthForm";

/**
 * SignUpForm component for user registration
 * @param {object} props
 * @param {(formData: {email: string, password: string}) => Promise<void>} props.onSubmit
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
