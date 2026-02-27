"use client";

import { PageTemplate } from "@/components/templates/PageTemplate";
import { useCart } from "@/contexts/CartContext";
import { useNotification } from "@/contexts/NotificationContext";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();
  const notification = useNotification();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const total = getTotal();

  if (items.length === 0) {
    return (
      <PageTemplate>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <Heading level={1} className="mb-4">Tu carrito está vacío</Heading>
              <Text className="text-gray-600 mb-8">
                Agrega productos desde nuestra tienda para comenzar
              </Text>
              <Link href="/productos">
                <Button>Ver Productos</Button>
              </Link>
            </div>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <Heading level={1} className="mb-6 sm:mb-8">Carrito de Compras</Heading>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const itemTotal = item.product.price * item.quantity + (item.isEmbroidered && item.product.canBeEmbroidered && item.product.embroideryPrice ? item.product.embroideryPrice * item.quantity : 0);
                return (
                  <Card key={`${item.product.id}-${item.isEmbroidered}-${item.embroideryName}`} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <Link href={`/productos/${item.product.slug}`}>
                            <Heading level={3} className="text-base sm:text-lg mb-1 hover:text-primary-600 transition-colors">
                              {item.product.name}
                            </Heading>
                          </Link>
                          <Text className="text-sm text-gray-600 mb-2">
                            {formatPrice(item.product.price)} c/u
                            {item.isEmbroidered && item.product.embroideryPrice && (
                              <span className="ml-2 text-accent-600">
                                + {formatPrice(item.product.embroideryPrice)} (bordado)
                              </span>
                            )}
                          </Text>
                          {item.isEmbroidered && item.embroideryName && (
                            <Text className="text-xs text-accent-700 font-semibold">
                              ✨ Bordado: {item.embroideryName}
                            </Text>
                          )}
                          {item.product.stock < 10 && (
                            <Text className="text-xs text-amber-600">
                              Solo {item.product.stock} disponibles
                            </Text>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.product.id, item.quantity - 1, true);
                                }
                              }}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1 min-w-[3rem] text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                if (item.quantity >= item.product.stock) {
                                  notification.showWarning(`⚠️ Solo hay ${item.product.stock} unidades disponibles`);
                                  return;
                                }
                                updateQuantity(item.product.id, item.quantity + 1, true);
                              }}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right min-w-[100px]">
                            <Text className="font-bold text-primary-600">
                              {formatPrice(itemTotal)}
                            </Text>
                          </div>

                          <button
                            onClick={() => {
                              removeItem(item.product.id, true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <Heading level={2} className="mb-4">Resumen</Heading>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <Text className="text-gray-600">Subtotal</Text>
                    <Text className="font-semibold">{formatPrice(total)}</Text>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <Text className="text-lg font-bold">Total</Text>
                      <Text className="text-lg font-bold text-primary-600">{formatPrice(total)}</Text>
                    </div>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button className="w-full mb-3">
                    Proceder al pago
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    clearCart(true);
                  }}
                >
                  Vaciar carrito
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
