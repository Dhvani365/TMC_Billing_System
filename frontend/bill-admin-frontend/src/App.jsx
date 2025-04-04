import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddClientForm from './components/AddPartyForm';
import HomePage from './pages/HomePage';
import BrandsList from './components/BrandsList';
import CatalogList from './components/CatalogList';
import Layout from './Layout';
import AddCatalogs from './components/AddCatalogs';
import AddPricingForm from './components/AddPricingForm';
import PartyDiscount from './components/PartyDiscount';
import ViewUsers from './components/ViewUsers';
import SpecialDiscountList from './components/SpecialDiscountList';

function App() {
  return (
    // <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-client" element={<AddClientForm />} />
          <Route path="/add-pricing" element={<AddPricingForm />} />
          <Route path="/view-brands" element={<BrandsList />} />
          <Route path="/view-catalogs" element={<CatalogList />} />
          <Route path="/client-profile" element={<HomePage />} />
          <Route path="/client-pricing" element={<Dashboard />} />
          <Route path="/add-catalog" element={<AddCatalogs />} />
          <Route path="/special-discount" element={<SpecialDiscountList />} />
          <Route path="/user-accounts" element={<ViewUsers />} />
        </Route>
      </Routes>
    // </Router>
  );
}

export default App;