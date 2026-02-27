"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Customer } from "@/types";

interface CustomerContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, customer: Customer) => void;
  logout: () => void;
  updateCustomer: (customer: Customer) => void;
  checkAuth: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("customer_token");
    if (!token) {
      setCustomer(null);
      return;
    }

    try {
      const { customersApi } = await import("@/lib/api");
      const customerData = await customersApi.getProfile();
      setCustomer(customerData as Customer);
      localStorage.setItem("customer", JSON.stringify(customerData));
    } catch (error) {
      console.error("Error verifying auth:", error);
      localStorage.removeItem("customer_token");
      localStorage.removeItem("customer");
      setCustomer(null);
    }
  }, []);

  useEffect(() => {
    const loadCustomer = () => {
      try {
        const savedCustomer = localStorage.getItem("customer");
        const savedToken = localStorage.getItem("customer_token");
        
        if (savedCustomer && savedToken) {
          try {
            const parsedCustomer = JSON.parse(savedCustomer);
            setCustomer(parsedCustomer);
            checkAuth().catch(() => {});
          } catch (error) {
            console.error("Error loading customer from localStorage:", error);
            localStorage.removeItem("customer");
            localStorage.removeItem("customer_token");
            setCustomer(null);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomer();
  }, [checkAuth]);

  const login = (token: string, customerData: Customer) => {
    localStorage.setItem("customer_token", token);
    localStorage.setItem("customer", JSON.stringify(customerData));
    setCustomer(customerData);
  };

  const logout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer");
    setCustomer(null);
  };

  const updateCustomer = (customerData: Customer) => {
    localStorage.setItem("customer", JSON.stringify(customerData));
    setCustomer(customerData);
  };

  return (
    <CustomerContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        isLoading,
        login,
        logout,
        updateCustomer,
        checkAuth,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
}
