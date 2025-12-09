import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, User, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import ShopDropdown from "./ShopDropdown";

const Header = () => {
  const { toggleCart, getCartItemsCount } = useCart();
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Calcular la altura del header cuando se monta el componente
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Textos para el banner en movimiento
  const bannerText = [
    "SHOP", 
    "FLASH SALE", 
    "BLACK WEEK", 
    "MEMBERS CLUB", 
    "FREE SHIPPING WORLDWIDE",
    "NEW COLLECTION"
  ];

  return (
    <>
      <motion.header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* --- NUEVO TOP BANNER CON MOVIMIENTO A LA DERECHA --- */}
        <div className="bg-black text-white text-xs py-2 overflow-hidden relative whitespace-nowrap">
          <motion.div
            className="flex w-max"
            animate={{ x: ["-50%", "0%"] }} 
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 80, // Ajusta este número para cambiar la velocidad (mayor = más lento)
            }}
          >
            {/* Repetimos el contenido 4 veces para asegurar el loop infinito sin cortes */}
            {[...bannerText, ...bannerText, ...bannerText, ...bannerText].map((text, index) => (
              <span key={index} className="mx-8 font-medium tracking-widest flex items-center">
                {text}
                <span className="w-1 h-1 bg-white rounded-full ml-14 opacity-50"></span>
              </span>
            ))}
          </motion.div>
        </div>
        {/* ---------------------------------------------------- */}

        {/* Main Header */}
        <div className="container mx-auto py-2 px-4">
          <div className="flex items-center justify-between">
            {/* Left side - Navigation */}
            <div className="flex-1 flex justify-start">
              <nav className="flex items-center space-x-8 text-xs hidden md:flex">
                {/* Shop con dropdown */}
                <ShopDropdown headerHeight={headerHeight} />

                {/* Otros enlaces */}
                {["MEMBER CLUB"].map((item) => (
                  <motion.div key={item} whileHover={{ y: -1 }}>
                    <Link
                      to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-gray-700 hover:text-blue-700 font-medium transition-colors duration-300 block"
                      onClick={() => {
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: "instant" });
                        }, 100);
                      }}
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              {/* Mobile Menu Icon Placeholder (si lo necesitas) */}
              <div className="md:hidden">
                 {/* Aquí iría tu icono de menú hamburguesa si lo tienes */}
              </div>
            </div>

            {/* Center - Logo */}
            <div className="flex-1 flex justify-center">
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Link to="/">
                  <img
                    src="/images/logoGrafiti1.png"
                    alt="Aureum Logo"
                    className="h-12 md:h-16 w-auto" // Ajustado ligeramente para móvil
                    onClick={() => {
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: "instant" });
                      }, 100);
                    }}
                  />
                </Link>
              </motion.div>
            </div>

            {/* Right side - Actions */}
            <div className="flex-1 flex justify-end">
              <div className="flex items-center space-x-3 md:space-x-4">
                {/* Currency/Country Selector (Hidden on mobile usually to save space, or kept small) */}
                <div className="hidden md:flex items-center space-x-2 text-xs">
                  <span className="text-gray-700">EUR €</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-700">SPAIN</span>
                  <span className="text-gray-400 cursor-pointer">▼</span>
                </div>

                {/* Search Icon */}
                <motion.button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-1 text-gray-700 hover:text-blue-700 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                </motion.button>

                {/* User Account */}
                <Link to="/login">
                  <motion.button
                    className="p-1 text-gray-700 hover:text-blue-700 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <User className="w-5 h-5" />
                  </motion.button>
                </Link>

                {/* Shopping Cart */}
                <motion.button
                  onClick={toggleCart}
                  className="relative p-1 text-gray-700 hover:text-blue-700 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {getCartItemsCount() > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      {getCartItemsCount()}
                    </motion.span>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Barra de búsqueda animada */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-40 border-b border-gray-200 shadow-lg bg-gray-50"
            style={{ marginTop: `${headerHeight}px` }}
          >
            <div className="container mx-auto py-4 px-4">
              <div className="relative">
                <form onSubmit={handleSearch}>
                  <div className="flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search products..."
                      className="w-full pl-12 pr-20 py-3 border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-2 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Sugerencias rápidas */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500 mt-1">Quick search:</span>
                  {["Hoodies", "Jeans", "T-Shirts", "Sneakers"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ajuste de espaciado: Si el search está abierto, a veces necesitamos un overlay o spacer */}
      {showSearch && <div className="hidden md:block h-screen fixed inset-0 z-30 bg-black/20" onClick={() => setShowSearch(false)} style={{marginTop: headerHeight}}></div>}
    </>
  );
};

export default Header;