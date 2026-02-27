"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageTemplate } from "@/components/templates/PageTemplate";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { productsApi } from "@/lib/api";
import { Product } from "@/types";
import { ArrowLeft, ShoppingBag, Package, Tag, Plus, Minus, Shirt } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useNotification } from "@/contexts/NotificationContext";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addItem } = useCart();
  const notification = useNotification();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isEmbroidered, setIsEmbroidered] = useState(false);
  const [embroideryName, setEmbroideryName] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await productsApi.getBySlug(slug);
        setProduct(productData as Product);
        
        if ((productData as Product).categoryId) {
          const related = await productsApi.getByCategory((productData as Product).categoryId);
          const filtered = (related as Product[]).filter(p => p.slug !== slug).slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/productos');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <PageTemplate>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <Text>Cargando producto...</Text>
          </div>
        </div>
      </PageTemplate>
    );
  }

  if (!product) {
    return (
      <PageTemplate>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Heading level={2}>Producto no encontrado</Heading>
            <Link href="/productos">
              <Button className="mt-4">Volver a Productos</Button>
            </Link>
          </div>
        </div>
      </PageTemplate>
    );
  }

  const totalPrice = product.price * quantity + (isEmbroidered && product.canBeEmbroidered && product.embroideryPrice ? product.embroideryPrice * quantity : 0);

  return (
    <PageTemplate>
      <div className="bg-gradient-to-b from-gray-50 to-white py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <Link href="/productos">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Productos
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12">
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-gray-400" />
                </div>
              )}
              {product.isFeatured && (
                <div className="absolute top-4 right-4 bg-primary-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                  Destacado
                </div>
              )}
              {product.canBeEmbroidered && (
                <div className="absolute top-4 left-4 bg-accent-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                  ✨ Bordado disponible
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                {product.category && (
                  <Link href={`/categorias/${product.category.slug}`}>
                    <span className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-3">
                      <Tag className="w-4 h-4" />
                      {product.category.name}
                    </span>
                  </Link>
                )}
                <Heading level={1} className="mb-4">{product.name}</Heading>
                <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-6">
                  {formatPrice(product.price)}
                  {isEmbroidered && product.canBeEmbroidered && product.embroideryPrice && (
                    <span className="text-lg text-gray-600 ml-2">
                      + {formatPrice(product.embroideryPrice)} (bordado)
                    </span>
                  )}
                </div>
              </div>

              {product.description && (
                <div>
                  <Heading level={3} className="text-lg mb-3">Descripción</Heading>
                  <Text className="text-gray-700 leading-relaxed">{product.description}</Text>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {product.size && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Shirt className="w-4 h-4" />
                      <span className="text-xs font-medium">Talla</span>
                    </div>
                    <Text className="text-sm font-semibold">{product.size}</Text>
                  </div>
                )}
                {product.color && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Tag className="w-4 h-4" />
                      <span className="text-xs font-medium">Color</span>
                    </div>
                    <Text className="text-sm font-semibold">{product.color}</Text>
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Package className="w-4 h-4" />
                    <span className="text-xs font-medium">Stock</span>
                  </div>
                  <Text className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                  </Text>
                </div>
              </div>

              {product.canBeEmbroidered && (
                <div className="bg-accent-50 border-2 border-accent-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="embroider"
                      checked={isEmbroidered}
                      onChange={(e) => setIsEmbroidered(e.target.checked)}
                      className="w-5 h-5 text-accent-600 rounded focus:ring-accent-500"
                    />
                    <label htmlFor="embroider" className="text-sm font-semibold text-accent-900">
                      Agregar bordado de nombre (+ {formatPrice(product.embroideryPrice || 0)})
                    </label>
                  </div>
                  {isEmbroidered && (
                    <input
                      type="text"
                      placeholder="Nombre para bordar"
                      value={embroideryName}
                      onChange={(e) => setEmbroideryName(e.target.value)}
                      className="w-full px-4 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent mt-2"
                    />
                  )}
                </div>
              )}

              <div className="pt-4 space-y-4">
                {product.stock > 0 ? (
                  <>
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                      <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 min-w-[3rem] text-center font-semibold">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={quantity >= product.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-4">
                      <div className="flex justify-between items-center">
                        <Text className="font-semibold">Total:</Text>
                        <Text className="text-xl font-bold text-primary-600">
                          {formatPrice(totalPrice)}
                        </Text>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => {
                        if (quantity > product.stock) {
                          notification.showWarning(`Solo hay ${product.stock} unidades disponibles`);
                          return;
                        }
                        if (isEmbroidered && !embroideryName.trim()) {
                          notification.showWarning("Por favor, ingresa el nombre para bordar");
                          return;
                        }
                        setAddingToCart(true);
                        addItem(product, quantity, true, isEmbroidered, embroideryName || undefined);
                        setTimeout(() => {
                          setAddingToCart(false);
                        }, 500);
                      }}
                      disabled={addingToCart}
                    >
                      {addingToCart ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Agregando...
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5 mr-2" />
                          Agregar al carrito
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <Text className="text-sm text-red-700 text-center">
                      Producto sin stock disponible
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <Heading level={2} className="mb-6">Productos Relacionados</Heading>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTemplate>
  );
}
