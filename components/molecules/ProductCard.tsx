"use client";

import Link from "next/link";
import { Card } from "../atoms/Card";
import { Product } from "@/types";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/productos/${product.slug}`}>
      <Card className="group overflow-hidden h-full flex flex-col border-2 border-transparent hover:border-primary-200 hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-xl">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
          )}
          {product.isFeatured && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
              ⭐ Destacado
            </div>
          )}
          {product.canBeEmbroidered && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
              ✨ Bordado
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 flex-grow">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <span className="text-base sm:text-lg font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            {product.stock > 0 ? (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {product.stock} disponibles
              </span>
            ) : (
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full font-medium">
                Sin stock
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
