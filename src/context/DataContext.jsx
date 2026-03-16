import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import postsData from "../data/posts.json";
import notificationsData from "../data/notifications.json";

const DataContext = createContext(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState(() =>
    (postsData || []).map((p) => ({
      ...p,
      likedByUser: p.likedByUser || false,
      saved: p.saved || false,
      comments: (p.comments || []).map((c, i) => ({
        ...c,
        id: c.id || Date.now() + i,
        time: c.time || "Hace 1h",
      })),
      tags: p.tags || [],
      category: p.category || "decor",
    }))
  );

  const [notifications, setNotifications] = useState(() =>
    (notificationsData || []).map((n) => ({
      ...n,
      read: n.read || false,
    }))
  );

  const [followedUsers, setFollowedUsers] = useState(new Set());

  // ═══════════════════════════════════════════
  // POSTS — CRUD
  // ═══════════════════════════════════════════

  const addPost = useCallback((post) => {
    const newPost = {
      id: Date.now(),
      likes: 0,
      likedByUser: false,
      saved: false,
      comments: [],
      tags: [],
      category: "decor",
      createdAt: new Date().toISOString(),
      ...post,
    };
    setPosts((prev) => [newPost, ...prev]);

    // Auto-notification
    addNotification({
      type: "like",
      user: "ReLife",
      action: "Tu post fue publicado exitosamente",
      target: newPost.title,
      avatar: null,
    });
  }, []);

  const deletePost = useCallback((postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const updatePost = useCallback((postId, updates) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updates } : p))
    );
  }, []);

  const getPostById = useCallback(
    (postId) => posts.find((p) => p.id === postId) || null,
    [posts]
  );

  // ═══════════════════════════════════════════
  // LIKES
  // ═══════════════════════════════════════════

  const toggleLike = useCallback((postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const liked = !p.likedByUser;
        return {
          ...p,
          likedByUser: liked,
          likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      })
    );
  }, []);

  // ═══════════════════════════════════════════
  // SAVE / BOOKMARK
  // ═══════════════════════════════════════════

  const toggleSave = useCallback((postId) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, saved: !p.saved } : p))
    );
  }, []);

  // ═══════════════════════════════════════════
  // COMMENTS
  // ═══════════════════════════════════════════

  const addComment = useCallback((postId, comment) => {
    const newComment = {
      id: Date.now(),
      time: "Ahora",
      ...comment,
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...(p.comments || []), newComment] }
          : p
      )
    );
  }, []);

  const deleteComment = useCallback((postId, commentId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: (p.comments || []).filter((c) => c.id !== commentId) }
          : p
      )
    );
  }, []);

  // ═══════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════

  const addNotification = useCallback((notification) => {
    const n = {
      id: Date.now(),
      read: false,
      time: "Hace 1 min",
      ...notification,
    };
    setNotifications((prev) => [n, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // ═══════════════════════════════════════════
  // FOLLOW SYSTEM
  // ═══════════════════════════════════════════

  const toggleFollow = useCallback((username) => {
    setFollowedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(username)) next.delete(username);
      else next.add(username);
      return next;
    });
  }, []);

  const isFollowing = useCallback(
    (username) => followedUsers.has(username),
    [followedUsers]
  );

  // ═══════════════════════════════════════════
  // MARKETPLACE
  // ═══════════════════════════════════════════

  const [marketplaceItems, setMarketplaceItems] = useState([
    {
      id: 1,
      title: "Lámpara de botellas recicladas",
      description: "Hecha a mano con 3 botellas de vidrio. Incluye bombilla LED cálida.",
      price: 45,
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&fit=crop",
      seller: "EcoMaria",
      sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      category: "lighting",
      condition: "Nuevo",
      likes: 24,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-01",
    },
    {
      id: 2,
      title: "Mesa de centro con palets",
      description: "Palet europeo restaurado, lijado y barnizado. 120x80cm con ruedas.",
      price: 120,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&fit=crop",
      seller: "CraftLuis",
      sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luis",
      category: "furniture",
      condition: "Restaurado",
      likes: 56,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-11-28",
    },
    {
      id: 3,
      title: "Maceteros de neumáticos",
      description: "Set de 3 maceteros pintados a mano con pintura ecológica.",
      price: 25,
      image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&fit=crop",
      seller: "GreenAna",
      sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      category: "garden",
      condition: "Nuevo",
      likes: 31,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-03",
    },
    {
      id: 4,
      title: "Bolso tote de tela reciclada",
      description: "Confeccionado con retales de camisetas. Forro interior con bolsillo.",
      price: 18,
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&fit=crop",
      seller: "ReUsaJuan",
      sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
      category: "fashion",
      condition: "Nuevo",
      likes: 42,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-05",
    },
    {
      id: 5,
      title: "Estantería flotante de madera",
      description: "Madera de demolición recuperada. 60cm con soportes ocultos.",
      price: 35,
      image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&fit=crop",
      seller: "EcoMaria",
      sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      category: "decor",
      condition: "Restaurado",
      likes: 19,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-04",
    },
    {
      id: 6,
      title: "Portavelas de latas vintage",
      description: "Latas de conserva decoradas con encaje y pintura chalk. Set de 4.",
      price: 15,
      image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&fit=crop",
      seller: "VintageRosa",
      sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosa",
      category: "decor",
      condition: "Nuevo",
      likes: 38,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-02",
    },
    {
      id: 7,
      title: "Silla de madera restaurada",
      description: "Silla de los años 60 restaurada con tapizado nuevo en tela orgánica color mostaza. Estructura lijada y barnizada.",
      price: 85,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&fit=crop",
      seller: "CarpinteroZen",
      sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      category: "furniture",
      condition: "Restaurado",
      likes: 47,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-06",
    },
    {
      id: 8,
      title: "Jarrón de vidrio soplado",
      description: "Pieza artesanal soplada a mano con vidrio reciclado. Tono azul verdoso único, 25cm de alto.",
      price: 60,
      image: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=600&fit=crop",
      seller: "VidrioArt",
      sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
      category: "decor",
      condition: "Nuevo",
      likes: 63,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-07",
    },
    {
      id: 9,
      title: "Mochila de lona reciclada",
      description: "Mochila urbana hecha con lona de camión reciclada. Resistente al agua, forro interior de algodón, cierre YKK.",
      price: 42,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&fit=crop",
      seller: "TrapoChic",
      sellerAvatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Mia",
      category: "fashion",
      condition: "Nuevo",
      likes: 35,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-08",
    },
    {
      id: 10,
      title: "Compostera doméstica DIY",
      description: "Kit de compostera hecha con palets y malla galvanizada. 60x60x80cm, incluye instrucciones de montaje.",
      price: 55,
      image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&fit=crop",
      seller: "JardinUrbano",
      sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      category: "garden",
      condition: "Nuevo",
      likes: 28,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-09",
    },
    {
      id: 11,
      title: "Reloj de pared vinilo",
      description: "Reloj minimalista hecho con disco de vinilo LP reciclado. Mecanismo silencioso incluido.",
      price: 30,
      image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600&fit=crop",
      seller: "DecoRetro",
      sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucia",
      category: "decor",
      condition: "Nuevo",
      likes: 52,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-10",
    },
    {
      id: 12,
      title: "Lámpara cuerda de yute",
      description: "Pantalla tejida a mano con cuerda de yute reciclada. Luz cálida perfecta para salón o dormitorio.",
      price: 38,
      image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&fit=crop",
      seller: "LuzReciclada",
      sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      category: "lighting",
      condition: "Nuevo",
      likes: 41,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-11",
    },
    {
      id: 13,
      title: "Sofá exterior de palets",
      description: "Sofá de 2 plazas con palets europeos reciclados. Incluye 4 cojines impermeables en gris antracita.",
      price: 195,
      image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&fit=crop",
      seller: "NeoRústico",
      sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
      category: "furniture",
      condition: "Nuevo",
      likes: 78,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-12",
    },
    {
      id: 14,
      title: "Alfombra de trapillo circular",
      description: "Alfombra tejida a crochet con trapillo de camisetas recicladas. 90cm diámetro, tonos tierra.",
      price: 48,
      image: "https://images.unsplash.com/photo-1615529162924-f8605388461d?w=600&fit=crop",
      seller: "HiloVerde",
      sellerAvatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Carmen",
      category: "decor",
      condition: "Nuevo",
      likes: 33,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-13",
    },
    {
      id: 15,
      title: "Terrario en bombilla",
      description: "Mini ecosistema cerrado dentro de una bombilla incandescente reciclada. Incluye musgo y suculenta.",
      price: 22,
      image: "https://images.unsplash.com/photo-1491147334573-44cbb4602074?w=600&fit=crop",
      seller: "VerdeVivo",
      sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diego",
      category: "garden",
      condition: "Nuevo",
      likes: 67,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-14",
    },
    {
      id: 16,
      title: "Perchero ramas naturales",
      description: "Perchero de pared con ramas de poda secas sobre tablón de roble recuperado. 80cm ancho, 5 ganchos.",
      price: 40,
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600&fit=crop",
      seller: "NeoRústico",
      sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
      category: "decor",
      condition: "Nuevo",
      likes: 29,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-15",
    },
    {
      id: 17,
      title: "Camisetas tie-dye naturales",
      description: "Pack de 2 camisetas algodón orgánico teñidas con cúrcuma y remolacha. Tallas S-XL disponibles.",
      price: 28,
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&fit=crop",
      seller: "TrapoChic",
      sellerAvatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Mia",
      category: "fashion",
      condition: "Nuevo",
      likes: 44,
      likedByUser: false,
      saved: false,
      sold: false,
      createdAt: "2024-12-16",
    },
    {
      id: 18,
      title: "Mesa auxiliar carrete industrial",
      description: "Carrete de cable eléctrico reciclado convertido en mesa auxiliar. Lijado, teñido nogal y con ruedas con freno.",
      price: 90,
      image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&fit=crop",
      seller: "CarpinteroZen",
      sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      category: "furniture",
      condition: "Restaurado",
      likes: 51,
      likedByUser: false,
      saved: false,
      sold: true,
      createdAt: "2024-11-20",
    },
  ]);

  const addMarketplaceItem = useCallback((item) => {
    setMarketplaceItems((prev) => [
      { id: Date.now(), likes: 0, likedByUser: false, saved: false, sold: false, createdAt: new Date().toISOString(), ...item },
      ...prev,
    ]);
  }, []);

  const toggleMarketplaceLike = useCallback((itemId) => {
    setMarketplaceItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const liked = !item.likedByUser;
        return { ...item, likedByUser: liked, likes: liked ? item.likes + 1 : Math.max(0, item.likes - 1) };
      })
    );
  }, []);

  const toggleMarketplaceSave = useCallback((itemId) => {
    setMarketplaceItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, saved: !item.saved } : item))
    );
  }, []);

  const markAsSold = useCallback((itemId) => {
    setMarketplaceItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, sold: true } : item))
    );
  }, []);

  // ═══════════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════════

  const value = useMemo(
    () => ({
      // Posts
      posts,
      setPosts,
      addPost,
      deletePost,
      updatePost,
      getPostById,
      toggleLike,
      toggleSave,
      addComment,
      deleteComment,

      // Notifications
      notifications,
      setNotifications,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,

      // Follow
      followedUsers,
      toggleFollow,
      isFollowing,

      // Marketplace
      marketplaceItems,
      addMarketplaceItem,
      toggleMarketplaceLike,
      toggleMarketplaceSave,
      markAsSold,
    }),
    [
      posts, notifications, followedUsers, marketplaceItems,
      addPost, deletePost, updatePost, getPostById, toggleLike, toggleSave,
      addComment, deleteComment, addNotification, markNotificationRead,
      markAllNotificationsRead, deleteNotification, toggleFollow, isFollowing,
      addMarketplaceItem, toggleMarketplaceLike, toggleMarketplaceSave, markAsSold,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;