// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Homepage from './pages/ManagerHomepage';
import Layout from './manager_components/Layout';
import ProtectedRoute from '../ProtectedRoutes';
import { Provider } from "react-redux";
import store from "./store/store";

const App = () => {
  return (
    // <Router>
      <Layout>
        <Routes>
          {/* <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} /> */}
          <Route path="/" 
            element={
              <ProtectedRoute>
              <Provider store={store}>
                <Homepage />
              </Provider>
              </ProtectedRoute>
            }
          /> 
        </Routes>
      </Layout>
    // </Router>
  );
};

export default App;