// Importing Route and Routes from the "react-router-dom" package.
import { Route, Routes } from "react-router-dom";
// Importing the component for the Dashboard page.
// This will be shown when the user is on the home page ("/").
import Dashboard from './pages/dashboard';
// Importing the component for the project dashboard page.
import ProjectDashboard from "./pages/projectDashboard";
// Importing the component for an individual project page.
// This will be shown when the user visits a specific project's page, like "/project/123".
import TitlePage from './pages/titlePage';
// Importing the component for the square footage calculator page.
import SqftCalculator from './pages/sqftCalculator';

import CalculatorPage from './pages/calculatorPage';

// Main App component that sets up the routing for the application.
function App() {
  return (
    <Routes>
      
      {/* This Route defines what to show at the homepage ("/").
          When a user goes to "yourwebsite.com/", the Dashboard component will be displayed. */}
      <Route path="/" element={<Dashboard />} />

      {/* This Route handles dynamic URLs like "/project/123" or "/project/hello-world".
          ":id" is a placeholder for any project ID or name.
          Whatever value comes after "/project/" will be passed to the PageTemplate component. */}
      <Route path="/project/:id" element={<ProjectDashboard />} />
      
      {/* These Routes handle the title and calculator pages */}
      <Route path="/project/:id/titlePage" element={<TitlePage />} />
      <Route path="/project/:id/sqftCalculator" element={<SqftCalculator />} />
      <Route path="/project/:id/calculator/:calculatorId/:type" element={<CalculatorPage />} />


    </Routes>
  );
}

// This line makes the App component available to be used in other files.
// In this case, index.js imports it and renders it onto the page.
export default App;
