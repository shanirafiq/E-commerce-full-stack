import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const CART_KEY = "folio_cart";

const AppProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1, options = {}) => {
    const { color = "Default", size = "Standard" } = options;

    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.productId === product._id &&
          item.color === color &&
          item.size === size
      );

      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, qty: item.qty + qty } : item
        );
      }

      return [
        ...prev,
        {
          productId: product._id,
          name: product.productName,
          price: product.productPrice,
          image: product.productImg,
          color,
          size,
          qty,
        },
      ];
    });
  };

  const removeFromCart = (productId, color, size) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.color === color && item.size === size)
      )
    );
  };

  const updateQty = (productId, color, size, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.color === color && item.size === size
          ? { ...item, qty: Math.max(1, qty) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * (item.price || 0), 0);

  return (
    <AppContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;