export function validateAuthForm(formData, formType) {
  const errors = {};

  // Helper functions
  const isRequired = (field, fieldName) => {
    if (!formData[field]?.trim()) {
      errors[field] = `${fieldName} is required.`;
      return false;
    }
    return true;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
  };

  const minLength = (field, length, fieldName) => {
    if (formData[field] && formData[field].length < length) {
      errors[field] = `${fieldName} must be at least ${length} characters long.`;
    }
  };

  // Validate email for all forms
  if (isRequired("email", "Email")) {
    isValidEmail(formData.email);
  }

  // Validate password
  if (formType === "signup") {
    if (isRequired("password", "Password")) {
      minLength("password", 6, "Password");
    }
    if (isRequired("confirmPassword", "Confirm Password")) {
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords must match.";
      }
    }
  } else if (formType === "login") {
    isRequired("password", "Password");
  }

  return errors;
}
