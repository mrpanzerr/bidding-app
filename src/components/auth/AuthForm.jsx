import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "../../styles/auth/AuthForm.module.css";

/**
 * InputField component renders a labeled input with optional error message.
 *
 * @param {Object} props
 * @param {string} props.id - The input ID and name.
 * @param {string} props.label - Label text for the input.
 * @param {string} [props.type="text"] - HTML input type.
 * @param {string} props.value - Current input value.
 * @param {function} props.onChange - Change handler for the input.
 * @param {string} [props.error] - Optional error message.
 * @param {boolean} [props.required=false] - Whether input is required.
 * @returns {JSX.Element} The input field component.
 */
function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false,
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

/**
 * AuthForm component renders a login/signup form in a styled box.
 * Handles input state, submission, and navigation actions (guest/signup).
 *
 * @param {Object} props
 * @param {Object} [props.initialValues={email:"",password:"",confirmPassword:""}] - Initial form state.
 * @param {function} props.onSubmit - Callback function when the form is submitted.
 * @param {Object} [props.errors={}] - Object containing field-specific and general errors.
 * @param {boolean} [props.showConfirmPassword=false] - Whether to show confirm password field.
 * @param {boolean} [props.showLogin=false] - Whether to show the login button.
 * @param {boolean} [props.showSignUp=true] - Whether to show the signup button.
 * @param {boolean} [props.showGuest=true] - Whether to show the guest access button.
 * @param {string} props.pageType - Either "login" or "signup" to determine form title and button behavior.
 * @returns {JSX.Element} The complete auth form component.
 */
export default function AuthForm({
  initialValues = { email: "", password: "", confirmPassword: "" },
  onSubmit,
  errors = {},
  showConfirmPassword = false,
  showLogin = false,
  showSignUp = true,
  showGuest = true,
  pageType,
}) {
  const [formValues, setFormValues] = useState(initialValues);
  const navigate = useNavigate();

  /**
   * Navigate to guest access page.
   */
  const navigateToGuest = () => {
    navigate("/guest");
  };

  /**
   * Navigate to signup page.
   */
  const navigateToSignUp = () => {
    navigate("/signup");
  };

  /**
   * Update form state when input changes.
   *
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  /**
   * Handle form submission and delegate to parent callback.
   *
   * @param {Event} e - Form submit event
   * @param {string} action - Optional action identifier ("login", "signup", "guest")
   */
  const handleSubmit = (e, action) => {
    e.preventDefault();
    onSubmit(formValues, action);
  };

  // Dynamically generate form fields
  const fields = [
    { id: "email", label: "Email", type: "email", required: true },
    { id: "password", label: "Password", type: "password", required: true },
    ...(showConfirmPassword
      ? [
          {
            id: "confirmPassword",
            label: "Confirm Password",
            type: "password",
            required: true,
          },
        ]
      : []),
  ];

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>
          {pageType === "login" ? "BidWise - Login" : "BidWise - Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {fields.map(({ id, label, type, required }) => (
            <InputField
              key={id}
              id={id}
              label={label}
              type={type}
              value={formValues[id]}
              onChange={handleChange}
              error={errors[id]}
              required={required}
            />
          ))}

          {/* Form action buttons */}
          <div className={styles.buttonRow}>
            {pageType === "login" && showLogin && (
              <button
                type="submit"
                onClick={(e) => handleSubmit(e, "login")}
                className={styles.button}
              >
                Login
              </button>
            )}

            {pageType === "login" && showSignUp && (
              <button
                type="button"
                onClick={navigateToSignUp}
                className={styles.secondaryButton}
              >
                Sign Up
              </button>
            )}

            {pageType === "signup" && showSignUp && (
              <button
                type="submit"
                onClick={(e) => handleSubmit(e, "signup")}
                className={styles.button}
              >
                Sign Up
              </button>
            )}

            {showGuest && (
              <button
                type="button"
                onClick={navigateToGuest}
                className={styles.secondaryButton}
              >
                Guest Access
              </button>
            )}
          </div>

          {/* General form errors */}
          {errors.general && (
            <p className={styles.errorText}>{errors.general}</p>
          )}
        </form>
      </div>
    </div>
  );
}
