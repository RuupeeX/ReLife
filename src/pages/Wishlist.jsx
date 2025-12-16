import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight, HeartOff } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCurrency } from "../context/CurrencyContext";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // 2. USAR EL HOOK PARA FORMATEAR PRECIOS
  const { formatPrice } = useCurrency();

  // --- ESTADO VACÍO ---
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-24">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50 p-6 rounded-full mb-6"
        >
          <HeartOff className="w-12 h-12 text-gray-300" />
        </motion.div>
        <h2 className="text-2xl font-bold tracking-tight mb-2 uppercase">
          Your Wishlist is Empty
        </h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like you haven't added any items to your wishlist yet. Explore
          our collection and find your new favorites.
        </p>
        <Link
          to="/shop"
          className="group flex items-center bg-black border border-black text-white px-8 py-3 text-sm font-medium hover:bg-white hover:text-black transition-all"
        >
          CONTINUE SHOPPING
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  // --- CON CONTENIDO ---
  return (
    <div className="container mx-auto px-4 pt-32 pb-16 min-h-screen">
      {/* Header Wishlist */}
      <div className="flex items-end justify-between mb-10 border-b border-gray-100 pb-4">
        <h1 className="text-3xl font-bold tracking-tight uppercase">
          Wishlist
        </h1>
        <p className="text-gray-500 text-sm mb-1 font-medium">
          {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}{" "}
          Saved
        </p>
      </div>

      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12"
      >
        <AnimatePresence>
          {wishlistItems.map((product) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group relative flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden mb-2">
                {/* ENLACE EN LA IMAGEN */}
                <Link
                  to={`/producto/${product.id}`}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "instant" })
                  }
                  className="block w-full h-full"
                >
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : product.image
                    }
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                  />

                  {/* Tag Sold Out */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                      <span className="text-white text-lg font-bold uppercase tracking-wider">
                        SOLD OUT
                      </span>
                    </div>
                  )}
                </Link>

                {/* Botón Eliminar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-600 hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 z-30"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col">
                <Link
                  to={`/producto/${product.id}`}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "instant" })
                  }
                  className="block"
                >
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 uppercase">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-sm font-medium text-black">
                    {/* CAMBIO AQUÍ: Usamos formatPrice para la moneda */}
                    {formatPrice(product.price)}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`mt-4 w-full flex items-center justify-center space-x-2 border py-2 text-xs font-bold uppercase tracking-wider transition-colors
                    ${
                      product.stock === 0
                        ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                        : "bg-black text-white border-black hover:bg-gray-800"
                    }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Wishlist;
