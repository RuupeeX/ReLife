import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("relife_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const mockUser = {
      name: "Rupe",
      username: "_ruupee_",
      email: email,
      avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Mason",
      bio: "Creador de upcycling · Amante de dar nueva vida a los objetos ♻️",
      site: "relife.app",
      stats: { posts: 6, followers: 128, following: 89 },
    };
    setUser(mockUser);
    localStorage.setItem("relife_user", JSON.stringify(mockUser));
  };

  const register = (data) => {
    const newUser = {
      name: data.name,
      username: data.username,
      email: data.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      bio: "Amante del reciclaje creativo.",
      site: "",
      stats: { posts: 0, followers: 0, following: 0 },
    };
    setUser(newUser);
    localStorage.setItem("relife_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("relife_user");
  };

  const updateUserProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem("relife_user", JSON.stringify(newUser));
  };

  const value = { user, login, register, logout, updateUserProfile };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};