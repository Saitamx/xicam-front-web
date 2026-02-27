"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageTemplate } from "@/components/templates/PageTemplate";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { User, Mail, Phone, MapPin, Package, LogOut, Calendar, ShoppingBag, TrendingUp, Award } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { ordersApi } from "@/lib/api";
import { Order } from "@/types";
import { useNotification } from "@/contexts/NotificationContext";
import Link from "next/link";

export default function MiCuentaPage() {
  const router = useRouter();
  const { customer, isAuthenticated, isLoading: contextLoading, logout } = useCustomer();
  const notification = useNotification();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (contextLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/login?return=/mi-cuenta");
      return;
    }

    if (customer) {
      fetchOrders();
    }
  }, [isAuthenticated, contextLoading, customer, router]);

  const fetchOrders = async () => {
    if (!customer) return;

    try {
      setOrdersLoading(true);
      const customerOrders = await ordersApi.getMyOrders() as Order[];
      setOrders(customerOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      notification.showError("Error al cargar tus órdenes");
    } finally {
      setOrdersLoading(false);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    notification.showInfo("Sesión cerrada exitosamente");
    router.push("/");
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendiente",
      processing: "Procesando",
      paid: "Pagado",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  if (contextLoading || loading || !isAuthenticated || !customer) {
    return (
      <PageTemplate>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <Text className="text-gray-600">Cargando tu cuenta...</Text>
          </div>
        </div>
      </PageTemplate>
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;

  return (
    <PageTemplate>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl opacity-10"></div>
              <div className="relative bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <div>
                      <Heading level={1} className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        Mi Cuenta
                      </Heading>
                      <Text className="text-gray-600 text-sm sm:text-base">
                        Bienvenido de vuelta, {customer.fullName.split(' ')[0]}
                      </Text>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </div>

            {orders.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="text-sm text-blue-700 font-medium mb-1">Total Pedidos</Text>
                      <Text className="text-2xl font-bold text-blue-900">{totalOrders}</Text>
                    </div>
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-blue-700" />
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="text-sm text-green-700 font-medium mb-1">Total Gastado</Text>
                      <Text className="text-2xl font-bold text-green-900">{formatPrice(totalSpent)}</Text>
                    </div>
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-700" />
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="text-sm text-purple-700 font-medium mb-1">Miembro desde</Text>
                      <Text className="text-lg font-bold text-purple-900">
                        {customer.createdAt 
                          ? new Date(customer.createdAt).toLocaleDateString('es-CL', { 
                              month: 'short', 
                              year: 'numeric' 
                            })
                          : 'Reciente'
                        }
                      </Text>
                    </div>
                    <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-700" />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card className="p-6 shadow-lg border-0 bg-white">
                  <div className="text-center mb-6 pb-6 border-b border-gray-200">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full"></div>
                      <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-primary-600" />
                      </div>
                    </div>
                    <Heading level={2} className="text-xl font-bold text-gray-900 mb-1">
                      {customer.fullName}
                    </Heading>
                    <Text className="text-sm text-gray-500">{customer.email}</Text>
                  </div>

                  <div className="space-y-4">
                    <div className="group p-4 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors border border-transparent hover:border-primary-200">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                          <Mail className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Text className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                            Email
                          </Text>
                          <Text className="text-sm font-medium text-gray-900 break-words">
                            {customer.email}
                          </Text>
                        </div>
                      </div>
                    </div>

                    <div className="group p-4 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors border border-transparent hover:border-primary-200">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                          <Phone className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Text className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                            Teléfono
                          </Text>
                          <Text className="text-sm font-medium text-gray-900">
                            {customer.phone}
                          </Text>
                        </div>
                      </div>
                    </div>

                    {customer.address && (
                      <div className="group p-4 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors border border-transparent hover:border-primary-200">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                            <MapPin className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Text className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                              Dirección
                            </Text>
                            <Text className="text-sm font-medium text-gray-900">
                              {customer.address}
                            </Text>
                            {(customer.city || customer.region) && (
                              <Text className="text-xs text-gray-500 mt-1">
                                {customer.city}
                                {customer.city && customer.region && ", "}
                                {customer.region}
                              </Text>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="p-6 sm:p-8 shadow-lg border-0 bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <Heading level={2} className="text-2xl font-bold text-gray-900 mb-1">
                        Mis Pedidos
                      </Heading>
                      <Text className="text-sm text-gray-600">
                        {orders.length === 0 
                          ? "Aún no has realizado ningún pedido"
                          : `${orders.length} pedido${orders.length !== 1 ? 's' : ''} en total`
                        }
                      </Text>
                    </div>
                  </div>

                  {ordersLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                      <Text className="text-gray-600">Cargando tus pedidos...</Text>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="relative w-32 h-32 mx-auto mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full"></div>
                        <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                      </div>
                      <Heading level={3} className="text-xl font-bold text-gray-900 mb-2">
                        No tienes pedidos aún
                      </Heading>
                      <Text className="text-gray-600 mb-8 max-w-sm mx-auto">
                        Cuando realices tu primera compra, aparecerá aquí para que puedas hacer seguimiento
                      </Text>
                      <Link href="/productos">
                        <Button size="lg" className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg">
                          <ShoppingBag className="w-5 h-5 mr-2" />
                          Explorar Productos
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="group border-2 border-gray-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-lg transition-all bg-white"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                <Heading level={3} className="text-lg font-bold text-gray-900">
                                  {order.orderNumber}
                                </Heading>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {getStatusLabel(order.status)}
                                </span>
                                {order.paymentStatus === "approved" && (
                                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 flex items-center gap-1">
                                    <Award className="w-3 h-3" />
                                    Pagado
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  <Text>{formatDate(order.createdAt)}</Text>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Package className="w-4 h-4" />
                                  <Text>
                                    <span className="font-semibold text-gray-900">{order.items?.length || 0}</span>{" "}
                                    producto{order.items?.length !== 1 ? "s" : ""}
                                  </Text>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-3 sm:items-end">
                              <div className="text-right">
                                <Text className="text-xs text-gray-500 mb-1">Total</Text>
                                <Text className="text-2xl font-bold text-primary-600">
                                  {formatPrice(order.total)}
                                </Text>
                              </div>
                              <Link href={`/ordenes/${order.id}`}>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="group-hover:bg-primary-50 group-hover:text-primary-700"
                                >
                                  Ver Detalles
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
