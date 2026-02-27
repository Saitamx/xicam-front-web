"use client";

import { useEffect, useState } from "react";
import { PageTemplate } from "@/components/templates/PageTemplate";
import { CategoryCard } from "@/components/molecules/CategoryCard";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { categoriesApi } from "@/lib/api";
import { Category } from "@/types";
import { Sparkles } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategories(data as Category[]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <PageTemplate>
      <div className="bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 mb-4 shadow-lg">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <Heading level={1} className="mb-3 sm:mb-4">Categorías</Heading>
            <Text className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600">
              Explora nuestros uniformes escolares por categoría
            </Text>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl aspect-square mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          )}

          {!loading && categories.length === 0 && (
            <div className="text-center py-12">
              <Text className="text-gray-500">No hay categorías disponibles en este momento.</Text>
            </div>
          )}
        </div>
      </div>
    </PageTemplate>
  );
}
