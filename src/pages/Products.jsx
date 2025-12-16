import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { products as allProducts } from "../data/products";
import { ChevronDown, Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
// 1. IMPORTAR CONTEXTO MONEDA
import { useCurrency } from "../context/CurrencyContext";

// Función para obtener parámetros de búsqueda de la URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

// --- COMPONENTES DE DROPDOWN (INTACTOS) ---
const FilterDropdown = ({ title, options, filterValue, setFilterValue, isOpen, onToggle, onClose }) => {
    const handleSelect = (e, option) => {
        e.stopPropagation(); 
        setFilterValue(option);
        onClose();
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isOpen && event.target.closest('.filter-dropdown') === null) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
        else document.removeEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isOpen, onClose]);

    return (
        <div className="relative filter-dropdown">
            <button 
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                className={`flex items-center space-x-1 text-xs text-gray-700 font-medium cursor-pointer uppercase py-2 px-4 border transition-all duration-200 ${isOpen ? 'bg-gray-300 border-gray-300' : 'bg-gray-200 border-gray-200 hover:bg-gray-300'}`}
            >
                <span>{title}</span>
                <ChevronDown className={`w-3 h-3 text-black transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white shadow-xl border border-gray-200 z-10 max-h-60 overflow-y-auto">
                    <button 
                        onClick={(e) => handleSelect(e, "")} 
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filterValue === "" ? 'font-bold bg-gray-100' : ''}`}
                    >
                        ALL {title}S
                    </button>
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={(e) => handleSelect(e, option)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filterValue === option ? 'font-bold bg-gray-100' : ''}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const SortDropdown = ({ sortBy, setSortBy, isOpen, onToggle, onClose }) => {
    const handleSelect = (e, option) => {
        e.stopPropagation();
        setSortBy(option);
        onClose();
    };
    
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isOpen && event.target.closest('.sort-dropdown') === null) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
        else document.removeEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isOpen, onClose]);

    return (
        <div className="relative sort-dropdown">
            <button 
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                className={`flex items-center space-x-1 text-xs text-gray-700 font-medium cursor-pointer uppercase py-2 px-4 border transition-all duration-200 ${isOpen ? 'bg-gray-300 border-gray-300' : 'bg-gray-200 border-gray-200 hover:bg-gray-300'}`}
            >
                <span>SORT BY:</span>
                <ChevronDown className={`w-3 h-3 text-black transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white shadow-xl border border-gray-200 z-10">
                    {[
                        { label: "Default", value: "default" },
                        { label: "Price: Low to High", value: "price-low" },
                        { label: "Price: High to Low", value: "price-high" },
                        { label: "Name: A to Z", value: "name-asc" },
                    ].map((option) => (
                        <button 
                            key={option.value} 
                            onClick={(e) => handleSelect(e, option.value)} 
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === option.value ? 'font-bold bg-gray-100' : ''}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- COMPONENTE PRINCIPAL PRODUCTS ---

const Products = () => {
  const query = useQuery();
  const initialCategoryFilter = query.get("category");
  const searchQuery = query.get("search");

  // --- HOOKS ---
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency(); // 2. USAR EL HOOK

  // --- ESTADOS ---
  const [colorFilter, setColorFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter || ""); 
  const [sortBy, setSortBy] = useState("default");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [modelView, setModelView] = useState(false); 
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownToggle = (dropdownName) => {
    setActiveDropdown(prev => prev === dropdownName ? null : dropdownName);
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
  };

  useEffect(() => {
    if (initialCategoryFilter !== categoryFilter) {
      setCategoryFilter(initialCategoryFilter || "");
    }
  }, [initialCategoryFilter]); 

  const normalize = (text) => (text ? text.toLowerCase().replace(/\s+/g, "") : "");

  const handleLinkClick = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 100);
  };

  const getTitle = () => {
    if (categoryFilter) {
      return categoryFilter.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    if (searchQuery) {
      return `SEARCH RESULTS FOR: "${searchQuery.toUpperCase()}"`;
    }
    return "ALL"; 
  };

  // --- LÓGICA DE FILTRADO (Sin cambios) ---
  const filteredProducts = useMemo(() => {
    let result = allProducts;
    const normalizedCategoryFilter = normalize(categoryFilter);
    const normalizedSearchQuery = normalize(searchQuery);

    if (categoryFilter) {
        result = result.filter(product => 
            (product.mainCategory && normalize(product.mainCategory) === normalizedCategoryFilter) || 
            (product.subCategory && normalize(product.subCategory) === normalizedCategoryFilter) || 
            (product.collection && normalize(product.collection) === normalizedCategoryFilter) ||
            normalize(product.name).includes(normalizedCategoryFilter)
        );
    }
    if (searchQuery) {
      result = result.filter(product => 
        normalize(product.name).includes(normalizedSearchQuery) || 
        normalize(product.description).includes(normalizedSearchQuery) || 
        (product.mainCategory && normalize(product.mainCategory).includes(normalizedSearchQuery)) ||
        (product.subCategory && normalize(product.subCategory).includes(normalizedSearchQuery))
      );
    }
    if (colorFilter) {
      result = result.filter(product => 
        product.color && normalize(product.color) === normalize(colorFilter)
      );
    }
    if (sizeFilter) {
      result = result.filter(product => 
        product.size && normalize(product.size) === normalize(sizeFilter)
      );
    }
    if (showOnlyAvailable) {
        result = result.filter(product => product.stock > 0);
    }

    switch (sortBy) {
      case "price-low": return [...result].sort((a, b) => a.price - b.price);
      case "price-high": return [...result].sort((a, b) => b.price - a.price);
      case "name-asc": return [...result].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc": return [...result].sort((a, b) => b.name.localeCompare(a.name));
      default: return result;
    }
  }, [categoryFilter, searchQuery, colorFilter, sizeFilter, sortBy, showOnlyAvailable]);

  // --- EXTRACCIÓN DE OPCIONES (Sin cambios) ---
  const allColors = useMemo(() => {
    const colors = new Set();
    allProducts.forEach(product => { if (product.color) colors.add(product.color); });
    return Array.from(colors).sort();
  }, []); 

  const allSizes = useMemo(() => {
    const sizes = new Set();
    allProducts.forEach(product => { if (product.size) sizes.add(product.size); });
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '40', '41', '42', '43', '44', '45'];
    return Array.from(sizes).sort((a, b) => {
        const idxA = sizeOrder.indexOf(a);
        const idxB = sizeOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        return a.localeCompare(b);
    });
  }, []);
  
  const allCategories = useMemo(() => {
    const cats = new Set();
    allProducts.forEach(product => {
        if(product.mainCategory) cats.add(product.mainCategory);
        if(product.subCategory) cats.add(product.subCategory);
    });
    return Array.from(cats).sort();
  }, []);

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="w-full">
        
        {/* FILTROS SUPERIORES */}
        <div className="relative w-full">
          <div className="text-center pt-12 pb-2">
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
                {getTitle()}
            </h1>
          </div>

          <div className="flex justify-between items-start pt-4 px-4"> 
            
            {/* Checkboxes */}
            <div className="w-1/4 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-medium text-gray-700">
                  <input type="checkbox" id="available" checked={showOnlyAvailable} onChange={(e) => setShowOnlyAvailable(e.target.checked)} className="appearance-none w-4 h-4 border border-gray-400 checked:bg-black checked:border-black transition duration-150 relative top-0.5 cursor-pointer" />
                  <label htmlFor="available" className="uppercase cursor-pointer mt-1">ONLY SHOW AVAILABLE PRODUCTS</label>
              </div>
              <div className="flex items-center space-x-2 text-xs font-medium text-gray-700">
                  <input type="checkbox" id="model" checked={modelView} onChange={(e) => setModelView(e.target.checked)} className="appearance-none w-4 h-4 border border-gray-400 checked:bg-black checked:border-black transition duration-150 relative top-0.5 cursor-pointer" />
                  <label htmlFor="model" className="uppercase cursor-pointer mt-1">MODEL VIEW</label>
              </div>
            </div>
            
            {/* Dropdowns */}
            <div className="flex items-center space-x-1.5 pt-0.5">
              <FilterDropdown 
                  title="COLOR" 
                  options={allColors} 
                  filterValue={colorFilter} 
                  setFilterValue={setColorFilter}
                  isOpen={activeDropdown === 'color'} 
                  onToggle={() => handleDropdownToggle('color')}
                  onClose={closeAllDropdowns}
              />
              <FilterDropdown 
                  title="SIZE" 
                  options={allSizes} 
                  filterValue={sizeFilter} 
                  setFilterValue={setSizeFilter}
                  isOpen={activeDropdown === 'size'} 
                  onToggle={() => handleDropdownToggle('size')}
                  onClose={closeAllDropdowns}
              />
              <FilterDropdown 
                title="CATEGORY" 
                options={allCategories} 
                filterValue={categoryFilter} 
                setFilterValue={(value) => { 
                    setCategoryFilter(value); 
                    const url = value ? `/shop?category=${normalize(value)}` : '/shop';
                    window.history.pushState(null, '', url); 
                }}
                isOpen={activeDropdown === 'category'} 
                onToggle={() => handleDropdownToggle('category')}
                onClose={closeAllDropdowns}
              />
              <SortDropdown 
                  sortBy={sortBy} 
                  setSortBy={setSortBy}
                  isOpen={activeDropdown === 'sort'} 
                  onToggle={() => handleDropdownToggle('sort')}
                  onClose={closeAllDropdowns}
              />
            </div>
            
            {/* Contador */}
            <p className="text-xs text-gray-800 font-normal whitespace-nowrap pt-2 w-1/4 text-right">
              {filteredProducts.length} PRODUCTS
            </p>
          </div>

          <div className="border-t border-gray-200 mt-4 "></div>
        </div>

        {/* Cuadrícula de Productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-gray-100 rounded-lg mx-4">
            <p className="text-xl text-gray-500 mb-4">No products found.</p>
            <button 
              onClick={() => { setColorFilter(""); setSizeFilter(""); setCategoryFilter(""); setSortBy("default"); window.history.pushState(null, '', '/shop'); }}
              className="inline-block text-black font-bold hover:text-gray-700 transition-colors"
            >
              CLEAR ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 pb-12 px-4 mt-10"> 
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative">
                <Link to={`/producto/${product.id}`} onClick={handleLinkClick}>

                  <div className="relative aspect-square bg-gray-100 mb-2 overflow-hidden">
                    <img
                      src={modelView && product.images[1] ? product.images[1] : product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                    
                    {/* --- OVERLAY "SOLD OUT" --- */}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                        <span className="text-white text-lg font-bold uppercase tracking-wider">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                    {/* ------------------------------------------------ */}

                    {/* --- Botón Wishlist Overlay (SOLO VISIBLE EN HOVER) --- */}
                    <button 
                        onClick={(e) => {
                            e.preventDefault(); 
                            e.stopPropagation();
                            toggleWishlist(product);
                        }}
                        // AÑADIDO: opacity-0 group-hover:opacity-100 para mostrar solo al pasar el ratón
                        // Opcional: He añadido una condición extra: si ya está en wishlist, se muestra siempre (mejor UX).
                        // Si quieres que SIEMPRE se oculte, quita la condición ${isInWishlist...} y deja solo group-hover:opacity-100
                        className={`absolute top-2 right-2 p-2 rounded-full bg-white/50 hover:bg-white transition-all z-30 opacity-0 group-hover:opacity-100 ${isInWishlist(product.id) ? "opacity-100" : ""}`}
                    >
                         <Heart 
                            className={`w-4 h-4 transition-colors ${isInWishlist(product.id) ? "fill-black text-black" : "text-gray-900"}`} 
                         />
                    </button>

                    {/* Badges */}
                    {product.collection === "NEW ARRIVALS" && product.stock > 0 && ( 
                        <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2 py-1">
                          NEW
                        </div>
                    )}
                  </div>
                  
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 uppercase">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium text-black">
                    {/* 3. CAMBIO DE PRECIO AQUI */}
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.mainCategory} / {product.subCategory}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;