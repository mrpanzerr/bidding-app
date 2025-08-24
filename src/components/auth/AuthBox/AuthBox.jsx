// src/components/AuthBox.jsx
import "./AuthBox.css"; // Import external CSS for styling

/**
 * AuthBox component wraps authentication forms (login/signup) in a styled container.
 * It centers content on the page and provides a clean, consistent look.
 *
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Form or other components to render inside the box
 * @returns {JSX.Element} AuthBox container component
 */
const AuthBox = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        {children}
      </div>
    </div>
  );
};

export default AuthBox;
