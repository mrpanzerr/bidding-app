import { useState } from "react";
import { useNavigate } from "react-router";

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
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default function AuthForm({
  initialValues = { email: "", password: "", confirmPassword: "" },
  onSubmit,
  errors = {},
  showConfirmPassword = false, // true for signup page
  showLogin = false,           // true for login page
  showSignUp = true,           // always show sign up on signup page
  showGuest = true, 
  pageType,          
}) {
  const [formValues, setFormValues] = useState(initialValues);

  const navigate = useNavigate();

  const navigateToGuest = () => {
    navigate("/guest");
  };

  const navigateToSignUp = () => {
    navigate("/signup");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e, action) => {
    e.preventDefault();
    if (action === "guest") {
      navigateToGuest();
    } else if (action === "routeToSignUp") {
      navigateToSignUp();
    } else {
      onSubmit(formValues, action);
    }
  };

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
    <form onSubmit={handleSubmit}>
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

       {/* Buttons */}
      <div style={{ display: "flex", gap: "1rem" }}>
        {showLogin && (
          <button type="submit" onClick={(e) => handleSubmit(e, "login")}>
            Login
          </button>
        )}

        {pageType === "login" && showSignUp && (
          <button type="submit" onClick={(e) => handleSubmit(e, "routeToSignUp")}>
            Sign Up
          </button>
        )}

        {pageType === "signup" && showSignUp && (
          <button type="submit" onClick={(e) => handleSubmit(e, "signup")}>
            Sign Up
          </button>
        )}

        {showGuest && (
          <button type="button" onClick={(e) => handleSubmit(e, "guest")}>
            Guest
          </button>
        )}
      </div>
    </form>
  );
}
