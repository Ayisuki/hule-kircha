import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("hk_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const saveCart = useCallback((newCart) => {
    setCart(newCart);
    localStorage.setItem("hk_cart", JSON.stringify(newCart));
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      let newCart;
      if (existing) {
        newCart = prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.maxOrderQty || 100) }
            : item
        );
      } else {
        newCart = [
          ...prev,
          {
            productId: product._id,
            name: product.name,
            category: product.category,
            price: product.price,
            deliveryFee: product.deliveryFee,
            quantity,
            maxOrderQty: product.maxOrderQty || 100,
            image: product.image
          }
        ];
      }
      localStorage.setItem("hk_cart", JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.productId !== productId);
      localStorage.setItem("hk_cart", JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const newCart = prev.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.min(quantity, item.maxOrderQty) } : item
      );
      localStorage.setItem("hk_cart", JSON.stringify(newCart));
      return newCart;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("hk_cart");
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryTotal = cart.reduce((sum, item) => sum + item.deliveryFee, 0);
  const finalTotal = cartTotal + deliveryTotal;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        deliveryTotal,
        finalTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
