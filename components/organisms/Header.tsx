"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "../atoms/Button";
import { NavLink } from "../molecules/NavLink";
import { CartIcon } from "../molecules/CartIcon";
import { useCustomer } from "@/contexts/CustomerContext";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { customer, isAuthenticated, logout } = useCustomer();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-medium" 
          : "bg-white shadow-soft"
      }`}
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4 sm:px-6" suppressHydrationWarning>
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20" suppressHydrationWarning>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-base sm:text-lg md:text-xl font-bold text-primary-700 hover:text-primary-800 transition-colors"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold text-sm sm:text-base">
              X
            </div>
            <span className="hidden sm:inline">Xicam</span>
            <span className="sm:hidden">Xicam</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-4" suppressHydrationWarning>
            <nav className="flex items-center gap-1" suppressHydrationWarning>
              <NavLink href="/">Inicio</NavLink>
              <NavLink href="/productos">Productos</NavLink>
              <NavLink href="/categorias">Categorías</NavLink>
            </nav>
            <CartIcon />
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href="/mi-cuenta" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary-600 transition-colors">
                  <User className="w-4 h-4" />
                  <span className="hidden xl:inline">{customer?.fullName}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden xl:inline">Salir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Iniciar sesión</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="lg:hidden flex items-center gap-2">
            <CartIcon />
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
          suppressHydrationWarning
        >
          <nav className="py-4 border-t border-gray-200" suppressHydrationWarning>
            <div className="flex flex-col gap-1" suppressHydrationWarning>
              <NavLink href="/" className="block py-2 px-3 rounded-lg">Inicio</NavLink>
              <NavLink href="/productos" className="block py-2 px-3 rounded-lg">Productos</NavLink>
              <NavLink href="/categorias" className="block py-2 px-3 rounded-lg">Categorías</NavLink>
              {isAuthenticated ? (
                <>
                  <Link href="/mi-cuenta" className="block py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Mi cuenta</span>
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    className="block py-2 px-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left w-full"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar sesión</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    Iniciar sesión
                  </Link>
                  <Link href="/register" className="block py-2 px-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-center">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
