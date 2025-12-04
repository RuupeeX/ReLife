// src/App.js - Actualización

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartPanel from './components/CartPanel';
import Home from './pages/Home';
import Products from './pages/Products'; // <-- Agregar esta línea
import ProductDetail from './pages/ProductDetail';
import QualityProduction from './pages/Quality';
import MembersClub from './pages/MembersClub';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Rutas con header y footer */}
        <Route path="/*" element={
          <div className="min-h-screen bg-white">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Products />} /> 
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/member-club" element={<MembersClub />} />
              <Route path="/calidad" element={<QualityProduction />} />
            </Routes>
            <Footer />
            <CartPanel />
          </div>
        } />
        
        {/* Rutas sin header y footer */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </CartProvider>
  );
}

export default App;