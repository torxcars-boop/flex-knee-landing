"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  size?: string;
};

export type CartItem = CartProduct & {
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (
    product: CartProduct,
    quantity?: number
  ) => void;
  removeFromCart: (
    id: string,
    size?: string
  ) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    size?: string
  ) => void;
  clearCart: () => void;
};

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

const CART_KEY = "flex-cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = localStorage.getItem(CART_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is CartItem =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.quantity === "number"
    );
  } catch (error) {
    console.error(
      "Failed to read cart:",
      error
    );

    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(items)
    );

    window.dispatchEvent(
      new Event("cart-updated")
    );
  } catch (error) {
    console.error(
      "Failed to save cart:",
      error
    );
  }
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>(
    () => readCart()
  );

  const addToCart = (
    product: CartProduct,
    quantity = 1
  ) => {
    if (quantity <= 0) {
      return;
    }

    setItems((current) => {
      const existingIndex = current.findIndex(
        (item) =>
          item.id === product.id &&
          item.size === product.size
      );

      let updated: CartItem[];

      if (existingIndex !== -1) {
        updated = current.map(
          (item, index) =>
            index === existingIndex
              ? {
                  ...item,
                  quantity:
                    item.quantity + quantity,
                }
              : item
        );
      } else {
        updated = [
          ...current,
          {
            ...product,
            quantity,
          },
        ];
      }

      writeCart(updated);

      return updated;
    });
  };

  const removeFromCart = (
    id: string,
    size?: string
  ) => {
    setItems((current) => {
      const updated = current.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size
          )
      );

      writeCart(updated);

      return updated;
    });
  };

  const updateQuantity = (
    id: string,
    quantity: number,
    size?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    setItems((current) => {
      const updated = current.map((item) =>
        item.id === id &&
        item.size === size
          ? {
              ...item,
              quantity,
            }
          : item
      );

      writeCart(updated);

      return updated;
    });
  };

  const clearCart = () => {
    setItems(() => {
      const updated: CartItem[] = [];

      writeCart(updated);

      return updated;
    });
  };

  const totalItems = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          item.price * item.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
