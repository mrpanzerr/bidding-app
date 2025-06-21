import { Route, Routes } from "react-router-dom";
import Dashboard from './pages/dashboard';
import PageTemplate from './pages/pageTemplate';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/project/:id" element={<PageTemplate />} />
    </Routes>
  );
}


export default App; // to index.js
