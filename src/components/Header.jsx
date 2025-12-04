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
      // Redirigir a la página de productos con la búsqueda
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <>
      <motion.header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Top Banner */}
        <div className="bg-black text-white text-xs py-2 px-4 text-center">
          <div className="container mx-auto flex justify-center items-center space-x-16">
            <span className="font-medium">SHOP</span>
            <span>FLASH SALE</span>
            <span>BLACK WEEK</span>
            <span>MEMBERS CLUB</span>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto py-2">
          <div className="flex items-center justify-between">
            {/* Left side - Navigation */}
            <div className="flex-1 flex justify-start">
              <nav className="flex items-center space-x-8 text-xs">
                {/* Shop con dropdown - PASA la headerHeight */}
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
                    className="h-16 w-auto"
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
              <div className="flex items-center space-x-4">
                {/* Currency/Country Selector */}
                <div className="flex items-center space-x-2 text-xs">
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
                      placeholder="Search products, categories, brands..."
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
                  {["Hoodies", "Jeans", "T-Shirts", "Sneakers", "Jackets", "Accessories"].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        // Opcional: buscar automáticamente
                        // window.location.href = `/shop?search=${term}`;
                      }}
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

      {/* Espacio para cuando la barra de búsqueda está abierta */}
      {showSearch && <div className="h-24"></div>}
    </>
  );
};

export default Header;