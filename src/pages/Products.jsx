import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { products as allProducts } from "../data/products"; 
import { ChevronDown } from "lucide-react";

// Función para obtener parámetros de búsqueda de la URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

// --- COMPONENTES DE DROPDOWN ---

const FilterDropdown = ({ title, options, filterValue, setFilterValue }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (e, option) => {
        e.stopPropagation(); 
        setFilterValue(option);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isOpen && event.target.closest('.filter-dropdown') === null) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
        else document.removeEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isOpen]);

    return (
        <div className="relative filter-dropdown">
            <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="flex items-center space-x-1 text-xs text-gray-700 font-medium cursor-pointer uppercase py-2 px-4 bg-gray-200 border border-gray-200 hover:bg-gray-300 transition-all duration-200"
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

const SortDropdown = ({ sortBy, setSortBy }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (e, option) => {
        e.stopPropagation();
        setSortBy(option);
        setIsOpen(false);
    };
    
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isOpen && event.target.closest('.sort-dropdown') === null) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
        else document.removeEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isOpen]);

    return (
        <div className="relative sort-dropdown">
            <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="flex items-center space-x-1 text-xs text-gray-700 font-medium cursor-pointer uppercase py-2 px-4 bg-gray-200 border border-gray-200 hover:bg-gray-300 transition-all duration-200"
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

  // --- ESTADOS ---
  const [colorFilter, setColorFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter || ""); 
  const [sortBy, setSortBy] = useState("default");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [modelView, setModelView] = useState(false); 

  // --- SINCRONIZACIÓN DE LA URL ---
  useEffect(() => {
    if (initialCategoryFilter !== categoryFilter) {
      setCategoryFilter(initialCategoryFilter || "");
    }
  }, [initialCategoryFilter]); 

  // --- FUNCIONES DE UTILIDAD ---
  const normalize = (text) => (text ? text.toLowerCase().replace(/\s+/g, "") : "");

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

  // --- LÓGICA DE FILTRADO (ADAPTADA A LA NUEVA DATA) ---
  const filteredProducts = useMemo(() => {
    let result = allProducts;
    const normalizedCategoryFilter = normalize(categoryFilter);
    const normalizedSearchQuery = normalize(searchQuery);

    // 1. Filtrado por Categoría (Revisa Main, Sub y Collection)
    if (categoryFilter) {
        result = result.filter(product => 
            (product.mainCategory && normalize(product.mainCategory) === normalizedCategoryFilter) || 
            (product.subCategory && normalize(product.subCategory) === normalizedCategoryFilter) || 
            (product.collection && normalize(product.collection) === normalizedCategoryFilter) ||
            // Búsqueda de respaldo en el nombre por si acaso
            normalize(product.name).includes(normalizedCategoryFilter)
        );
    }

    // 2. Filtrado por Barra de Búsqueda
    if (searchQuery) {
      result = result.filter(product => 
        normalize(product.name).includes(normalizedSearchQuery) || 
        normalize(product.description).includes(normalizedSearchQuery) || 
        (product.mainCategory && normalize(product.mainCategory).includes(normalizedSearchQuery)) ||
        (product.subCategory && normalize(product.subCategory).includes(normalizedSearchQuery))
      );
    }

    // 3. Filtrado por Color
    if (colorFilter) {
      result = result.filter(product => 
        product.color && normalize(product.color) === normalize(colorFilter)
      );
    }

    // 4. Filtrado por Talla
    if (sizeFilter) {
      result = result.filter(product => 
        product.size && normalize(product.size) === normalize(sizeFilter)
      );
    }
    
    // 5. Disponibilidad
    if (showOnlyAvailable) {
        result = result.filter(product => product.stock > 0);
    }

    // 6. Ordenación
    switch (sortBy) {
      case "price-low": return [...result].sort((a, b) => a.price - b.price);
      case "price-high": return [...result].sort((a, b) => b.price - a.price);
      case "name-asc": return [...result].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc": return [...result].sort((a, b) => b.name.localeCompare(a.name));
      default: return result;
    }
  }, [categoryFilter, searchQuery, colorFilter, sizeFilter, sortBy, showOnlyAvailable]);

  // --- EXTRACCIÓN DE OPCIONES PARA FILTROS ---
  const allColors = useMemo(() => {
    const colors = new Set();
    allProducts.forEach(product => {
      if (product.color) colors.add(product.color);
    });
    return Array.from(colors).sort();
  }, []); // Dependencia vacía si allProducts es estático, o [allProducts] si viene de API

  const allSizes = useMemo(() => {
    const sizes = new Set();
    allProducts.forEach(product => {
      if (product.size) sizes.add(product.size);
    });
    // Ordenar tallas lógicamente si es posible
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '40', '41', '42', '43', '44', '45'];
    return Array.from(sizes).sort((a, b) => {
        const idxA = sizeOrder.indexOf(a);
        const idxB = sizeOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        return a.localeCompare(b);
    });
  }, []);
  
  // Categorías para el filtro interno (Mezcla de Main y Sub para dar más opciones)
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
            
            {/* Columna Izquierda: Checkboxes */}
            <div className="w-1/4 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-medium text-gray-700">
                  <input type="checkbox" id="available" checked={showOnlyAvailable} onChange={(e) => setShowOnlyAvailable(e.target.checked)} className="appearance-none w-4 h-4 border border-gray-400 checked:bg-black checked:border-black transition duration-150 relative top-0.5 cursor-pointer" />
                  <label htmlFor="available" className="uppercase cursor-pointer mt-1">
                      ONLY SHOW AVAILABLE PRODUCTS
                  </label>
              </div>
              <div className="flex items-center space-x-2 text-xs font-medium text-gray-700">
                  <input type="checkbox" id="model" checked={modelView} onChange={(e) => setModelView(e.target.checked)} className="appearance-none w-4 h-4 border border-gray-400 checked:bg-black checked:border-black transition duration-150 relative top-0.5 cursor-pointer" />
                  <label htmlFor="model" className="uppercase cursor-pointer mt-1">
                      MODEL VIEW
                  </label>
              </div>
            </div>
            
            {/* Columna Central: Dropdowns de Filtro */}
            <div className="flex items-center space-x-1.5 pt-0.5">
              <FilterDropdown title="COLOR" options={allColors} filterValue={colorFilter} setFilterValue={setColorFilter} />
              <FilterDropdown title="SIZE" options={allSizes} filterValue={sizeFilter} setFilterValue={setSizeFilter} />
              <FilterDropdown 
                title="CATEGORY" 
                options={allCategories} 
                filterValue={categoryFilter} 
                setFilterValue={(value) => { 
                    setCategoryFilter(value); 
                    const url = value ? `/shop?category=${normalize(value)}` : '/shop';
                    window.history.pushState(null, '', url); 
                }} 
              />
              <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
            </div>
            
            {/* Columna Derecha: Contador */}
            <p className="text-xs text-gray-800 font-normal whitespace-nowrap pt-2 w-1/4 text-right">
              {filteredProducts.length} PRODUCTS
            </p>
          </div>

          <div className="border-t border-gray-200 mt-4 mx-4"></div>
        </div>

        {/* Cuadrícula de Productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-gray-100 rounded-lg mx-4">
            <p className="text-xl text-gray-500 mb-4">
              No products found.
            </p>
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
                <Link to={`/producto/${product.id}`}>
                  <div className="relative aspect-square bg-gray-100 mb-2 overflow-hidden">
                    <img
                      src={modelView && product.images[1] ? product.images[1] : product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                    
                    {/* Badges */}
                    {product.stock === 0 && <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1">SOLD OUT</div>}
                    {product.collection === "NEW ARRIVALS" && <div className="absolute top-3 right-3 bg-black text-white text-xs font-bold px-2 py-1">NEW</div>}
                    
                    {/* Botón Carrito */}
                    <button className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag w-5 h-5 text-gray-900"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    </button>
                  </div>
                  
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 uppercase">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium text-black">
                    {product.price.toFixed(2)}€
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