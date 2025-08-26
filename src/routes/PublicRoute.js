import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

export function PublicRoute({ children }) {
  const user = auth.currentUser;

  // If logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
