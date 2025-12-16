import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Package,
  Settings,
  LogOut,
  CreditCard,
  MapPin,
  Shield,
  Camera, // Importamos el icono de cámara
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  // Ahora extraemos también updateUser del contexto
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Estado para la previsualización de la imagen nueva
  const [newAvatar, setNewAvatar] = useState(null);
  const fileInputRef = useRef(null); // Referencia al input oculto

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // --- LÓGICA DE SUBIDA DE IMAGEN ---
  const handleImageClick = () => {
    fileInputRef.current.click(); // Al clickar el botón, abrimos el selector de archivos
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convertimos la imagen a Base64 para guardarla en local (simulación de servidor)
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result); // Guardamos la previsualización
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    // Si hay una imagen nueva seleccionada, actualizamos el usuario
    if (newAvatar) {
      updateUser({ avatar: newAvatar });
      // Limpiamos la previsualización y volvemos a overview o mostramos alerta
      setNewAvatar(null);
      alert("Profile updated successfully!");
    }
  };
  // ----------------------------------

  if (!user) return null;

  // Componente reutilizable para mostrar el Avatar (Imagen o Letra)
  const AvatarDisplay = ({ size = "large" }) => {
    const sizeClasses =
      size === "large" ? "w-16 h-16 text-2xl" : "w-24 h-24 text-4xl"; // Tamaños

    // Prioridad: 1. Previsualización (en settings), 2. Avatar guardado, 3. Letra inicial
    const imageSource =
      activeTab === "settings" && newAvatar ? newAvatar : user.avatar;

    if (imageSource) {
      return (
        <img
          src={imageSource}
          alt="Profile"
          className={`${sizeClasses} rounded-full object-cover border border-gray-200`}
        />
      );
    }

    return (
      <div
        className={`${sizeClasses} bg-black text-white rounded-full flex items-center justify-center font-bold`}
      >
        {user.nombre
          ? user.nombre.charAt(0).toUpperCase()
          : user.correo.charAt(0).toUpperCase()}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-white p-8 border border-gray-900 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold">No active orders</h3>
              <p className="text-sm text-gray-500 mb-4">
                You haven't placed any orders yet.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="text-xs bg-black text-white px-4 py-2 uppercase font-bold hover:bg-white hover:text-black border border-black"
              >
                Start Shopping
              </button>
            </div>
          </motion.div>
        );
      case "settings":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-900 p-6"
          >
            <h3 className="font-bold text-lg mb-6">Account Settings</h3>

            {/* SECCIÓN DE CAMBIO DE AVATAR */}
            <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-100">
              <AvatarDisplay size="xl" /> {/* Visualización grande */}
              <div>
                <h4 className="text-sm font-bold mb-1">Profile Picture</h4>
                <p className="text-xs text-gray-500 mb-3">
                  Upload a new avatar (JPG, PNG)
                </p>

                {/* Input oculto */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  onClick={handleImageClick}
                  className="flex items-center space-x-2 text-xs bg-gray-100 hover:bg-gray-200 text-black px-3 py-2 border border-gray-900 transition-colors"
                >
                  <Camera className="w-3 h-3" />
                  <span>Change Photo</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    defaultValue={user.nombre}
                    className="w-full mt-1 p-2 border border-gray-900 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Username / Apodo
                  </label>
                  <input
                    type="text"
                    readOnly
                    defaultValue={user.apodo}
                    className="w-full mt-1 p-2 border border-gray-900 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    readOnly
                    defaultValue={user.correo}
                    className="w-full mt-1 p-2 border border-gray-900 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    City
                  </label>
                  <input
                    type="text"
                    readOnly
                    defaultValue={user.ciudad}
                    placeholder="No city added"
                    className="w-full mt-1 p-2 border border-gray-900 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleSaveChanges}
                  className="bg-black text-white px-6 py-2 text-sm font-bold hover:bg-white hover:text-black border border-black transition"
                >
                  SAVE CHANGES
                </button>
              </div>
            </div>
          </motion.div>
        );
      default: // Overview
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-gray-900 to-black p-6 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                    Membership Status
                  </p>
                  <h2 className="text-2xl font-bold">CLUB MEMBER</h2>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/70">
                  <span className="text-xs font-bold">ACTIVE</span>
                </div>
              </div>
              <div className="mt-8 flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Total Credits</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {user.credits || 0}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Member since</p>
                  <p className="text-sm font-medium">{user.memberSince}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-900 hover:border-black transition-colors cursor-pointer group">
                <MapPin className="w-5 h-5 mb-2 text-gray-500 group-hover:text-black" />
                <h4 className="font-bold text-sm">Addresses</h4>
                <p className="text-xs text-gray-500">
                  {user.ciudad || "Manage addresses"}
                </p>
              </div>
              <div className="p-4 border border-gray-900 hover:border-black transition-colors cursor-pointer group">
                <CreditCard className="w-5 h-5 mb-2 text-gray-500 group-hover:text-black" />
                <h4 className="font-bold text-sm">Payment Methods</h4>
                <p className="text-xs text-gray-500">Manage your cards</p>
              </div>
              <div className="p-4 border border-gray-900 hover:border-black transition-colors cursor-pointer group">
                <Shield className="w-5 h-5 mb-2 text-gray-500 group-hover:text-black" />
                <h4 className="font-bold text-sm">Privacy</h4>
                <p className="text-xs text-gray-500">Data & permissions</p>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-36 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header del Perfil */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {/* AQUÍ USAMOS EL COMPONENTE AVATAR DISPLAY */}
            <AvatarDisplay size="large" />

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hello, {user.nombre || user.apodo || "Member"}
              </h1>
              <p className="text-sm text-gray-500">{user.correo}</p>
              {user.ciudad && (
                <p className="text-xs text-gray-400 mt-1 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" /> {user.ciudad}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar de Navegación + Logout */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-900 p-2 space-y-1">
              {/* Items del menú */}
              {[
                { id: "overview", label: "Overview", icon: User },
                { id: "orders", label: "My Orders", icon: Package },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? "bg-black text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}

              {/* Separador */}
              <div className="my-2 border-t border-gray-400 mx-2"></div>

              {/* Botón Logout en el Sidebar */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1">
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
