export default function SignUpForm({ onSubmit, errors }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const { elements } = e.target;
    const email = elements.email.value;
    const password = elements.password.value;
    const confirmPassword = elements.confirmPassword.value;
    onSubmit(email, password, confirmPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input type="email" name="email" placeholder="Email" required />
        {errors?.email && <p style={{ color: "red" }}>{errors.email}</p>}
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        {errors?.password && <p style={{ color: "red" }}>{errors.password}</p>}
      </div>
      <div>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
        />
        {errors?.confirmPassword && (
          <p style={{ color: "red" }}>{errors.confirmPassword}</p>
        )}
      </div>
      <button type="submit">Sign Up</button>

      {errors?.general && <p style={{ color: "red" }}>{errors.general}</p>}
    </form>
  );
}
