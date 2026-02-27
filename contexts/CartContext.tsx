"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { useNotification } from "./NotificationContext";

interface CartItem {
  product: Product;
  quantity: number;
  isEmbroidered?: boolean;
  embroideryName?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, showNotification?: boolean, isEmbroidered?: boolean, embroideryName?: string) => void;
  removeItem: (productId: string, showNotification?: boolean) => void;
  updateQuantity: (productId: string, quantity: number, showNotification?: boolean) => void;
  clearCart: (showNotification?: boolean) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const notification = useNotification();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity: number = 1, showNotification: boolean = true, isEmbroidered: boolean = false, embroideryName?: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id && item.isEmbroidered === isEmbroidered && item.embroideryName === embroideryName);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          if (showNotification) {
            notification.showWarning(`⚠️ Solo hay ${product.stock} unidades disponibles de "${product.name}"`);
          }
          return prevItems;
        }
        
        if (showNotification) {
          notification.showSuccess(
            `✅ ¡${product.name} agregado al carrito! (${newQuantity} ${newQuantity === 1 ? 'unidad' : 'unidades'})`,
            4000
          );
        }
        
        return prevItems.map((item) =>
          item.product.id === product.id && item.isEmbroidered === isEmbroidered && item.embroideryName === embroideryName
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        if (quantity > product.stock) {
          if (showNotification) {
            notification.showWarning(`⚠️ Solo hay ${product.stock} unidades disponibles de "${product.name}"`);
          }
          return prevItems;
        }
        
        if (showNotification) {
          const message = quantity === 1 
            ? `✅ ¡${product.name} agregado al carrito! 🛒`
            : `✅ ¡${quantity} unidades de ${product.name} agregadas al carrito! 🛒`;
          notification.showSuccess(message, 4000);
        }
        
        return [...prevItems, { product, quantity, isEmbroidered, embroideryName }];
      }
    });
  };

  const removeItem = (productId: string, showNotification: boolean = true) => {
    setItems((prevItems) => {
      const item = prevItems.find((item) => item.product.id === productId);
      if (item && showNotification) {
        notification.showSuccess(`🗑️ "${item.product.name}" eliminado del carrito`, 2500);
      }
      return prevItems.filter((item) => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number, showNotification: boolean = false) => {
    if (quantity <= 0) {
      removeItem(productId, showNotification);
      return;
    }

    setItems((prevItems) => {
      const item = prevItems.find((item) => item.product.id === productId);
      if (item && quantity > item.product.stock) {
        if (showNotification) {
          notification.showWarning(`⚠️ Solo hay ${item.product.stock} unidades disponibles de "${item.product.name}"`);
        }
        return prevItems;
      }

      if (item && showNotification && quantity !== item.quantity) {
        notification.showSuccess(`📦 Cantidad actualizada: ${quantity} ${quantity === 1 ? 'unidad' : 'unidades'}`, 2000);
      }

      return prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = (showNotification: boolean = true) => {
    setItems([]);
    localStorage.removeItem("cart");
    if (showNotification) {
      notification.showSuccess("🗑️ Carrito vaciado", 2500);
    }
  };

  const getTotal = () => {
    return items.reduce((total, item) => {
      let itemTotal = item.product.price * item.quantity;
      if (item.isEmbroidered && item.product.canBeEmbroidered && item.product.embroideryPrice) {
        itemTotal += (item.product.embroideryPrice * item.quantity);
      }
      return total + itemTotal;
    }, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
