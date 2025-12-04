import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const ShopDropdown = ({ headerHeight }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      {/* Botón de Activación */}
      <motion.button
        className="flex items-center space-x-1 text-gray-700 hover:text-blue-700 font-medium transition-colors duration-300 text-xs tracking-widest"
        whileHover={{ y: -1 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>SHOP</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay para cerrar al hacer clic fuera */}
            <div 
              className="fixed left-0 right-0 z-40 bg-black/10"
              style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight}px)` }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Contenido del Dropdown */}
            <motion.div
              className="fixed left-0 right-0 bg-white shadow-2xl z-50 overflow-hidden border-t border-gray-200"
              style={{ top: `${headerHeight}px` }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >

              {/* Contenido principal del Dropdown */}
              <div className="py-6">
                <div className="container mx-auto pl-8 pr-0">
                  
                  {/* Contenedor principal */}
                  <div className="flex"> 
                    
                    {/* COLUMNA IZQUIERDA: CATEGORÍAS SIN BORDE DERECHO */}
                    <div className="w-[58%] grid grid-cols-5 gap-6 pr-8">
                      
                      {/* Sub-sección SHOP ALL */}
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide mb-4">SHOP ALL</h3>
                        <div className="space-y-1">
                          {["BLACK WEEK", "NEW ARRIVALS", "SOFTS COLLECTION", "CLASSIC COLLECTION", "ACTIVEWEAR", "TRACKSUITS"].map((item, index) => (
                            <a
                              key={index}
                              href="#"
                              className="text-xs text-gray-600 hover:text-blue-700 block py-1 transition-colors duration-200"
                            >
                              {item}
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Categorías principales */}
                      {["TOPS", "BOTTOMS", "FOOTWEAR", "ACCESSORIES"].map((category, index) => (
                        <div key={index}>
                          <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide mb-4">{category}</h3>
                          <div className="space-y-1">
                            {category === "TOPS" && ["T-SHIRTS", "HOODIES", "TRACK JACKETS", "JERSEYS", "KNITWEAR", "JACKETS"].map((item, i) => (
                              <a key={i} href="#" className="text-xs text-gray-600 hover:text-blue-700 block py-1 transition-colors duration-200">
                                {item}
                              </a>
                            ))}
                            {category === "BOTTOMS" && ["DENIM PANTS", "CARGO PANTS", "JOGGERS", "TRACK PANTS", "JORTS", "SHORTS", "SWIMSHORTS", "UNDERWEAR"].map((item, i) => (
                              <a key={i} href="#" className="text-xs text-gray-600 hover:text-blue-700 block py-1 transition-colors duration-200">
                                {item}
                              </a>
                            ))}
                            {category === "FOOTWEAR" && ["ARMBO LOWS", "VORTEX", "VENTURE", "VITORIA", "V-SLIDES"].map((item, i) => (
                              <a key={i} href="#" className="text-xs text-gray-600 hover:text-blue-700 block py-1 transition-colors duration-200">
                                {item}
                              </a>
                            ))}
                            {category === "ACCESSORIES" && ["CAPS", "BAGS", "BEANIES", "CARDHOLDER", "BELTS", "RINGS", "RUGS"].map((item, i) => (
                              <a key={i} href="#" className="text-xs text-gray-600 hover:text-blue-700 block py-1 transition-colors duration-200">
                                {item}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* COLUMNA DERECHA: IMAGEN */}
                    <div className="w-[42%]">
                      <div className="relative w-full h-full min-h-[610px] -my-6 ml-28">
                        {/* Imagen de fondo */}
                        <img 
                          src="/images/dropbanner.png" 
                          alt="SOFTS COLLECTION" 
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Efecto sombra superior */}
                        <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-black/70 via-black/40 to-transparent pointer-events-none"></div>
                        
                        {/* Texto superpuesto */}
                        <div className="absolute inset-0 flex flex-col justify-start pt-10 px-8">
                          <div className="text-white text-center relative z-10">
                            <h4 className="font-bold text-3xl mb-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                              SOFTS COLLECTION
                            </h4>
                            <p className="text-sm mb-6 opacity-95 leading-relaxed max-w-sm mx-auto text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                              Discover our premium soft collection designed for comfort.
                            </p>
                            <a
                              href="#"
                              className="inline-block text-base font-semibold text-white hover:text-gray-100 border-b-2 border-white pb-1.5 px-8 transition-all duration-300 hover:scale-105 hover:border-gray-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                            >
                              VIEW ALL
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopDropdown;