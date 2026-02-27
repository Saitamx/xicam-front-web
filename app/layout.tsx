import type { Metadata } from "next";
import "./globals.css";
import { HydrationFix } from "@/components/HydrationFix";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { CustomerProvider } from "@/contexts/CustomerContext";

export const metadata: Metadata = {
  title: "Xicam - Uniformes Escolares Pacific School",
  description: "Tienda online de uniformes escolares para Pacific School. Bordado de nombres disponible. Calidad garantizada.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <HydrationFix />
        <NotificationProvider>
          <CustomerProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </CustomerProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
