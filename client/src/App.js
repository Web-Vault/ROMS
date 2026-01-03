import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerView from './pages/CustomerView';
import ManagerDashboard from './pages/ManagerDashboard';
import { Toaster } from './components/ui/sonner';
import './App.css';

export const AppContext = React.createContext();

function App() {
  // Mock data states
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Classic tomato sauce, fresh mozzarella, basil',
      price: 12.99,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      available: true,
      vegetarian: true
    },
    {
      id: 2,
      name: 'Caesar Salad',
      description: 'Crispy romaine, parmesan, croutons, caesar dressing',
      price: 8.99,
      category: 'Appetizers',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
      available: true,
      vegetarian: true
    },
    {
      id: 3,
      name: 'Grilled Salmon',
      description: 'Atlantic salmon with herbs, served with vegetables',
      price: 18.99,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400',
      available: true,
      vegetarian: false
    },
    {
      id: 4,
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee and mascarpone',
      price: 6.99,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
      available: true,
      vegetarian: true
    },
    {
      id: 5,
      name: 'Fresh Lemonade',
      description: 'Homemade lemonade with mint',
      price: 3.99,
      category: 'Beverages',
      image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f4d?w=400',
      available: true,
      vegetarian: true
    },
    {
      id: 6,
      name: 'Bruschetta',
      description: 'Toasted bread with tomatoes, garlic, basil',
      price: 7.49,
      category: 'Appetizers',
      image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
      available: true,
      vegetarian: true
    },
    {
      id: 7,
      name: 'Beef Burger',
      description: 'Angus beef patty, lettuce, tomato, special sauce',
      price: 14.99,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      available: true,
      vegetarian: false
    },
    {
      id: 8,
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center',
      price: 7.99,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
      available: true,
      vegetarian: true
    },
    {
      id: 9,
      name: 'Iced Coffee',
      description: 'Cold brew coffee with ice',
      price: 4.49,
      category: 'Beverages',
      image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
      available: true,
      vegetarian: true
    },
    {
      id: 10,
      name: 'Pasta Carbonara',
      description: 'Creamy pasta with bacon, egg, parmesan',
      price: 13.99,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
      available: true,
      vegetarian: false
    },
    {
      id: 11,
      name: 'Mozzarella Sticks',
      description: 'Crispy fried mozzarella with marinara sauce',
      price: 6.49,
      category: 'Appetizers',
      image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400',
      available: true,
      vegetarian: true
    },
    {
      id: 12,
      name: 'Fruit Platter',
      description: 'Fresh seasonal fruits',
      price: 5.99,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400',
      available: true,
      vegetarian: true
    }
  ]);
  
  const [tables, setTables] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      number: i + 1,
      status: 'available', // available, occupied, reserved
      capacity: [2, 4, 6][i % 3],
      currentOrder: null
    }))
  );

  const [gstRate, setGstRate] = useState(0.05);

  const contextValue = {
    orders,
    setOrders,
    menuItems,
    setMenuItems,
    tables,
    setTables,
    gstRate,
    setGstRate
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/table/:tableId" element={<CustomerView />} />
            <Route path="/manager/*" element={<ManagerDashboard />} />
            <Route path="/" element={<Navigate to="/manager/dashboard" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
