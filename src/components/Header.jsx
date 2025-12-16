import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  User,
  X,
  ChevronDown,
  Check,
  Heart,
  Zap,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import ShopDropdown from "./ShopDropdown";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";

// --- DATA: Opciones de Región y Moneda ---
const regionOptions = [
  { code: "ES", name: "Spain", currency: "EUR", symbol: "€" },
  { code: "FR", name: "France", currency: "EUR", symbol: "€" },
  { code: "DE", name: "Germany", currency: "EUR", symbol: "€" },
  { code: "US", name: "USA", currency: "USD", symbol: "$" },
  { code: "GB", name: "UK", currency: "GBP", symbol: "£" },
  { code: "JP", name: "Japan", currency: "JPY", symbol: "¥" },
  { code: "CA", name: "Canada", currency: "CAD", symbol: "$" },
  { code: "AU", name: "Australia", currency: "AUD", symbol: "$" },
];

const Header = () => {
  const { toggleCart, getCartItemsCount } = useCart();
  const headerRef = useRef(null);
  const { currency, setCurrency } = useCurrency();

  // Refs y Estados
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const currencyRef = useRef(null);

  const selectedRegion = regionOptions.find(r => r.currency === currency) || regionOptions[0];

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  // --- DATOS DEL BANNER ---
  const bannerItems = [
    { text: "SPRING / SUMMER 25 AVAILABLE NOW", link: "/new-arrivals" },
    { text: "FREE WORLDWIDE SHIPPING OVER €200", link: "/shipping-info" },
    { text: "JOIN THE CLUB - GET 200 CREDITS", link: "/member-club" },
    { text: "LIMITED TIME: FLASH SALE LIVE", link: "/shop?category=sale" },
  ];

  // IMPORTANTE: Duplicamos los items para el efecto infinito
  const infiniteBanner = [...bannerItems, ...bannerItems, ...bannerItems, ...bannerItems];

  return (
    <>
      <motion.header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* --- TOP BANNER SIN PAUSA --- */}
        <div className="bg-black text-white overflow-hidden relative z-50 h-9 flex items-center">
          <motion.div
            className="flex w-max items-center"
            // Se mueve continuamente sin detenerse
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 60, // Ajusta la velocidad aquí
            }}
          >
            {infiniteBanner.map((item, index) => (
              <div key={index} className="flex items-center">
                <Link
                  to={item.link}
                  className="mx-6 text-[10px] font-black tracking-[0.2em] uppercase hover:text-gray-300 transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  {item.text}
                </Link>
                <Zap className="w-3 h-3 text-gray-600 fill-gray-600" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto py-2 px-4">
          <div className="flex items-center justify-between">
            {/* Left side - Navigation */}
            <div className="flex-1 flex justify-start">
              <nav className="flex items-center space-x-8 text-xs hidden md:flex">
                <ShopDropdown headerHeight={headerHeight} />
                {["MEMBER CLUB"].map((item) => (
                  <motion.div key={item} whileHover={{ y: -1 }}>
                    <Link
                      to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-gray-700 hover:text-blue-700 font-medium transition-colors duration-300 block"
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
                    className="h-12 md:h-16 w-auto"
                    onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
                  />
                </Link>
              </motion.div>
            </div>

            {/* Right side - Actions */}
            <div className="flex-1 flex justify-end">
              <div className="flex items-center space-x-3 md:space-x-4">
                
                {/* CURRENCY SELECTOR */}
                <div className="relative hidden md:block" ref={currencyRef}>
                  <button
                    onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                    className="flex items-center space-x-2 text-xs hover:text-blue-700 transition-colors py-2"
                  >
                    <img
                      src={`https://flagcdn.com/${selectedRegion.code.toLowerCase()}.svg`}
                      alt={selectedRegion.name}
                      className="w-4 h-auto object-cover rounded-[2px] shadow-sm"
                    />
                    <span className="text-gray-700 font-medium">
                      {selectedRegion.currency} {selectedRegion.symbol}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${
                        isCurrencyOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isCurrencyOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 shadow-xl rounded-sm py-2 z-[60]"
                      >
                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                          {regionOptions.map((region) => (
                            <button
                              key={region.code}
                              onClick={() => {
                                setCurrency(region.currency);
                                setIsCurrencyOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={`https://flagcdn.com/${region.code.toLowerCase()}.svg`}
                                  alt={region.name}
                                  className="w-6 h-auto object-cover rounded-[2px]"
                                />
                                <div className="flex flex-col items-start text-xs">
                                  <span className="font-medium">{region.name}</span>
                                  <span className="text-[10px] text-gray-400">
                                    {region.currency} ({region.symbol})
                                  </span>
                                </div>
                              </div>
                              {selectedRegion.code === region.code && (
                                <Check className="w-3 h-3 text-blue-700" />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search */}
                <motion.button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-1 text-gray-700 hover:text-blue-700"
                  whileHover={{ scale: 1.1 }}
                >
                  {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                </motion.button>

                {/* Wishlist */}
                <Link to="/wishlist">
                   <Heart className="w-5 h-5 text-gray-700 hover:text-blue-700" />
                </Link>

                {/* User */}
                <Link to={user ? "/profile" : "/login"}>
                  <User className="w-5 h-5 text-gray-700 hover:text-blue-700" />
                </Link>

                {/* Cart */}
                <motion.button
                  onClick={toggleCart}
                  className="relative p-1 text-gray-700 hover:text-blue-700"
                  whileHover={{ scale: 1.1 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {getCartItemsCount()}
                    </span>
                  )}
                </motion.button>

              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search Bar Animation */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-40 border-b border-gray-200 shadow-lg bg-gray-50"
            style={{ marginTop: `${headerHeight}px` }}
          >
             <div className="container mx-auto py-4 px-4">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full p-2 border border-gray-300"
                  />
                </form>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;