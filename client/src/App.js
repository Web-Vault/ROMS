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
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [menuRes, tablesRes, ordersRes, settingsRes] = await Promise.all([
          fetch('/api/menu'),
          fetch('/api/tables'),
          fetch('/api/orders'),
          fetch('/api/settings')
        ]);
        const [menuJson, tablesJson, ordersJson, settingsJson] = await Promise.all([
          menuRes.ok ? menuRes.json() : [],
          tablesRes.ok ? tablesRes.json() : [],
          ordersRes.ok ? ordersRes.json() : [],
          settingsRes.ok ? settingsRes.json() : {}
        ]);
        setMenuItems((menuJson || []).map(i => ({ id: i._id || i.id, ...i })));
        setTables((tablesJson || []).map(t => ({ id: t._id || t.id, ...t })));
        setOrders((ordersJson || []).map(o => ({ id: o._id || o.id, ...o })));
        if (settingsJson && typeof settingsJson.gstRate === 'number') {
          setGstRate(settingsJson.gstRate);
        }
      } catch (e) {
      }
    };
    loadData();
  }, []);
  
  React.useEffect(() => {
    const controller = new AbortController();
    const poll = async () => {
      try {
        const res = await fetch(`/api/orders?t=${Date.now()}`, {
          signal: controller.signal,
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (res.ok) {
          const json = await res.json();
          setOrders((json || []).map(o => ({ id: o._id || o.id, ...o })));
        }
      } catch (e) {
      }
    };
    const interval = setInterval(poll, 5000);
    poll();
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);
  React.useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) return;
        const data = await res.json();
        setOrders((data || []).map(o => ({ id: o._id || o.id, ...o })));
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, []);
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
