import AuthForm from "./AuthForm";

/**
 * LoginForm component for user login
 * @param {object} props
 * @param {(formData: {email: string, password: string}) => Promise<void>} props.onSubmit
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
    />
  );
}
