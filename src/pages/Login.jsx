import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(formData);
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    // 1. Cambiado min-h-screen a h-screen y añadido overflow-hidden para evitar scroll
    <div className="h-screen flex w-full bg-white font-sans overflow-hidden">
      
      {/* SECCIÓN IZQUIERDA - VISUAL */}
      <div className="hidden lg:flex w-1/2 h-full relative bg-black items-center justify-center">
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: "url('/images/bannerLogin.png')" }} 
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
        
        <div className="relative z-10 text-center p-12 max-w-lg">
             <h2 className="text-6xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                Join The<br/>Cult.
             </h2>
             <p className="text-gray-300 text-sm tracking-[0.2em] uppercase border-t border-white/30 pt-6 mt-6 inline-block">
                Exclusive access • Early Drops • Members Only
             </p>
        </div>
      </div>

      {/* SECCIÓN DERECHA - FORMULARIO */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-8 lg:p-24 bg-white overflow-hidden no-scrollbar">
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-md py-8" 
        >
          {/* Cabecera Centrada */}
          <div className="mb-10 text-center">
             <Link to="/" className="inline-block mb-8 group">
                <img
                  src="/images/logoGrafiti1.png"
                  alt="Aureum Logo"
                  // 2. Eliminado 'lg:mx-0', asegurando que mx-auto siempre aplique
                  className="h-14 w-auto mx-auto transition-transform duration-300 group-hover:scale-105"
                />
             </Link>
             <h1 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter mb-2">
               Member Login
             </h1>
             <p className="text-gray-500 text-xs uppercase tracking-widest">
               Please enter your details
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Email */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                <div className="relative group">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
                    <input
                        type="text"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                        className="w-full pl-8 pr-4 py-3 border-b border-gray-300 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300 rounded-none"
                        placeholder="john@example.com"
                    />
                </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Password</label>
                    <Link to="/forgot-password" className="text-[10px] text-gray-400 hover:text-black transition-colors uppercase tracking-wider">
                        Forgot?
                    </Link>
                </div>
                <div className="relative group">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
                    <input
                        type="password"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleChange}
                        required
                        className="w-full pl-8 pr-4 py-3 border-b border-gray-300 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300 rounded-none"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {/* Botón Login */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white border border-black h-14 mt-8 flex items-center justify-center space-x-2 hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Sign In</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
          </form>

          {/* Social Login Minimalista */}
          <div className="mt-10">
            <div className="relative flex justify-center text-xs uppercase tracking-widest mb-6">
                <span className="bg-white px-2 text-gray-400 z-10">Or connect with</span>
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center h-12 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-300">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Google</span>
                </button>
                <button className="flex items-center justify-center h-12 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-300">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.29-1.23 3.57-.8 2.38.2 3.35 1.74 3.79 2.37-3.23 1.83-2.67 5.75.12 6.94-.65 1.55-1.63 3.08-2.56 3.72zm-3.15-16c.39 2.08-1.57 3.9-3.41 3.65-.43-1.83 1.63-3.8 3.41-3.65z"/></svg>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Apple</span>
                </button>
            </div>
          </div>

          {/* Footer Registro */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-xs mb-3">Not a member yet?</p>
            <Link to="/register" className="inline-block border border-black text-black px-8 py-3 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-all duration-300">
                Create Account
            </Link>
          </div>

        </motion.div>
      </div>

    </div>
  );
};

export default Login;