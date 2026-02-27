"use client";

import { useEffect, useState } from "react";
import { PageTemplate } from "@/components/templates/PageTemplate";
import { Hero } from "@/components/organisms/Hero";
import { ProductCard } from "@/components/molecules/ProductCard";
import { CategoryCard } from "@/components/molecules/CategoryCard";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { productsApi, categoriesApi } from "@/lib/api";
import { Product, Category } from "@/types";
import { 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  GraduationCap,
  Shirt,
  Award,
  Truck
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import Link from "next/link";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productsApi.getFeatured(),
          categoriesApi.getAll(),
        ]);
        setFeaturedProducts(productsData as Product[]);
        setCategories(categoriesData as Category[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PageTemplate>
      <Hero />
      
      {/* Beneficios destacados */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <Card className="group p-4 sm:p-6 text-center border-2 border-transparent hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <Heading level={3} className="text-sm sm:text-base font-semibold mb-1">Pacific School</Heading>
              <Text className="text-xs sm:text-sm text-gray-600">Uniformes oficiales</Text>
            </Card>
            
            <Card className="group p-4 sm:p-6 text-center border-2 border-transparent hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Shirt className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <Heading level={3} className="text-sm sm:text-base font-semibold mb-1">Bordado</Heading>
              <Text className="text-xs sm:text-sm text-gray-600">Personalización</Text>
            </Card>
            
            <Card className="group p-4 sm:p-6 text-center border-2 border-transparent hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <Heading level={3} className="text-sm sm:text-base font-semibold mb-1">Envío Rápido</Heading>
              <Text className="text-xs sm:text-sm text-gray-600">A todo Chile</Text>
            </Card>
            
            <Card className="group p-4 sm:p-6 text-center border-2 border-transparent hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <Heading level={3} className="text-sm sm:text-base font-semibold mb-1">Calidad</Heading>
              <Text className="text-xs sm:text-sm text-gray-600">Garantizada</Text>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Categorías */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 mb-3 sm:mb-4 shadow-lg">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <Heading level={2} className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 font-bold">Nuestras Categorías</Heading>
            <Text className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600">
              Explora nuestra amplia gama de uniformes escolares para Pacific School
            </Text>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {categories.slice(0, 10).map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
          
          {categories.length > 10 && (
            <div className="text-center mt-6 sm:mt-8">
              <Link href="/categorias">
                <Button variant="outline" size="lg" className="group">
                  Ver Todas las Categorías
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-10 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                  <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <Heading level={2} className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 font-bold">
                    Productos Destacados
                  </Heading>
                  <Text className="text-sm sm:text-base text-gray-600">
                    Los uniformes más populares de nuestra tienda
                  </Text>
                </div>
              </div>
            </div>
            <Link href="/productos" className="hidden sm:block">
              <Button variant="ghost" size="lg" className="group items-center gap-2">
                Ver todos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl aspect-square mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {featuredProducts.slice(0, 8).map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <div className="text-center mt-6 sm:mt-8">
                <Link href="/productos">
                  <Button variant="outline" size="lg" className="group">
                    Ver Todos los Productos
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <Text className="text-gray-600">No hay productos destacados disponibles</Text>
            </div>
          )}
        </div>
      </section>
    </PageTemplate>
  );
}
