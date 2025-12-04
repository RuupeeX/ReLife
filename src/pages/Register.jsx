// pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, MapPin, UserCircle, ArrowRight, CheckCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apodo: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    ciudad: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación de registro exitoso
    alert('¡Registro exitoso! (Esta es una demostración)');
    navigate('/');
  };

  const benefits = [
    "200 créditos de bienvenida",
    "Acceso anticipado a lanzamientos",
    "Envío gratuito en pedidos +50€",
    "Ofertas exclusivas para miembros",
    "Programa de puntos y recompensas"
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-150 overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-6 max-h-[90vh]">
            {/* Columna izquierda - Formulario */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 overflow-y-auto max-h-[90vh]"
            >
              <div className="bg-white rounded-2xl p-6 border border-gray-900">
                {/* Logo y título */}
                <div className="text-center mb-6">
                  <Link to="/">
                    <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
                      <img
                        src="/images/logoGrafiti1.png"
                        alt="Aureum Logo"
                        className="h-14 w-auto mx-auto mb-3"
                      />
                    </motion.div>
                  </Link>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    JOIN THE CLUB
                  </h1>
                  <p className="text-sm text-gray-600">
                    Create your account and get <span className="font-bold text-blue-700">200 FREE CREDITS</span>
                  </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Nombre */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                          className="pl-9 w-full px-3 py-2.5 text-sm border border-gray-900 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    {/* Apodo */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <div className="relative">
                        <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="apodo"
                          value={formData.apodo}
                          onChange={handleChange}
                          required
                          className="pl-9 w-full px-3 py-2.5 text-sm border border-gray-900 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          placeholder="johndoe"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                        className="pl-9 w-full px-3 py-2.5 text-sm border border-gray-900 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Ciudad */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        className="pl-9 w-full px-3 py-2.5 text-sm border border-gray-900 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        placeholder="Madrid, Barcelona..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Contraseña */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Password
                      </label>
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

                    {/* Confirmar Contraseña */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          name="confirmarContrasena"
                          value={formData.confirmarContrasena}
                          onChange={handleChange}
                          required
                          className="pl-9 w-full px-3 py-2.5 text-sm border border-gray-900 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Términos */}
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-0.5 h-3.5 w-3.5 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="text-xs text-gray-700">
                      I agree to the{' '}
                      <Link to="/terms" className="text-black font-medium hover:underline">
                        Terms & Conditions
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-black font-medium hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {/* Botón de registro */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-black text-white py-3 rounded-lg font-bold text-base shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span className="text-sm">CREATE ACCOUNT</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>

                {/* Enlace a login */}
                <div className="text-center mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-600">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-black font-bold hover:text-gray-800 transition-colors text-xs"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Columna derecha - Beneficios */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2 overflow-y-auto max-h-[90vh]"
            >
              <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-6 h-full">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-3">
                    MEMBER BENEFITS
                  </h2>
                  <p className="text-sm text-gray-300">
                    Join our exclusive community and enjoy premium benefits
                  </p>
                </div>

                {/* Lista de beneficios */}
                <div className="space-y-4 mb-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold">{benefit}</h3>
                        <p className="text-gray-400 text-xs">
                          Available immediately after registration
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Badge de créditos - CON AZUL */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-center mb-6">
                  <div className="text-4xl font-bold mb-1">200</div>
                  <div className="text-lg font-semibold">FREE CREDITS</div>
                  <p className="text-blue-100 text-sm mt-1">
                    Redeemable on your first purchase
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <div className="text-xl font-bold">10K+</div>
                    <div className="text-xs text-gray-300">Active Members</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <div className="text-xl font-bold">€50K+</div>
                    <div className="text-xs text-gray-300">Credits Redeemed</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <div className="text-xl font-bold">24/7</div>
                    <div className="text-xs text-gray-300">Support</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
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
              <Link to="/privacy" className="hover:text-black transition-colors">
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

export default Register;