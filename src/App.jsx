import React from "react";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CurrencyProvider } from "./context/CurrencyContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CartPanel from "./components/CartPanel";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import MembersClub from "./pages/MembersClub";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CurrencyProvider>
            <Routes>
              {/* Rutas con header y footer */}
              <Route
                path="/*"
                element={
                  <div className="min-h-screen bg-white">
                    <Header />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Products />} />
                      <Route path="/producto/:id" element={<ProductDetail />} />
                      <Route path="/member-club" element={<MembersClub />} />
                      <Route path="/profile" element={<Profile />} />

                      {/* 4. AÑADIMOS LA RUTA AQUÍ */}
                      <Route path="/wishlist" element={<Wishlist />} />
                    </Routes>
                    <Footer />
                    <CartPanel />
                  </div>
                }
              />

              {/* Rutas sin header y footer (Login/Registro) */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </CurrencyProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
