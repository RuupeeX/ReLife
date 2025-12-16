import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = (userData) => {
    const newUser = { 
      ...userData, 
      id: Date.now(),
      credits: 200, 
      memberSince: new Date().toLocaleDateString()
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('registeredUser', JSON.stringify(newUser));
  };

  const login = (loginData) => {
    const storedRegisteredUser = localStorage.getItem('registeredUser');
    const registeredUser = storedRegisteredUser ? JSON.parse(storedRegisteredUser) : null;

    if (registeredUser && registeredUser.correo === loginData.correo) {
        setUser(registeredUser);
        localStorage.setItem('user', JSON.stringify(registeredUser));
    } else {
        const demoUser = { 
            nombre: "Usuario Demo",
            apodo: "invitado",
            correo: loginData.correo,
            ciudad: "Madrid",
            credits: 0,
            memberSince: new Date().toLocaleDateString()
        };
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
    }
  };

  // --- NUEVA FUNCIÓN: ACTUALIZAR USUARIO ---
  const updateUser = (newData) => {
    // Fusionamos los datos actuales con los nuevos (ej: { avatar: "..." })
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    
    // Guardamos en localStorage para que persista al recargar
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Si es el usuario registrado, actualizamos también el backup
    const storedRegisteredUser = localStorage.getItem('registeredUser');
    if (storedRegisteredUser) {
        const parsed = JSON.parse(storedRegisteredUser);
        if (parsed.correo === user.correo) {
            localStorage.setItem('registeredUser', JSON.stringify(updatedUser));
        }
    }
  };
  // ----------------------------------------

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    // AÑADIMOS updateUser AL VALUE
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};