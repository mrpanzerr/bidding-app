import { Route, Routes } from "react-router-dom";
import PageTemplate from './pages/blank';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/project/:id" element={<PageTemplate />} />
    </Routes>
  );
}


export default App; // to index.js
