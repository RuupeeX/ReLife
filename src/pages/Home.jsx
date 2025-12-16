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
// 1. IMPORTAR CONTEXTO MONEDA Y REVIEWS
import { useCurrency } from "../context/CurrencyContext";
import ReviewSection from "../components/ReviewSection";

const Home = () => {
  const { formatPrice } = useCurrency();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Convertimos precios a números para que funcione el conversor
  const products = [
    {
      name: "AKIP80 LORS V2 'BLACK PRANTOY'",
      price: 190.0,
      image: "/images/bands-bluenavy-hoodie.png",
    },
    {
      name: "VORTER 'GLOSSY BLACK'",
      price: 170.0,
      image: "/images/bands-bluenavy-hoodie.png",
    },
    {
      name: "VENTURE HI 'TEXTILE BLACK'",
      price: 240.0,
      image: "/images/bands-bluenavy-hoodie.png",
    },
    {
      name: "AKIP80 LORS 'BLACK CROCO'",
      price: 100.0,
      image: "/images/bands-bluenavy-hoodie.png",
    },
    {
      name: "RUNNER PRO 'BLACK EDITION'",
      price: 220.0,
      image: "/images/bands-bluenavy-hoodie.png",
    },
    {
      name: "URBAN JACKET 'MATTE BLACK'",
      price: 180.0,
      image: "/images/product2.png",
    },
    {
      name: "TECH HOODIE 'STEALTH'",
      price: 150.0,
      image: "/images/product3.png",
    },
    {
      name: "CARGOS 'BLACK CAMO'",
      price: 130.0,
      image: "/images/product4.png",
    },
  ];

  const scrollLeft = (id) => {
    const container = document.getElementById(id);
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = (id) => {
    const container = document.getElementById(id);
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="pt-20 bg-white">
      
      {/* 1. BANNER HERO (Estructura original, estilo mejorado) */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: "url('/images/bannerGoat.png')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/20 z-0"></div>

        <div className="text-center text-white z-10 px-4 max-w-5xl">
          <h1 className="text-5xl md:text-8xl font-black mb-8 uppercase tracking-tighter shadow-sm">
            Rise With The Crew
          </h1>
          <Link to="/shop" onClick={scrollToTop}>
            <button className="bg-white text-black hover:bg-black hover:text-white px-10 py-4 text-sm font-bold tracking-[0.2em] uppercase border border-white transition-all duration-300">
              Shop Now
            </button>
          </Link>
        </div>
      </section>

      {/* 2. INFO ENVÍO (Estructura original, iconos más limpios) */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: RefreshCw,
                title: "14 DAYS RETURN POLICY",
                description: "Devoluciones gratuitas durante 14 días",
              },
              {
                icon: Truck,
                title: "FREE SHIPPING OVER 50€",
                description: "Envío gratuito en pedidos superiores a 50€",
              },
              {
                icon: Globe,
                title: "WORLDWIDE SHIPPING",
                description: "Envíos a todo el mundo",
              },
            ].map((item, index) => (
              <div key={index} className="text-center p-6">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-black" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORÍAS 3 COLUMNAS (TOPS, BOTTOMS, ACC) */}
      <div className="bg-white">
        <div className="flex flex-col md:flex-row w-full h-auto md:h-[85vh]">
          {/* Categoría 1 - TOPS */}
          <Link
            to="/shop?category=tops"
            onClick={scrollToTop}
            className="relative overflow-hidden flex-1 h-[60vh] md:h-full group border-r border-white/10"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('/images/tops1.png')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
              <div className="absolute bottom-8 left-8">
                <h3 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter">
                  Tops
                </h3>
                <p className="text-sm font-bold text-white uppercase tracking-widest opacity-90">
                  Up to 75% Off
                </p>
              </div>
              <div className="absolute bottom-8 right-8">
                <button className="bg-white text-black w-10 h-10 flex items-center justify-center hover:bg-black border border-white hover:text-white transition-colors duration-300">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-6 right-6 bg-white text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
                -75%
              </div>
            </div>
          </Link>

          {/* Categoría 2 - BOTTOMS */}
          <Link
            to="/shop?category=bottoms"
            onClick={scrollToTop}
            className="relative overflow-hidden flex-1 h-[60vh] md:h-full group border-r border-white/10"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('/images/bottons.png')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
              <div className="absolute bottom-8 left-8">
                <h3 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter">
                  Bottoms
                </h3>
                <p className="text-sm font-bold text-white uppercase tracking-widest opacity-90">
                  Up to 70% Off
                </p>
              </div>
              <div className="absolute bottom-8 right-8">
                <button className="bg-white text-black w-10 h-10 flex items-center justify-center hover:bg-black border border-white hover:text-white transition-colors duration-300">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-6 right-6 bg-white text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
                -70%
              </div>
            </div>
          </Link>

          {/* Categoría 3 - ACCESSORIES */}
          <Link
            to="/shop?category=accessories"
            onClick={scrollToTop}
            className="relative overflow-hidden flex-1 h-[60vh] md:h-full group"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('/images/accessories.png')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
              <div className="absolute bottom-8 left-8">
                <h3 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter">
                  Accessories
                </h3>
                <p className="text-sm font-bold text-white uppercase tracking-widest opacity-90">
                  Up to 50% Off
                </p>
              </div>
              <div className="absolute bottom-8 right-8">
                <button className="bg-white text-black w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white border border-white transition-colors duration-300">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-6 right-6 bg-white text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
                -50%
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. DISCOVER BY CATEGORY */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="container mx-auto px-4 mb-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-10 uppercase tracking-tighter">
              Discover by Category
            </h2>
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                {[
                  "NEW ARRIVALS", "FOOTWEAR", "DENIM PANTS", "JERSEYS",
                  "KNITWEAR", "TRACK JACKETS", "HOODIES", "T-SHIRTS",
                ].map((category, index) => (
                  <Link
                    key={index}
                    to={`/shop?category=${category.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={scrollToTop}
                    className="group relative"
                  >
                    <span className="text-sm font-bold text-gray-500 group-hover:text-black transition-colors uppercase tracking-widest">
                        {category}
                    </span>
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. CARRUSEL DE PRODUCTOS 1 */}
        <div className="relative group/carousel">
          <div
            id="products-carousel"
            className="flex overflow-x-auto scrollbar-hide space-x-px pb-8 border-t border-b border-gray-100 "
            style={{ scrollbarWidth: "none" }}
          >
            {products.map((product, index) => (
              <Link
                key={index}
                to={`/producto/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={scrollToTop}
                className="group flex-shrink-0 w-72 bg-white p-4 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-square bg-gray-50 mb-4 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${product.image}')` }}
                  ></div>
                </div>
                <h4 className="text-xs font-bold text-gray-900 mb-1 line-clamp-1 uppercase tracking-wide">
                  {product.name}
                </h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <button className="mt-4 w-full bg-black text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                  Add to Cart
                </button>
              </Link>
            ))}
          </div>

          {/* Flechas Carrusel */}
          <button
            onClick={() => scrollLeft("products-carousel")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border-r border-gray-200 w-12 h-16 items-center justify-center hover:bg-gray-50"
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>
          <button
            onClick={() => scrollRight("products-carousel")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border-l border-gray-200 w-12 h-16 items-center justify-center hover:bg-gray-50"
          >
            <ChevronRight className="w-6 h-6 text-black" />
          </button>
        </div>

        <div className="text-center mt-12">
            <Link to="/shop" onClick={scrollToTop}>
              <button className="bg-white text-black border border-black px-12 py-3 text-xs font-bold uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-all duration-300">
                View All Products
              </button>
            </Link>
        </div>
      </section>

      {/* 6. NEW ARRIVALS & DENIMS (2 Columnas) */}
      <div className="bg-white">
        <div className="flex flex-col md:flex-row w-full h-[95vh]">
          {/* New Arrivals */}
          <Link
            to="/shop?category=new-arrivals"
            onClick={scrollToTop}
            className="relative overflow-hidden flex-1 h-full group border-r border-white"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
              style={{ backgroundImage: "url('/images/newarrivals.png')" }}
            ></div>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-5xl md:text-7xl font-black text-white mb-2 uppercase tracking-tighter">
                  New <br/> Arrivals
                </h3>
                <span className="inline-block border-b-2 border-white text-white font-bold uppercase tracking-widest text-sm pb-1">Shop Collection</span>
              </div>
            </div>
          </Link>

          {/* New Denims */}
          <Link
            to="/shop?category=denim-pants"
            onClick={scrollToTop}
            className="relative overflow-hidden flex-1 h-full group"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
              style={{ backgroundImage: "url('/images/newdenims.png')" }}
            ></div>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-5xl md:text-7xl font-black text-white mb-2 uppercase tracking-tighter">
                  Denim <br/> Series
                </h3>
                <span className="inline-block border-b-2 border-white text-white font-bold uppercase tracking-widest text-sm pb-1">Shop Denim</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 7. BEST SELLERS SECTION */}
      <section className="bg-white py-20">
        <div className="relative">
          <div className="container mx-auto px-4 mb-10 flex flex-col md:flex-row items-center justify-between">
             <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
                Best Sellers
             </h2>
             <Link to="/shop" onClick={scrollToTop}>
                <button className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all mt-4 md:mt-0">
                    View All
                </button>
             </Link>
          </div>

          {/* Carrusel 2 (Igual que el 1) */}
          <div className="relative group/carousel">
            <div
              id="best-sellers-carousel"
              className="flex overflow-x-auto scrollbar-hide space-x-px pb-8 border-t border-b border-gray-100"
              style={{ scrollbarWidth: "none" }}
            >
              {products.map((product, index) => (
                <Link
                  key={index}
                  to={`/producto/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={scrollToTop}
                  className="group flex-shrink-0 w-72 bg-white p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-square bg-gray-50 mb-4 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${product.image}')` }}
                    ></div>
                    <div className="absolute top-0 left-0 bg-black text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                      Top {index + 1}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 mb-1 line-clamp-1 uppercase tracking-wide">
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <button className="mt-4 w-full bg-black text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    Add to Cart
                  </button>
                </Link>
              ))}
            </div>

            <button onClick={() => scrollLeft("best-sellers-carousel")} className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border-r border-gray-200 w-12 h-16 items-center justify-center hover:bg-gray-50">
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>
            <button onClick={() => scrollRight("best-sellers-carousel")} className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border-l border-gray-200 w-12 h-16 items-center justify-center hover:bg-gray-50">
              <ChevronRight className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. OUTERWEAR & FOOTWEAR (2 Columnas) */}
      <div className="bg-white">
        <div className="flex flex-col md:flex-row w-full h-[95vh]">
          {/* Outerwear */}
          <Link
            to="/shop?category=jackets"
            onClick={scrollToTop}
            className="relative overflow-hidden flex-1 h-full group border-r border-white"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
              style={{ backgroundImage: "url('/images/outerwear.png')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-4xl md:text-6xl font-black text-white mb-2 uppercase tracking-tighter">
                  Outerwear
                </h3>
                <p className="text-sm font-bold text-white uppercase tracking-widest border-b border-white inline-block pb-1">
                  Shop Now
                </p>
              </div>
            </div>
          </Link>

          {/* Footwear */}
          <Link
            to="/shop?category=footwear"
            onClick={scrollToTop}
            className="relative overflow-hidden flex-1 h-full group"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
              style={{ backgroundImage: "url('/images/footwear.png')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-4xl md:text-6xl font-black text-white mb-2 uppercase tracking-tighter">
                  Footwear
                </h3>
                <p className="text-sm font-bold text-white uppercase tracking-widest border-b border-white inline-block pb-1">
                  Shop Now
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* 7. WINTER ESSENTIALS SECTION */}
      <section className="bg-white py-20">
        <div className="relative">
          <div className="container mx-auto px-4 mb-10 flex flex-col md:flex-row items-center justify-between">
             <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
                Winter Essentials
             </h2>
             <Link to="/shop" onClick={scrollToTop}>
                <button className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all mt-4 md:mt-0">
                    View All
                </button>
             </Link>
          </div>

          {/* Carrusel 2 (Igual que el 1) */}
          <div className="relative group/carousel">
            <div
              id="best-sellers-carousel"
              className="flex overflow-x-auto scrollbar-hide space-x-px pb-8 border-t border-b border-gray-100"
              style={{ scrollbarWidth: "none" }}
            >
              {products.map((product, index) => (
                <Link
                  key={index}
                  to={`/producto/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={scrollToTop}
                  className="group flex-shrink-0 w-72 bg-white p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-square bg-gray-50 mb-4 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${product.image}')` }}
                    ></div>
                    <div className="absolute top-0 left-0 bg-black text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                      Top {index + 1}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 mb-1 line-clamp-1 uppercase tracking-wide">
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <button className="mt-4 w-full bg-black text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    Add to Cart
                  </button>
                </Link>
              ))}
            </div>

            <button onClick={() => scrollLeft("best-sellers-carousel")} className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border-r border-gray-200 w-12 h-16 items-center justify-center hover:bg-gray-50">
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>
            <button onClick={() => scrollRight("best-sellers-carousel")} className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border-l border-gray-200 w-12 h-16 items-center justify-center hover:bg-gray-50">
              <ChevronRight className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. SECCIÓN DE RESEÑAS */}
      <ReviewSection />
      
    </div>
  );
};

export default Home;