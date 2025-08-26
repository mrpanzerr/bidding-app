import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

/**
 * Wrap pages that require authentication.
 * allowGuest: if true, lets guests access the page
 */
export function ProtectedRoute({ children, allowGuest = false }) {
  const user = auth.currentUser;

  if (!user && !allowGuest) {
    return <Navigate to="/" replace />;
  }

  return children;
}
