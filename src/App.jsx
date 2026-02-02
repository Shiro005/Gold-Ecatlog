import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import AdminPanel from './Pages/AdminPanel';
import Home from './Pages/Home';
import ProductPage from './Pages/ProductPage';
import Header from './Components/Header';
import Footer from './Components/Footer';
import UserFormModal from './Pages/userform';
import CategoryPage from './Pages/CategoryPage';
import GoldRate from './Pages/GoldRate';
import ScrollToTop from './Pages/ScrollToTop';
import GoldLiveRate from './Pages/GoldLiveRate';

const AdminLoginModal = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === '' && password === '') {
      localStorage.setItem('adminAuthenticated', 'true');
      onSuccess();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="admin-login-modal">
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hasSubmitted = localStorage.getItem('formSubmitted');
    if (hasSubmitted === 'true') {
      setFormSubmitted(true);
    }

    const isAdminAuthenticated = localStorage.getItem('adminAuthenticated');
    if (isAdminAuthenticated === 'true') {
      setAdminAuthenticated(true);
    }
  }, []);

  // Skip form for admin routes and goldrate route
  const isGoldRateRoute = location.pathname === '/goldrate';
  if (!formSubmitted && !location.pathname.startsWith('/admin') && !isGoldRateRoute) {
    return (
      <UserFormModal
        onSuccess={() => {
          setFormSubmitted(true);
          localStorage.setItem('formSubmitted', 'true');
        }}
      />
    );
  }

  // Check admin authentication for admin routes
  if (location.pathname.startsWith('/admin') && !adminAuthenticated && !isGoldRateRoute) {
    return (
      <AdminLoginModal
        onSuccess={() => {
          setAdminAuthenticated(true);
        }}
      />
    );
  }

  // For GoldRate route - render without header and footer
  if (isGoldRateRoute) {
    return (
      <Routes>
        <Route path="/goldrate" element={<GoldRate />} />
      </Routes>
    );
  }

  // For all other routes - render with header and footer
  return (
    <>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/" element={<Home />} />
        <Route path="/goldlive" element={<GoldLiveRate />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
};

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}