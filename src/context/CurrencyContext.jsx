import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  // Configuración inicial
  const [currency, setCurrency] = useState("EUR");
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);

  // Mapeo de Símbolos
  const symbols = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    JPY: "¥",
    CAD: "$",
    AUD: "$"
  };

  // 1. Fetch de datos a la API al cargar la app
  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Pedimos los ratios con base en Euro
        const res = await fetch('https://api.frankfurter.app/latest?from=EUR');
        const data = await res.json();
        setRates(data.rates);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rates:", error);
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  // 2. Función para formatear precios
  const formatPrice = (priceInEur) => {
    // Si es Euro, devolvemos directo
    if (currency === "EUR") {
      return `${priceInEur.toFixed(2)}€`;
    }

    // Si no tenemos el ratio aun, mostramos cargando o el precio en EUR
    const rate = rates[currency];
    if (!rate) return `${priceInEur.toFixed(2)}€`;

    // Calculamos
    const converted = priceInEur * rate;
    
    // Formateo especial para Yen (sin decimales) o el resto
    const decimals = currency === 'JPY' ? 0 : 2;
    return `${converted.toFixed(decimals)} ${symbols[currency]}`;
  };

  const value = {
    currency,
    setCurrency,
    rates,
    formatPrice, // Usarás esto en tus productos
    loading
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};