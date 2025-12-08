import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Trash2,
  Truck,
  Shield,
  CreditCard,
} from "lucide-react";
import CheckoutForm from "./CheckoutForm";
import { products } from "../data/products";

const CartPanel = () => {
  const {
    items,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartItemsCount,
    clearCart,
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);

  const slideIn = {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: { type: "spring", damping: 25, stiffness: 200 },
  };

  const handleCheckout = () => {
    setShowCheckout(true);
    toggleCart();
  };

  // Calcular si el envío es gratis
  const isFreeShipping = getCartTotal() >= 50;
  const shippingNeeded = Math.max(0, 50 - getCartTotal());

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Overlay oscuro */}
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleCart}
            />

            {/* Panel del carrito */}
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 flex flex-col"
              variants={slideIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Header del carrito */}
              <div className="flex items-center justify-between p-6 border-b border-black bg-white">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <ShoppingBag className="w-6 h-6 text-black" />
                    {getCartItemsCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {getCartItemsCount()}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">YOUR CART</h2>
                </div>
                <button
                  onClick={toggleCart}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Contenido del carrito */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center text-gray-500 mt-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      Add items to get started
                    </p>
                    <button
                      onClick={toggleCart}
                      className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-colors duration-200"
                    >
                      CONTINUE SHOPPING
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        className="flex items-start space-x-4 bg-white border border-black rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        {/* Imagen del producto */}
                        <div
                          className="w-20 h-20 bg-gray-100 bg-cover bg-center rounded-lg flex-shrink-0"
                          // CORRECCIÓN AQUÍ: Usar item.images[0] porque tus productos tienen un array de imágenes
                          style={{
                            backgroundImage: `url(${
                              item.images && item.images.length > 0
                                ? item.images[0]
                                : item.image
                            })`,
                          }}
                        ></div>

                        {/* Detalles del producto */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                                {item.name}
                              </h3>
                              <p className="text-gray-500 text-xs mb-2">
                                Size: {item.size || "M"} | Color:{" "}
                                {item.color || "Black"}
                              </p>
                              <p className="text-black font-bold text-lg">
                                €{item.price}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 hover:bg-gray-100 text-gray-500 hover:text-red-600 rounded transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Contador de cantidad */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="w-7 h-7 flex items-center justify-center border border-black rounded hover:bg-gray-100 transition-colors duration-200"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>

                              <span className="w-8 text-center font-semibold text-gray-900">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-7 h-7 flex items-center justify-center border border-black rounded hover:bg-gray-100 transition-colors duration-200"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-gray-500">Subtotal</p>
                              <p className="font-bold text-gray-900">
                                €{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer del carrito (solo si hay items) */}
              {items.length > 0 && (
                <div className="border-t border-black bg-white p-6 space-y-4">
                  {/* Resumen de compra */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">
                        €{getCartTotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-blue-700">
                        {isFreeShipping ? "FREE" : `€5.99`}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-black">
                          €
                          {(
                            getCartTotal() +
                            (isFreeShipping ? 0 : 5.99)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de progreso de envío gratis */}
                  {!isFreeShipping && (
                    <div className="bg-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          Add €{shippingNeeded.toFixed(2)} more for FREE
                          SHIPPING
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              (getCartTotal() / 50) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="space-y-3">
                    <motion.button
                      onClick={handleCheckout}
                      className="w-full bg-black text-white py-3 font-md text-lg border border-black shadow-lg hover:bg-white hover:text-black transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>CHECKOUT SECURELY</span>
                    </motion.button>

                    <div
                      className="w-full text-gray-600 hover:text-gray-800 py-1 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
                    >
                      <span>or</span>
                    </div>

                    <button
                      onClick={toggleCart}
                      className="w-full border border-black text-black hover:bg-black hover:text-white py-3 font-medium transition-colors duration-200"
                    >
                      CONTINUE SHOPPING
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Formulario de checkout */}
      <AnimatePresence>
        {showCheckout && (
          <CheckoutForm
            onClose={() => setShowCheckout(false)}
            cartItems={items}
            total={getCartTotal() * 1.21 + (isFreeShipping ? 0 : 5.99)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CartPanel;
