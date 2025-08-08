// React Router components for defining app routes.
import { Route, Routes } from "react-router-dom";

// Page components
import CalculatorPage from "./pages/calculatorPage";
import Dashboard from './pages/dashboard';
import ProjectDashboard from "./pages/projectDashboard";
import TitlePage from "./pages/titlePage";

// Main application component responsible for routing.
function App() {
  return (
    <Routes>
      {/* Root route - displays the Dashboard component at "/" */}
      <Route path="/" element={<Dashboard />} />
      {/* <Route path="/" element={<SignUpPage />} /> */}

      {/* Dynamic project route - displays ProjectDashboard for a specific project ID */}
      <Route path="/project/:id" element={<ProjectDashboard />} />

      {/* Nested routes for specific project pages */}
      <Route path="/project/:id/titlePage" element={<TitlePage />} />
      <Route
        path="/project/:id/calculator/:calculatorId/:type"
        element={<CalculatorPage />}
      />
    </Routes>
  );
}

// Export App for use in index.js
export default App;
