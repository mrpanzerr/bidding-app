export function validateSignUpForm(email, password, confirmPassword) {
  const errors = {};

  // Validate email format
  if (!email) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email address is invalid.";
  }

  // Validate password length
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters long.";
  }

  // Validate password confirmation
  if (!confirmPassword) {
    errors.confirmPassword = "Confirm Password is required.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}
