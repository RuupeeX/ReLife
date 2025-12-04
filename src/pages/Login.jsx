// pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });

  const [isLoading, setIsLoading] = useState(false);
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

    // Simulación de login
    setTimeout(() => {
      setIsLoading(false);
      alert("¡Login exitoso! (Esta es una demostración)");
      navigate("/");
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-150 overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl p-6 border border-gray-900">
            {/* Logo y título compacto */}
            <div className="text-center mb-6">
              <Link to="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-block"
                >
                  <img
                    src="/images/logoGrafiti1.png"
                    alt="Aureum Logo"
                    className="h-14 w-auto mx-auto mb-3"
                  />
                </motion.div>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                WELCOME BACK
              </h1>
              <p className="text-sm text-gray-600">
                Access your account to manage orders
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email or Username
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                      className="pl-9 w-full px-3 py-2.5 text-sm border border-gray-900 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-black hover:text-gray-800 transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      name="contrasena"
                      value={formData.contrasena}
                      onChange={handleChange}
                      required
                      className="pl-9 w-full px-3 py-2.5 text-sm border border-gray-900 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Recordarme */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-3.5 w-3.5 text-black focus:ring-black border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-xs text-gray-700"
                >
                  Remember me
                </label>
              </div>

              {/* Botón de login */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full bg-black text-white py-3 rounded-lg font-bold text-base shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">SIGNING IN...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">SIGN IN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Separador */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-500"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Login rápido */}
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center space-x-2 py-2.5 text-sm border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-2.5 text-sm border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.31-2.33 1.05-3.11z" />
                </svg>
                <span className="font-medium">Apple</span>
              </button>
            </div>

            {/* Enlace a registro */}
            <div className="text-center mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-600 mb-2">
                Don't have an account?
              </p>
              <Link
                to="/register"
                className="inline-flex items-center space-x-1 text-xs text-black font-bold hover:text-gray-800 transition-colors"
              >
                <span>Join the Members Club</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <p className="text-[10px] text-gray-500 mt-1">
                Get <span className="font-bold">200 FREE CREDITS</span> when you
                register
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer minimalista */}
      <div className="py-3 border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 space-y-1 sm:space-y-0">
            <div>
              <Link to="/" className="hover:text-black transition-colors">
                ← Back to Home
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/terms" className="hover:text-black transition-colors">
                Terms
              </Link>
              <Link
                to="/privacy"
                className="hover:text-black transition-colors"
              >
                Privacy
              </Link>
              <Link to="/help" className="hover:text-black transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
