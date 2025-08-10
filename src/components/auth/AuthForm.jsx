import { useState } from "react";

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
  showConfirmPassword = true,
}) {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
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

      {!showConfirmPassword && <button type="submit">Login</button>}

      <button type="submit">Sign Up</button>

      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
    </form>
  );
}
