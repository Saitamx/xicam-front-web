"use client";

import { useEffect, useState } from "react";
import { PageTemplate } from "@/components/templates/PageTemplate";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { productsApi } from "@/lib/api";
import { Product } from "@/types";
import { ShoppingBag } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getAll();
        setProducts(data as Product[]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <PageTemplate>
      <div className="bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 mb-4 shadow-lg">
              <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <Heading level={1} className="mb-3 sm:mb-4">Nuestros Productos</Heading>
            <Text className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600">
              Descubre nuestra amplia selección de uniformes escolares para Pacific School
            </Text>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl aspect-square mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <Text className="text-gray-500">No hay productos disponibles en este momento.</Text>
            </div>
          )}
        </div>
      </div>
    </PageTemplate>
  );
}
