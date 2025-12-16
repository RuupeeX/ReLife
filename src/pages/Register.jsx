import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  MapPin,
  UserCircle,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apodo: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
    ciudad: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulamos carga para UX
    setTimeout(() => {
      register(formData);
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  const benefits = [
    "200 Welcome Credits",
    "Early Access Drops",
    "Free Shipping +50€",
    "Member Exclusives",
  ];

  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
      {/* 1. SECCIÓN DERECHA - FORMULARIO */}
      <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center relative bg-white overflow-hidden no-scrollbar">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md px-8 py-8"
        >
          {/* Cabecera Centrada */}
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block mb-6 group">
              <img
                src="/images/logoGrafiti1.png"
                alt="Holo Logo"
                className="h-14 w-auto mx-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <h1 className="text-3xl font-black text-black uppercase tracking-tighter mb-2">
              Create Account
            </h1>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest">
              Begin your journey with us
            </p>
          </div>

          {/* Formulario Compacto */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fila 1: Nombre y Usuario */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Name
                </label>
                <div className="relative group">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full pl-7 pr-2 py-2 border-b border-gray-300 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300 rounded-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Username
                </label>
                <div className="relative group">
                  <UserCircle className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <input
                    type="text"
                    name="apodo"
                    value={formData.apodo}
                    onChange={handleChange}
                    required
                    className="w-full pl-7 pr-2 py-2 border-b border-gray-300 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300 rounded-none"
                    placeholder="johndoe"
                  />
                </div>
              </div>
            </div>

            {/* Fila 2: Email y Ciudad */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                    className="w-full pl-7 pr-2 py-2 border-b border-gray-300 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300 rounded-none"
                    placeholder="mail@ex.com"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  City
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    className="w-full pl-7 pr-2 py-2 border-b border-gray-300 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300 rounded-none"
                    placeholder="Madrid"
                  />
                </div>
              </div>
            </div>

            {/* Fila 3: Contraseñas (Full width o grid) */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <input
                    type="password"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    required
                    className="w-full pl-7 pr-4 py-2 border-b border-gray-300 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300 rounded-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <input
                    type="password"
                    name="confirmarContrasena"
                    value={formData.confirmarContrasena}
                    onChange={handleChange}
                    required
                    className="w-full pl-7 pr-4 py-2 border-b border-gray-300 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300 rounded-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Términos */}
            <div className="flex items-start space-x-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-0.5 h-3 w-3 text-black focus:ring-black border-gray-300 rounded-none"
              />
              <label
                htmlFor="terms"
                className="text-[10px] text-gray-500 leading-tight"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-black font-bold hover:underline"
                >
                  Terms
                </Link>{" "}
                &{" "}
                <Link
                  to="/privacy"
                  className="text-black font-bold hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Botón Registro */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white border border-black h-12 mt-6 flex items-center justify-center space-x-2 hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                    Create Account
                  </span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center border-t border-gray-100 pt-4">
            <p className="text-gray-500 text-[10px] mb-2">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="text-black text-[10px] font-bold uppercase tracking-widest hover:text-gray-600 transition-colors border-b border-black pb-0.5"
            >
              Sign In Here
            </Link>
          </div>
        </motion.div>
      </div>

      {/* 2. SECCIÓN IZQUIERDA - VISUAL + BENEFICIOS */}
      <div className="hidden lg:flex w-1/2 h-full relative bg-black items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          // Usa una imagen diferente a la del login, quizás más "grupal" o de producto
          style={{ backgroundImage: "url('/images/bannerRegister.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>

        <div className="relative z-10 p-12 max-w-lg text-left">
          <div className="inline-block bg-white text-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-6">
            Limited Time Offer
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
            Unlock
            <br />
            Access.
          </h2>

          {/* Bloque de Beneficios Estilizado */}
          <div className="mt-8 border-t border-white/20 pt-8">
            <p className="text-xl font-bold text-white mb-6 uppercase tracking-wide">
              Join now & get{" "}
              <span className="text-gray-300 border-b border-gray-300">
                200 Credits
              </span>
            </p>
            <ul className="grid grid-cols-1 gap-4">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center text-gray-300 text-xs uppercase tracking-widest"
                >
                  <Check className="w-4 h-4 mr-3 text-white" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
