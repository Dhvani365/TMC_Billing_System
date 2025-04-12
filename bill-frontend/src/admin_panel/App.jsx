import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './admin_components/Dashboard';
import AddClientForm from './admin_components/AddPartyForm';
import HomePage from './pages/AdminHomePage';
import BrandsList from './admin_components/BrandsList';
import CatalogList from './admin_components/CatalogList';
import Layout from './Layout';
import AddCatalogs from './admin_components/AddCatalogs';
import AddPricingForm from './admin_components/AddPricingForm';
import PartyDiscount from './admin_components/AddPartyDiscount';
import ViewUsers from './admin_components/ViewUsers';
import SpecialDiscountList from './admin_components/SpecialDiscountList';

function App() {
  return (
    // <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add-party" element={<AddClientForm />} />
        <Route path="add-pricing" element={<AddPricingForm />} />
        <Route path="view-brands" element={<BrandsList />} />
        <Route path="view-catalogs" element={<CatalogList />} />
        <Route path="client-profile" element={<HomePage />} />
        <Route path="client-pricing" element={<Dashboard />} />
        <Route path="add-catalog" element={<AddCatalogs />} />
        <Route path="special-discount" element={<SpecialDiscountList />} />
        <Route path="user-accounts" element={<ViewUsers />} />
      </Route>
    </Routes>
  
    // </Router>
  );
}

export default App;