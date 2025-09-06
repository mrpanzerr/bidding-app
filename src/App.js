// React Router components for defining app routes.
import { Route, Routes } from "react-router-dom";

// Page components
import { Navigate } from "react-router-dom";
import CalculatorPage from "./pages/CalculatorPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import ProjectDashboard from "./pages/ProjectDashboard";
import SignUpPage from "./pages/SignUpPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";

// Main application component responsible for routing.
function App() {
  return (
    <Routes>
      {/* Root route - displays the Dashboard component at "/" */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowGuest={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />

      {/* Dynamic project route - displays ProjectDashboard for a specific project ID */}
      <Route
        path="/project/:id"
        element={
          <ProtectedRoute allowGuest={true}>
            <ProjectDashboard />
          </ProtectedRoute>
        }
      />

      {/* Nested routes for specific project pages */}
      <Route
        path="/project/:id/calculator/:calculatorId/:type"
        element={
          <ProtectedRoute allowGuest={true}>
            <CalculatorPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Export App for use in index.js
export default App;
