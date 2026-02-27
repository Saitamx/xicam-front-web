"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageTemplate } from "@/components/templates/PageTemplate";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { categoriesApi, productsApi } from "@/lib/api";
import { Category, Product } from "@/types";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import Image from "next/image";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryData = await categoriesApi.getBySlug(slug);
        setCategory(categoryData as Category);
        
        const productsData = await productsApi.getByCategory((categoryData as Category).id);
        setProducts(productsData as Product[]);
      } catch (error) {
        console.error('Error fetching category:', error);
        router.push('/categorias');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategory();
    }
  }, [slug, router]);

  if (loading) {
    return (
      <PageTemplate>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <Text>Cargando categoría...</Text>
          </div>
        </div>
      </PageTemplate>
    );
  }

  if (!category) {
    return (
      <PageTemplate>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Heading level={2}>Categoría no encontrada</Heading>
            <Link href="/categorias">
              <Button className="mt-4">Volver a Categorías</Button>
            </Link>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <div className="bg-gradient-to-b from-gray-50 to-white py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <Link href="/categorias">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Categorías
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              {category.image ? (
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-soft">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-soft">
                  <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
              )}
            </div>
            <Heading level={1} className="mb-3 sm:mb-4">{category.name}</Heading>
            {category.description && (
              <Text className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600">
                {category.description}
              </Text>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl aspect-square mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Text className="text-gray-500">No hay productos disponibles en esta categoría.</Text>
            </div>
          )}
        </div>
      </div>
    </PageTemplate>
  );
}
