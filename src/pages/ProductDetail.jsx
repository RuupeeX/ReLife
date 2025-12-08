import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  ChevronDown,
  Plus,
  Minus,
  Check,
  CreditCard,
  Truck,
  Info,
} from "lucide-react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

// Componente para los Acordeones (Details, Fit, Shipping)
const AccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    // CAMBIO: Añadido 'mb-2' para separación y mantenido el borde
    <div className="border-b border-gray-200 mb-2 last:mb-0 last:border-b-0">
      <button
        className="w-full py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
        onClick={onClick}
      >
        <span className="font-bold text-xs uppercase tracking-wider text-gray-900">
          {title}
        </span>
        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm text-gray-600 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Estados
  const [selectedSize, setSelectedSize] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null); // 'details', 'fit', 'shipping'
  const [selectedLookItems, setSelectedLookItems] = useState([]);

  // Encontrar producto
  const product = products.find((p) => p.id === parseInt(id));

  // Productos sugeridos para "Complete the Look" (Excluyendo el actual)
  const completeTheLookProducts = products
    .filter((p) => p.id !== product?.id)
    .slice(0, 2);

  if (!product) return <div>Cargando...</div>;

  // Lógica del acordeón
  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  // Lógica "Complete the look"
  const toggleLookItem = (itemId) => {
    if (selectedLookItems.includes(itemId)) {
      setSelectedLookItems(selectedLookItems.filter((id) => id !== itemId));
    } else {
      setSelectedLookItems([...selectedLookItems, itemId]);
    }
  };

  // Tallas disponibles (Mock)
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="pt-24 pb-12 bg-white min-h-screen font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Botón Volver */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-500 hover:text-black mb-8 text-sm uppercase tracking-wide font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-20">
          {/* COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES */}
          <div className="lg:w-[60%]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Si hay múltiples imágenes, las mostramos. Si no, repetimos la principal */}
              {(product.images && product.images.length > 0
                ? product.images
                : [product.image, product.image, product.image, product.image]
              )
                .slice(0, 4)
                .map((img, index) => (
                  <div
                    key={index}
                    // AQUÍ ESTÁ EL CAMBIO: Añadimos lógica condicional para el índice 2 (la tercera imagen)
                    className={`relative bg-gray-100 aspect-[3/4] overflow-hidden ${
                      index === 2 ? "md:col-span-2" : ""
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: INFORMACIÓN Y COMPRA (Sticky) */}
          <div className="lg:w-[40%]">
            <div className="sticky top-24 space-y-8">
              {/* Header del Producto */}
              <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-2xl lg:text-2xl font-bold text-gray-900 uppercase tracking-tight">
                  {product.name}
                </h1>
                <p className="text-xl font-medium text-gray-900">
                  {product.price.toFixed(2)}€
                </p>
                <p className="text-xs text-gray-500">
                  Tax included.{" "}
                  <span className="underline cursor-pointer">Shipping</span>{" "}
                  calculated at checkout.
                </p>

                {/* Estrellas */}
                <div className="flex justify-center lg:justify-start items-center space-x-1 pt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-black text-black"
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-2">
                    (12 Reviews)
                  </span>
                </div>
              </div>

              {/* Selector de Tallas */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Size: {selectedSize || "Select"}
                  </span>
                  <button className="text-xs text-gray-500 underline flex items-center gap-1">
                    <Info className="w-3 h-3" /> Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 flex items-center justify-center text-xs font-medium border transition-all duration-200
                        ${
                          selectedSize === size
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-900 border-gray-200 hover:border-gray-900"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón Añadir al Carrito */}
              <div className="space-y-3">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-black text-white py-4 px-8 uppercase font-bold tracking-widest text-md hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Add to Cart</span>
                </button>

                {/* Iconos de Pago (Simulados) */}
                <div className="flex justify-center gap-2 opacity-60 grayscale">
                  <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold">
                    VISA
                  </div>
                  <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold">
                    MC
                  </div>
                  <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold">
                    AMEX
                  </div>
                  <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold">
                    PAYPAL
                  </div>
                  <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold">
                    APPLE
                  </div>
                </div>
              </div>

              {/* Indicadores de Stock y Envío */}
              <div className="bg-gray-200 p-4 rounded text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                  LOW STOCK
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                  {/* AQUÍ ESTÁ EL CAMBIO */}
                  <img
                    src="https://flagcdn.com/es.svg"
                    alt="Bandera de España"
                    className="w-5 h-auto shadow-sm rounded-[1px]" // Ajusta w-4 o w-5 según prefieras el tamaño
                  />
                  <p>FREE SHIPPING IN SPAIN FOR ORDERS OVER €225</p>
                </div>
              </div>

              {/* Acordeones de Información */}
              <div className="border-t border-gray-200 pt-2 space-y-1">
                <AccordionItem
                  title="DETAILS"
                  isOpen={openAccordion === "details"}
                  onClick={() => toggleAccordion("details")}
                >
                  <p>{product.description}</p>
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li>100% Organic Cotton</li>
                    <li>Heavyweight fabric (300gsm)</li>
                    <li>Boxy fit</li>
                    <li>Made in Portugal</li>
                  </ul>
                </AccordionItem>

                <AccordionItem
                  title="FIT INFORMATION"
                  isOpen={openAccordion === "fit"}
                  onClick={() => toggleAccordion("fit")}
                >
                  <p>
                    This item is designed for an oversized fit. We recommend
                    taking your true size for the intended look, or sizing down
                    for a more regular fit.
                  </p>
                </AccordionItem>

                <AccordionItem
                  title="SHIPPING"
                  isOpen={openAccordion === "shipping"}
                  onClick={() => toggleAccordion("shipping")}
                >
                  <p>
                    Standard shipping takes 3-5 business days. Express shipping
                    options available at checkout. Worldwide shipping available.
                  </p>
                </AccordionItem>
              </div>

              {/* Complete The Look Section */}
              {completeTheLookProducts.length > 0 && (
                <div className="pt-6">
                  <h3 className="text-sm font-bold uppercase tracking-wide mb-4 text-center">
                    Complete the Look
                  </h3>
                  <div className="space-y-4">
                    {completeTheLookProducts.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 border border-gray-100 p-3 rounded hover:border-gray-300 transition-colors"
                      >
                        <div
                          className="w-16 h-20 bg-gray-100 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${
                              item.images?.[0] || item.image
                            })`,
                          }}
                        ></div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="text-xs font-bold uppercase">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {item.price.toFixed(2)}€
                          </p>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleLookItem(item.id)}
                            className={`w-6 h-6 border flex items-center justify-center transition-colors
                              ${
                                selectedLookItems.includes(item.id)
                                  ? "bg-black border-black text-white"
                                  : "bg-white border-gray-300"
                              }
                            `}
                          >
                            {selectedLookItems.includes(item.id) && (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}

                    {selectedLookItems.length > 0 && (
                      <button className="w-full bg-white border border-black text-black py-3 text-xs font-bold uppercase hover:bg-black hover:text-white transition-all">
                        Add Selected to Cart
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
