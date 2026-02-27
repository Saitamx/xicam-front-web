"use client";

import { ReactNode } from "react";
import { Header } from "../organisms/Header";
import { Footer } from "../organisms/Footer";

interface PageTemplateProps {
  children: ReactNode;
}

export const PageTemplate = ({ children }: PageTemplateProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
