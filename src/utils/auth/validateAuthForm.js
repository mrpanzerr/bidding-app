export function validateAuthForm(formData, formType) {
  const errors = {};

  // Validate email for all form types
  if (!formData.email) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email is invalid.";
  }

  if (formType === "signup") {
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  } else if (formType === "login") {
    if (!formData.password) {
      errors.password = "Password is required.";
    }
    // You could add other login-specific validations here
  }

  return errors;
}
