import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  // Safe fallback if used outside provider
  if (!ctx) return { theme: "light", toggleTheme: () => {}, isDark: false };
  return ctx;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem("relife_theme");
    if (stored === "dark" || stored === "light") return stored;
    // Then check system preference
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  });

  const isDark = theme === "dark";

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.setAttribute("data-theme", "dark");
      root.classList.add("dark");
    } else {
      root.removeAttribute("data-theme");
      root.classList.remove("dark");
    }

    // Persist
    localStorage.setItem("relife_theme", theme);

    // Update meta theme-color for mobile browsers
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = isDark ? "#0f0f0f" : "#fafaf9";
  }, [theme, isDark]);

  // Listen for system preference changes
  useEffect(() => {
    const stored = localStorage.getItem("relife_theme");
    // Only auto-switch if user hasn't manually set preference
    if (stored) return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setLight = useCallback(() => setTheme("light"), []);
  const setDark = useCallback(() => setTheme("dark"), []);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setLight, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;