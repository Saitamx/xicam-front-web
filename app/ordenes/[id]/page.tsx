"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageTemplate } from "@/components/templates/PageTemplate";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { ArrowLeft, Package, User, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { ordersApi } from "@/lib/api";
import { Order } from "@/types";
import { useNotification } from "@/contexts/NotificationContext";
import { useCustomer } from "@/contexts/CustomerContext";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "Pendiente",
  processing: "Procesando",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { isAuthenticated } = useCustomer();
  const notification = useNotification();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?return=/ordenes/" + id);
      return;
    }
    fetchOrder();
  }, [id, isAuthenticated, router]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getById(id);
      setOrder(data as Order);
    } catch (error) {
      console.error("Error fetching order:", error);
      notification.showError("Error al cargar la orden");
      router.push("/mi-cuenta");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <PageTemplate>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </PageTemplate>
    );
  }

  if (!order) {
    return (
      <PageTemplate>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
          <div className="container mx-auto px-4 text-center">
            <Heading level={2} className="mb-4">Orden no encontrada</Heading>
            <Link href="/mi-cuenta">
              <Button>Volver a Mi Cuenta</Button>
            </Link>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/mi-cuenta">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Mi Cuenta
              </Button>
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <Heading level={1} className="mb-2">{order.orderNumber}</Heading>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[order.status as keyof typeof statusColors]
                    }`}
                  >
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </span>
                  {order.paymentStatus === "approved" && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Pagado
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="p-6">
                <Heading level={2} className="mb-4 text-lg">Información de entrega</Heading>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <Text className="text-sm text-gray-600">Nombre</Text>
                      <Text className="font-semibold">{order.customerName}</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <Text className="text-sm text-gray-600">Email</Text>
                      <Text className="font-semibold">{order.customerEmail}</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <Text className="text-sm text-gray-600">Teléfono</Text>
                      <Text className="font-semibold">{order.customerPhone}</Text>
                    </div>
                  </div>
                  {order.shippingAddress && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <Text className="text-sm text-gray-600">Dirección</Text>
                        <Text className="font-semibold">{order.shippingAddress}</Text>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <Heading level={2} className="mb-4 text-lg">Resumen de pago</Heading>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Text className="text-gray-600">Subtotal</Text>
                    <Text className="font-semibold">{formatPrice(order.subtotal)}</Text>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between">
                      <Text className="text-gray-600">Descuento</Text>
                      <Text className="font-semibold text-red-600">-{formatPrice(order.discount)}</Text>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <Text className="font-bold text-lg">Total</Text>
                      <Text className="font-bold text-lg text-primary-600">{formatPrice(order.total)}</Text>
                    </div>
                  </div>
                  <div className="pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <Text className="text-gray-600">Método de pago</Text>
                      <Text className="font-semibold">{order.paymentMethod}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text className="text-gray-600">Fecha</Text>
                      <Text className="font-semibold">{formatDate(order.createdAt)}</Text>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <Heading level={2} className="mb-4 text-lg">Productos</Heading>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Producto</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Cantidad</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Precio unitario</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div>
                            <Text className="font-semibold">{item.productName}</Text>
                            {item.isEmbroidered && item.embroideryName && (
                              <Text className="text-xs text-accent-600">✨ Bordado: {item.embroideryName}</Text>
                            )}
                            {item.embroideryPrice && item.embroideryPrice > 0 && (
                              <Text className="text-xs text-gray-500">+ {formatPrice(item.embroideryPrice)} (bordado)</Text>
                            )}
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <Text>{item.quantity}</Text>
                        </td>
                        <td className="text-right py-3 px-4">
                          <Text>{formatPrice(item.unitPrice)}</Text>
                        </td>
                        <td className="text-right py-3 px-4">
                          <Text className="font-semibold">{formatPrice(item.subtotal)}</Text>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
