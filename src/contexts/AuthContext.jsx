import { createContext, useContext, useEffect, useState } from "react";
import {
  listenToAuthChanges,
  logout,
  signIn,
  signUp,
} from "../firebase/authServices";

const AuthContext = createContext();

/**
 * AuthProvider component for providing authentication context
 * to its child components. It manages the authentication state,
 * listens for auth changes, and provides auth methods.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The AuthProvider component.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, loading, signUp, signIn, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
