import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login, { useStore } from './views/Auth/Login';
import Register from './views/Auth/Register';
import ForgotPassword from './views/Auth/ForgotPassword';
import ConfirmAccount from './views/Auth/ConfirmAccount'; 
import RequestCode from './views/Auth/RequestCode';  
import Home from './pages/Home';
import Dashboard from './views/Dashboard/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  const isAuthenticated = useStore((state) => state.isAuthenticated());

  return (
    <Router>
      <Routes>
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/confirm-account" element={<ConfirmAccount />} />
        <Route path="/request-code" element={<RequestCode />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
