import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminApp from "../src/admin_panel/App";
import BillApp from "../src/bill_panel/App";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import ProtectedRoute from "./ProtectedRoutes";
function App() {

  return (
    // <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home/*" element={<ProtectedRoute><AdminApp /></ProtectedRoute>} />
        <Route path="/billing/*" element={<ProtectedRoute><BillApp /></ProtectedRoute>} />
      </Routes>
    // </BrowserRouter>
  )
}

export default App
