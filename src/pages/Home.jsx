import React from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  RefreshCw,
  Globe,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Home = () => {
  const products = [
    {
      name: "AKIP80 LORS V2 'BLACK PRANTOY'",
      price: "190.00€",
      image: "/images/bands-bluenavy-hoodie.png",
    },
    {
      name: "VORTER 'GLOSSY BLACK'",
      price: "170.00€",
      image: "/images/bands-bluenavy-hoodie.png",
    },
    {
      name: "VENTURE HI 'TEXTILE BLACK'",
      price: "240.00€",
      image: "/images/bands-bluenavy-hoodie.png",
    },
    {
      name: "AKIP80 LORS 'BLACK CROCO'",
      price: "100.00€",
      image: "/images/bands-bluenavy-hoodie.png",
    },
    {
      name: "RUNNER PRO 'BLACK EDITION'",
      price: "220.00€",
      image: "/images/bands-bluenavy-hoodie.png",
    },
    {
      name: "URBAN JACKET 'MATTE BLACK'",
      price: "180.00€",
      image: "/images/product2.png",
    },
    {
      name: "TECH HOODIE 'STEALTH'",
      price: "150.00€",
      image: "/images/product3.png",
    },
    {
      name: "CARGOS 'BLACK CAMO'",
      price: "130.00€",
      image: "/images/product4.png",
    },
  ];

  const scrollLeft = () => {
    const container = document.getElementById("products-carousel");
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById("products-carousel");
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="pt-20">
      {/* Banner Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/prueba.png')",
          }}
        ></div>

        <div className="absolute inset-0 bg-black/10 z-0"></div>

        <div className="text-center text-white z-10 px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif">
            RISE WITH THE CREW
          </h1>
          <Link to="/productos">
            <button className="bg-white text-black hover:bg-black hover:text-white px-8 py-3 font-bold text-lg shadow-lg border border-white hover:border-white transition-all duration-300">
              SHOP NOW
            </button>
          </Link>
        </div>
      </section>

      {/* Información de Envío y Clientes CON ICONOS - ESTÁTICAS */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: RefreshCw,
                title: "14 DAYS RETURN POLICY",
                description: "Devoluciones gratuitas durante 14 días",
                color: "text-black",
              },
              {
                icon: Truck,
                title: "FREE SHIPPING OVER 50€",
                description: "Envío gratuito en pedidos superiores a 50€",
                color: "text-black",
              },
              {
                icon: Globe,
                title: "WORLDWIDE SHIPPING",
                description: "Envíos a todo el mundo",
                color: "text-black",
              },
            ].map((item, index) => (
              <div key={index} className="text-center p-8">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <item.icon className={`w-12 h-12 ${item.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías con Descuentos - CON MÁRGENES */}
      <div className="bg-gray-100">
        <div className="flex flex-col md:flex-row w-full">
          {/* Categoría 1 - TOPS */}
          <Link
            to="/productos?categoria=tops"
            className="relative overflow-hidden flex-1 h-[85vh] group md:mr-1"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/tops1.png')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              {/* Texto principal */}
              <div className="absolute bottom-5 left-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  TOPS
                </h3>
                <p className="text-4xl md:text-3xl font-bold text-white">
                  UP TO 75% OFF
                </p>
              </div>

              {/* Botón en esquina inferior derecha con flecha */}
              <div className="absolute bottom-4 right-4">
                <button className="bg-white text-black px-8 py-3 font-bold text-lg shadow-lg flex items-center space-x-2">
                  <span>OFFERS</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Badge descuento */}
              <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 font-bold text-xl">
                -75%
              </div>
            </div>
          </Link>

          {/* Categoría 2 - BOTTOMS */}
          <Link
            to="/productos?categoria=bottoms"
            className="relative overflow-hidden flex-1 h-[85vh] group mx-1"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/bottons.png')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              {/* Texto principal */}
              <div className="absolute bottom-5 left-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  BOTTOMS
                </h3>
                <p className="text-4xl md:text-3xl font-bold text-white">
                  UP TO 70% OFF
                </p>
              </div>

              {/* Botón en esquina inferior derecha con flecha */}
              <div className="absolute bottom-4 right-4">
                <button className="bg-white text-black px-8 py-3 font-bold text-lg shadow-lg flex items-center space-x-2">
                  <span>OFFERS</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Badge descuento */}
              <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 font-bold text-xl">
                -70%
              </div>
            </div>
          </Link>

          {/* Categoría 3 - ACCESSORIES */}
          <Link
            to="/productos?categoria=accesorios"
            className="relative overflow-hidden flex-1 h-[85vh] group md:ml-1"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/accessories.png')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              {/* Texto principal */}
              <div className="absolute bottom-5 left-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  ACCESSORIES
                </h3>
                <p className="text-4xl md:text-3xl font-bold text-white">
                  UP TO 50% OFF
                </p>
              </div>

              {/* Botón en esquina inferior derecha con flecha */}
              <div className="absolute bottom-4 right-4">
                <button className="bg-white text-black px-8 py-3 font-bold text-lg shadow-lg flex items-center space-x-2">
                  <span>OFFERS</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Badge descuento */}
              <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 font-bold text-xl">
                -50%
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Sección DISCOVER BY CATEGORY - CON CARRUSEL PEGADO A BORDES */}
      <section className="bg-white py-16">
        <div className="relative">
          {/* Título principal - CON PADDING */}
          <div className="container mx-auto px-4 mb-12">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                DISCOVER BY CATEGORY
              </h2>

              {/* Categorías centradas */}
              <div className="flex justify-center">
                <div className="flex flex-wrap justify-center gap-8">
                  {[
                    "NEW ARRIVALS",
                    "FOOTWEAR",
                    "DENIMS",
                    "JERSEYS",
                    "KNITWEAR",
                    "TRACKSUITS",
                    "HOODIES",
                    "T-SHIRTS",
                  ].map((category, index) => (
                    <Link
                      key={index}
                      to={`/productos?categoria=${category
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="group"
                    >
                      <div className="text-center">
                        <div className="text-lg md:text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors whitespace-nowrap">
                          {category}
                        </div>
                        <div className="mt-2 h-1 w-full bg-transparent group-hover:bg-blue-700 transition-colors"></div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Carrusel de Productos PEGADO A BORDES */}
          <div className="relative">
            {/* Contenedor del carrusel SIN MÁRGENES LATERALES */}
            <div
              id="products-carousel"
              className="flex overflow-x-auto scrollbar-hide space-x-6 pb-8 pl-4"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollPaddingLeft: "0",
                scrollPaddingRight: "0",
              }}
            >
              {products.map((product, index) => (
                <Link
                  key={index}
                  to={`/producto/${product.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="group flex-shrink-0 w-64 first:ml-0 last:mr-0"
                >
                  <div className="relative aspect-square bg-gray-100 mb-4 overflow-hidden rounded-lg">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage: `url('${product.image}')`,
                      }}
                    ></div>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      {product.price}
                    </span>
                  </div>
                  {/* Botón rápido */}
                  <button className="mt-4 w-full bg-black text-white py-2 font-semibold hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100 transition-opacity">
                    AÑADIR AL CARRITO
                  </button>
                </Link>
              ))}
            </div>

            {/* Botón izquierdo - POSICIONADO EN EL BORDE */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-lg ml-2"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>

            {/* Botón derecho - POSICIONADO EN EL BORDE */}
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-lg mr-2"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>

          {/* Botón VER TODOS - CON MÁRGENES NORMALES */}
          <div className="container mx-auto px-4">
            <div className="text-center mt-12">
              <Link to="/productos">
                <button className="bg-black text-white px-10 py-3 font-bold text-lg shadow-lg hover:bg-gray-800 transition-colors flex items-center space-x-2 mx-auto">
                  <span>VER TODOS LOS PRODUCTOS</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Nueva sección de 2 columnas - NEW ARRIVALS y OUTERWEAR */}
      <div className="bg-gray-100">
        <div className="flex flex-col md:flex-row w-full">
          {/* Columna 1 - NEW ARRIVALS */}
          <Link
            to="/productos?categoria=new-arrivals"
            className="relative overflow-hidden flex-1 h-[95vh] group md:mr-1"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/newarrivals.png')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
              {/* Texto principal CENTRADO */}
              <div className="text-center">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-1">
                  NEW ARRIVALS
                </h3>
                <p className="text-4xl md:text-3xl font-bold text-white">
                  SHOP NOW
                </p>
              </div>
            </div>
          </Link>

          {/* Columna 2 - NEW DENIMS*/}
          <Link
            to="/productos?categoria=outerwear"
            className="relative overflow-hidden flex-1 h-[95vh] group md:ml-1"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/newdenims.png')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-center justify-center">
              {/* Texto principal CENTRADO */}
              <div className="text-center">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-1">
                  NEW DENIMS
                </h3>
                <p className="text-4xl md:text-3xl font-bold text-white">
                  SHOP NOW
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Sección BEST SELLERS - Título a la izquierda */}
      <section className="bg-white py-16">
        <div className="relative">
          {/* Encabezado con título a la izquierda */}
          <div className="container mx-auto px-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              {/* Título a la izquierda */}
              <div className="mb-6 md:mb-0 md:w-1/3">
                <h2 className="text-4xl md:text-4xl font-bold text-gray-900">
                  BEST SELLERS
                </h2>
              </div>

              {/* Botón Ver Todos a la derecha (opcional) */}
              <div className="md:w-1/3 flex justify-end">
                <Link to="/productos?orden=mas-vendidos">
                  <button className="text-black font-bold hover:text-gray-700 transition-colors flex items-center space-x-2">
                    <span>VER TODOS LOS BEST SELLERS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Carrusel de BEST SELLERS PEGADO A BORDES */}
          <div className="relative">
            {/* Contenedor del carrusel SIN MÁRGENES LATERALES */}
            <div
              id="best-sellers-carousel"
              className="flex overflow-x-auto scrollbar-hide space-x-6 pb-8 pl-4"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollPaddingLeft: "0",
                scrollPaddingRight: "0",
              }}
            >
              {products.map((product, index) => (
                <Link
                  key={index}
                  to={`/producto/${product.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="group flex-shrink-0 w-64 first:ml-0 last:mr-0"
                >
                  <div className="relative aspect-square bg-gray-100 mb-4 overflow-hidden rounded-lg">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage: `url('${product.image}')`,
                      }}
                    ></div>
                    {/* Badge BEST SELLER */}
                    <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded-full font-bold text-sm">
                      TOP {index + 1}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      {product.price}
                    </span>
                  </div>
                  {/* Botón rápido */}
                  <button className="mt-4 w-full bg-black text-white py-2 font-semibold hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100 transition-opacity">
                    AÑADIR AL CARRITO
                  </button>
                </Link>
              ))}
            </div>

            {/* Botón izquierdo - POSICIONADO EN EL BORDE */}
            <button
              onClick={() => {
                const container = document.getElementById(
                  "best-sellers-carousel"
                );
                if (container) {
                  container.scrollBy({ left: -400, behavior: "smooth" });
                }
              }}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-lg ml-2"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>

            {/* Botón derecho - POSICIONADO EN EL BORDE */}
            <button
              onClick={() => {
                const container = document.getElementById(
                  "best-sellers-carousel"
                );
                if (container) {
                  container.scrollBy({ left: 400, behavior: "smooth" });
                }
              }}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-lg mr-2"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      </section>

      {/* Nueva sección de 2 columnas - NEW ARRIVALS y OUTERWEAR */}
      <div className="bg-gray-100">
        <div className="flex flex-col md:flex-row w-full">
          {/* Columna 1 - NEW ARRIVALS */}
          <Link
            to="/productos?categoria=new-arrivals"
            className="relative overflow-hidden flex-1 h-[95vh] group md:mr-1"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/outerwear.png')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
              {/* Texto principal CENTRADO */}
              <div className="text-center">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-1">
                  OUTERWEAR
                </h3>
                <p className="text-4xl md:text-3xl font-bold text-white">
                  SHOP NOW
                </p>
              </div>
            </div>
          </Link>

          {/* Columna 2 - NEW DENIMS*/}
          <Link
            to="/productos?categoria=outerwear"
            className="relative overflow-hidden flex-1 h-[95vh] group md:ml-1"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/footwear.png')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-center justify-center">
              {/* Texto principal CENTRADO */}
              <div className="text-center">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-1">
                  FOOTWEAR
                </h3>
                <p className="text-4xl md:text-3xl font-bold text-white">
                  SHOP NOW
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Sección BEST SELLERS - Título a la izquierda */}
      <section className="bg-white py-16">
        <div className="relative">
          {/* Encabezado con título a la izquierda */}
          <div className="container mx-auto px-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              {/* Título a la izquierda */}
              <div className="mb-6 md:mb-0 md:w-1/3">
                <h2 className="text-4xl md:text-4xl font-bold text-gray-900">
                  WINTER ESSENTIALS
                </h2>
              </div>

              {/* Botón Ver Todos a la derecha (opcional) */}
              <div className="md:w-1/3 flex justify-end">
                <Link to="/productos?orden=mas-vendidos">
                  <button className="text-black font-bold hover:text-gray-700 transition-colors flex items-center space-x-2">
                    <span>VER TODOS LOS BEST SELLERS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Carrusel de BEST SELLERS PEGADO A BORDES */}
          <div className="relative">
            {/* Contenedor del carrusel SIN MÁRGENES LATERALES */}
            <div
              id="best-sellers-carousel"
              className="flex overflow-x-auto scrollbar-hide space-x-6 pb-8 pl-4"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollPaddingLeft: "0",
                scrollPaddingRight: "0",
              }}
            >
              {products.map((product, index) => (
                <Link
                  key={index}
                  to={`/producto/${product.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="group flex-shrink-0 w-64 first:ml-0 last:mr-0"
                >
                  <div className="relative aspect-square bg-gray-100 mb-4 overflow-hidden rounded-lg">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage: `url('${product.image}')`,
                      }}
                    ></div>
                    {/* Badge BEST SELLER */}
                    <div className="absolute top-3 right-3 bg-black text-white px-2 py-1 rounded-full font-bold text-xs">
                      TOP {index + 1}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      {product.price}
                    </span>
                  </div>
                  {/* Botón rápido */}
                  <button className="mt-4 w-full bg-black text-white py-2 font-semibold hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100 transition-opacity">
                    AÑADIR AL CARRITO
                  </button>
                </Link>
              ))}
            </div>

            {/* Botón izquierdo - POSICIONADO EN EL BORDE */}
            <button
              onClick={() => {
                const container = document.getElementById(
                  "best-sellers-carousel"
                );
                if (container) {
                  container.scrollBy({ left: -400, behavior: "smooth" });
                }
              }}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-lg ml-2"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>

            {/* Botón derecho - POSICIONADO EN EL BORDE */}
            <button
              onClick={() => {
                const container = document.getElementById(
                  "best-sellers-carousel"
                );
                if (container) {
                  container.scrollBy({ left: 400, behavior: "smooth" });
                }
              }}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-lg mr-2"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
