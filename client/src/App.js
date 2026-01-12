import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerView from './pages/CustomerView';
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerLogin from './pages/ManagerLogin';
import { Toaster } from './components/ui/sonner';
import './App.css';

export const AppContext = React.createContext();

function App() {

  const [gstRate, setGstRate] = useState(0.05);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState(
    !!localStorage.getItem('roms_token')
  );
  const loginManager = async (email, password) => {
    try {
      const res = await fetch('/api/manager/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        setIsManagerAuthenticated(false);
        return false;
      }
      const data = await res.json();
      localStorage.setItem('roms_token', data.token || '');
      localStorage.setItem('roms_user', JSON.stringify({ email: data.email, _id: data._id }));
      setIsManagerAuthenticated(true);
      return true;
    } catch (e) {
      setIsManagerAuthenticated(false);
      return false;
    }
  };
  const logoutManager = () => {
    localStorage.removeItem('roms_token');
    localStorage.removeItem('roms_user');
    setIsManagerAuthenticated(false);
  };

  const contextValue = {
    orders,
    setOrders,
    menuItems,
    setMenuItems,
    tables,
    setTables,
    gstRate,
    setGstRate,
    isManagerAuthenticated,
    loginManager,
    logoutManager
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/table/:tableId" element={<CustomerView />} />
            <Route path="/manager/*" element={<ManagerDashboard />} />
            <Route path="/login" element={<ManagerLogin />} />
            <Route path="/" element={<Navigate to="/manager/dashboard" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
