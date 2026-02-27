"use client";

import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { Text } from "../atoms/Text";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold">
                X
              </div>
              <span className="text-lg font-bold">Xicam</span>
            </div>
            <Text className="text-gray-400 text-sm">
              Uniformes escolares para Pacific School. Calidad, estilo y personalización con bordado de nombres.
            </Text>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/productos" className="text-gray-400 hover:text-white transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-gray-400 hover:text-white transition-colors">
                  Categorías
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Información</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Chile</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contacto@xicam.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+56 9 1234 5678</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Características</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>👔 Uniformes Escolares</li>
              <li>✨ Bordado de Nombres</li>
              <li>📦 Envío a Todo Chile</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Xicam - Uniformes Escolares. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
