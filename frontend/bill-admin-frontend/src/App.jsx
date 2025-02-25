import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddClientForm from './components/AddClientForm';
import AddBrands from './components/AddBrands';
import AddCatalogs from './components/AddCatalogs';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-client" element={<AddClientForm />} />
        <Route path="/add-brands" element={<AddBrands />} />
        <Route path="/add-catalogs" element={<AddCatalogs />} />
        <Route path="/client-profile" element={<Dashboard />} />
        <Route path="/client-pricing" element={<Dashboard />} />
        <Route path="/all-users-details" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;