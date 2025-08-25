// React Router components for defining app routes.
import { Route, Routes } from "react-router-dom";

// Page components
import CalculatorPage from "./pages/CalculatorPage";
import GuestDashboard from "./pages/GuestDashboard";
import LoginPage from "./pages/LoginPage";
import ProjectDashboard from "./pages/ProjectDashboard";
import SignUpPage from "./pages/SignUpPage";
import UserDashboard from "./pages/UserDashboard";

// Main application component responsible for routing.
function App() {
  return (
    <Routes>
      {/* Root route - displays the Dashboard component at "/" */}
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/guest" element={<GuestDashboard />} />
      <Route path="/user" element={<UserDashboard />} />

      {/* Dynamic project route - displays ProjectDashboard for a specific project ID */}
      <Route path="/project/:id" element={<ProjectDashboard />} />

      {/* Nested routes for specific project pages */}
      <Route
        path="/project/:id/calculator/:calculatorId/:type"
        element={<CalculatorPage />}
      />
    </Routes>
  );
}

// Export App for use in index.js
export default App;
