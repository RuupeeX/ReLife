import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom'; // Importante: Necesario para el logo
import { 
  X, 
  HelpCircle, 
  Lock
} from 'lucide-react';

const CheckoutForm = ({ onClose, cartItems = [], total = 0 }) => {
  // --- LÓGICA (STATE) ---
  const [step, setStep] = useState(1); // 1: Envío, 2: Revisión y Pagos
  const [formData, setFormData] = useState({
    email: '',
    createAccount: false,
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const [errors, setErrors] = useState({});

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Campo obligatorio';
    if (!formData.firstName) newErrors.firstName = 'Campo obligatorio';
    if (!formData.lastName) newErrors.lastName = 'Campo obligatorio';
    if (!formData.address) newErrors.address = 'Campo obligatorio';
    if (!formData.city) newErrors.city = 'Campo obligatorio';
    if (!formData.zipCode) newErrors.zipCode = 'Campo obligatorio';
    if (!formData.phone) newErrors.phone = 'Campo obligatorio';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      alert("¡Pedido realizado con éxito!");
      onClose();
    }
  };

  // --- RENDERIZADO ---
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 w-screen h-screen bg-white z-[100] overflow-y-auto font-sans"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
      >
        {/* --- HEADER (LOGO + STEPPER) --- */}
        <div className="sticky top-0 bg-white z-20 pt-6 pb-2 border-b border-transparent md:border-gray-100 shadow-sm md:shadow-none">
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
                {/* Botón Cerrar */}
                <button 
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 hover:bg-gray-100 transition-colors md:right-8 z-30"
                >
                    <X className="w-6 h-6 text-black" />
                </button>

                {/* LOGO DE IMAGEN */}
                <div className="flex justify-center mb-6">
                    <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link to="/">
                            <img
                                src="/images/logoGrafiti1.png"
                                alt="Aureum Logo"
                                className="h-16 w-auto"
                                onClick={() => {
                                    setTimeout(() => {
                                        window.scrollTo({ top: 0, behavior: "instant" });
                                    }, 100);
                                }}
                            />
                        </Link>
                    </motion.div>
                </div>

                {/* STEPPER */}
                <div className="flex justify-center items-center max-w-lg mx-auto mb-4">
                    {/* Paso 1 */}
                    <div className="flex flex-col items-center relative z-10 cursor-pointer" onClick={() => step > 1 && setStep(1)}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${step >= 1 ? 'bg-black border-black text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                            1
                        </div>
                        <span className={`text-[10px] md:text-xs mt-2 uppercase font-bold tracking-wide ${step >= 1 ? 'text-black' : 'text-gray-400'}`}>
                            Envío
                        </span>
                    </div>

                    {/* Línea conectora */}
                    <div className="h-[1px] w-24 md:w-48 bg-gray-200 -mt-6 mx-2 relative">
                        <div 
                            className="h-full bg-black transition-all duration-500 ease-out"
                            style={{ width: step === 2 ? '100%' : '0%' }}
                        />
                    </div>

                    {/* Paso 2 */}
                    <div className="flex flex-col items-center relative z-10">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${step === 2 ? 'bg-black border-black text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                            2
                        </div>
                        <span className={`text-[10px] md:text-xs mt-2 uppercase font-bold tracking-wide ${step === 2 ? 'text-black' : 'text-gray-400'}`}>
                            Pagos
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* --- GRID PRINCIPAL --- */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                
                {/* COLUMNA IZQUIERDA: FORMULARIO */}
                <div className="lg:w-[60%] order-2 lg:order-1 min-h-[50vh]">
                    
                    {step === 1 ? (
                        <motion.form 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                            onSubmit={handleNext}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-baseline border-b border-gray-200 pb-4 mb-8">
                                <h2 className="text-base font-bold uppercase tracking-tight underline underline-offset-4 decoration-2">Iniciar Sesión</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold uppercase mb-4">Dirección de envío</h3>
                                    <label className="block text-xs font-bold uppercase text-gray-800 mb-2">
                                        Dirección de Correo Electrónico <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full border p-3 text-sm focus:border-black focus:ring-0 outline-none rounded-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-400'}`}
                                        />
                                        <HelpCircle className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    
                                    <div className="flex items-start mt-4 space-x-3">
                                        <input
                                            id="createAccount"
                                            name="createAccount"
                                            type="checkbox"
                                            checked={formData.createAccount}
                                            onChange={handleInputChange}
                                            className="mt-1 h-4 w-4 border-gray-400 text-black focus:ring-black rounded-none cursor-pointer"
                                        />
                                        <label htmlFor="createAccount" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                                            <span className="font-bold text-gray-900 block mb-1">Crear cuenta</span>
                                            ¡Crea tu cuenta ya! Podrás seguir cómodamente tus pedidos y acceder a lanzamientos exclusivos.
                                        </label>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 my-8"></div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-800 mb-2">
                                                Nombre <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className={`w-full border p-3 text-sm focus:border-black focus:ring-0 outline-none rounded-none ${errors.firstName ? 'border-red-500' : 'border-gray-400'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-800 mb-2">
                                                Apellido <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className={`w-full border p-3 text-sm focus:border-black focus:ring-0 outline-none rounded-none ${errors.lastName ? 'border-red-500' : 'border-gray-400'}`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-800 mb-2">
                                            Dirección <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className={`w-full border p-3 text-sm focus:border-black focus:ring-0 outline-none rounded-none ${errors.address ? 'border-red-500' : 'border-gray-400'}`}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-800 mb-2">
                                                Ciudad <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className={`w-full border p-3 text-sm focus:border-black focus:ring-0 outline-none rounded-none ${errors.city ? 'border-red-500' : 'border-gray-400'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-800 mb-2">
                                                Código Postal <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                className={`w-full border p-3 text-sm focus:border-black focus:ring-0 outline-none rounded-none ${errors.zipCode ? 'border-red-500' : 'border-gray-400'}`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-800 mb-2">
                                            Número de Teléfono <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`w-full border p-3 text-sm focus:border-black focus:ring-0 outline-none rounded-none ${errors.phone ? 'border-red-500' : 'border-gray-400'}`}
                                            />
                                            <HelpCircle className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8">
                                <button 
                                    type="submit"
                                    className="w-full md:w-auto bg-black text-white px-16 py-4 uppercase font-bold text-sm hover:bg-gray-800 transition-colors tracking-widest rounded-none shadow-lg"
                                >
                                    Siguiente: Revisión
                                </button>
                            </div>
                        </motion.form>
                    ) : (
                        // PASO 2: REVISIÓN Y PAGO
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            <div className="border border-black bg-gray-50 p-6">
                                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                                    <h3 className="text-sm font-bold uppercase">Datos de Envío</h3>
                                    <button onClick={() => setStep(1)} className="text-xs underline hover:text-gray-600 font-bold">Editar</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Contacto</p>
                                        <p className="font-medium">{formData.email}</p>
                                        <p>{formData.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Dirección</p>
                                        <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                                        <p>{formData.address}</p>
                                        <p>{formData.city}, {formData.zipCode}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold uppercase mb-6 flex items-center gap-2">
                                    <Lock className="w-5 h-5" /> Pago Seguro
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="border border-black bg-white p-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-4 h-4 rounded-full bg-black border border-black flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                            </div>
                                            <span className="font-bold uppercase text-sm">Tarjeta de Crédito / Débito</span>
                                        </div>
                                        
                                        <div className="pl-7 space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Número de tarjeta"
                                                className="w-full border border-gray-400 p-3 text-sm focus:border-black outline-none rounded-none"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="MM / AA"
                                                    className="w-full border border-gray-400 p-3 text-sm focus:border-black outline-none rounded-none"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="CVC"
                                                    className="w-full border border-gray-400 p-3 text-sm focus:border-black outline-none rounded-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-gray-200 bg-white p-4 opacity-75 hover:opacity-100 transition-opacity cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                                            <span className="font-bold uppercase text-sm">PayPal</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleNext}
                                className="w-full bg-black text-white py-5 uppercase font-bold text-sm tracking-widest hover:bg-gray-800 transition-colors rounded-none mt-4"
                            >
                                Realizar Pedido - €{total.toFixed(2)}
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* COLUMNA DERECHA: RESUMEN */}
                <div className="lg:w-[40%] order-1 lg:order-2">
                    <div className="bg-[#F9F9F9] p-6 md:p-10 sticky top-32 border border-black">
                      <h2 className="text-base font-bold uppercase mb-6">Resumen del Pedido:</h2>
                        
                        <div className="space-y-6 mb-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-20 h-24 bg-white border border-gray-700 flex-shrink-0">
                                        <img 
                                            src={item.images?.[0] || item.image} 
                                            alt={item.name} 
                                            className="w-full h-full object-contain  mix-blend-multiply"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-xs font-bold uppercase leading-relaxed pr-2 max-w-[170px]">
                                                {item.name}
                                            </h3>
                                            <span className="text-xs font-medium">
                                                {(item.price * item.quantity).toFixed(2)} €
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 uppercase">Cantidad: {item.quantity}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">Talla: {item.size || 'N/A'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-700 pt-6 space-y-3">
                            <div className="flex justify-between text-xs text-gray-600 uppercase">
                                <span>Subtotal</span>
                                <span>{(total / 1.21).toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600 uppercase">
                                <span>Envío</span>
                                <span className="text-green-600 font-bold">Gratis</span>
                            </div>
                            
                            <div className="flex justify-between items-baseline border-t border-gray-700 pt-6 mt-4">
                                <span className="text-lg font-bold uppercase">Total del Pedido</span>
                                <div className="text-right">
                                    <span className="text-xl font-bold">{total.toFixed(2)} €</span>
                                    <p className="text-[10px] text-gray-500 uppercase mt-1">IVA Incluido</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckoutForm;