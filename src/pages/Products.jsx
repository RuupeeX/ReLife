import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { Truck, Package, Gem, Star, Frown } from 'lucide-react'; 

const Products = () => {
  const { addToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState('Todos');

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Obtener categorías únicas
  const categories = ['Todos', ...new Set(products.map(product => product.category))];

  // Filtrar productos según la categoría activa
  const filteredProducts = activeFilter === 'Todos' 
    ? products 
    : products.filter(product => product.category === activeFilter);

  // Contador de productos por categoría
  const getProductCount = (category) => {
    if (category === 'Todos') return products.length;
    return products.filter(product => product.category === category).length;
  };

  return (
    <div className="pt-20">
      {/* Hero Section Productos */}
      <section className="relative py-20 bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-serif"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Nuestra Colección
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Descubre nuestra exclusiva gama de aceites de oliva virgen extra, 
            elaborados con la máxima dedicación y calidad artesanal.
          </motion.p>
        </div>
      </section>

      {/* Filtros Funcionales */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-full border transition-all duration-300 flex items-center space-x-2 ${
                  activeFilter === filter
                    ? 'bg-amber-600 border-amber-600 text-white shadow-lg'
                    : 'border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{filter}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeFilter === filter
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {getProductCount(filter)}
                </span>
              </motion.button>
            ))}
          </div>
          
          {/* Contador de resultados */}
          <motion.div 
            className="text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
          </motion.div>
        </div>
      </section>

      {/* Grid de Productos Filtrados */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Reemplazo de 😔 por Frown */}
              <div className="text-6xl mb-4 flex justify-center">
                <Frown className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No hay productos en esta categoría</h3>
              <p className="text-gray-600 mb-6">Prueba con otra categoría para descubrir nuestros productos</p>
              <button
                onClick={() => setActiveFilter('Todos')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Ver Todos los Productos
              </button>
            </motion.div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              variants={stagger}
              initial="initial"
              animate="animate"
              key={activeFilter} 
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                >
                  <Link onClick={() => window.scrollTo(0, 0)} to={`/producto/${product.id}`} className="block">
                    <div className="relative h-64 overflow-hidden">
                      <div 
                        className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                        style={{ backgroundImage: `url(${product.image})` }}
                      ></div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {product.size}
                        </span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 text-amber-700 px-2 py-1 rounded text-xs font-medium">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <Link onClick={() => window.scrollTo(0, 0)} to={`/producto/${product.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-amber-600 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    </Link>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-amber-600">€{product.price}</span>
                      <div className="flex items-center space-x-1 text-amber-500">
                        {/* Reemplazo de ★ por Star (usando un icono) */}
                        <Star className="w-4 h-4 fill-amber-500" />
                        <Star className="w-4 h-4 fill-amber-500" />
                        <Star className="w-4 h-4 fill-amber-500" />
                        <Star className="w-4 h-4 fill-amber-500" />
                        <Star className="w-4 h-4 fill-amber-500" />
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Añadir
                      </motion.button>
                      <Link onClick={() => window.scrollTo(0, 0)}
                        to={`/producto/${product.id}`}
                        className="flex items-center justify-center w-12 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300"
                      >
                        <span className="text-gray-600">→</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Características */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid md:grid-cols-3 gap-8 text-center"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              {
                icon: Truck, 
                title: 'Envío Gratis',
                description: 'En pedidos superiores a €50'
              },
              {
                icon: Package, 
                title: 'Embalaje Premium',
                description: 'Presentación exclusiva para regalo'
              },
              {
                icon: Gem, 
                title: 'Calidad Garantizada',
                description: 'Aceite de oliva virgen extra certificado'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                {/* Renderizamos el componente del icono */}
                <div className="text-4xl mb-4 flex justify-center">
                    <item.icon className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Products;