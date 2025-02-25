// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Homepage from './pages/Homepage';
import Layout from './components/Layout';
import ProtectedRoute from './pages/ProtectedRoutes';
import { Provider } from "react-redux";
import store from "./store/store";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" 
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
    </Router>
  );
};

export default App;