"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageTemplate } from "@/components/templates/PageTemplate";
import { useCart } from "@/contexts/CartContext";
import { useNotification } from "@/contexts/NotificationContext";
import { useCustomer } from "@/contexts/CustomerContext";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { ArrowLeft, Lock, CreditCard, Truck } from "lucide-react";
import Link from "next/link";
import { ordersApi } from "@/lib/api";
import { Order, WebpayResponse, ShippingOption } from "@/types";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const notification = useNotification();
  const { isAuthenticated, customer } = useCustomer();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shippingTypes, setShippingTypes] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    notes: "",
  });
  const [dataLoaded, setDataLoaded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    ordersApi.getShippingTypes()
      .then((types) => {
        setShippingTypes(types);
        if (types.length > 0) {
          setSelectedShipping(types[0]);
        }
      })
      .catch((error) => {
        console.error("Error al cargar tipos de envío:", error);
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated && customer && !dataLoaded) {
      let fullAddress = customer.address || "";
      if (customer.city || customer.region) {
        const addressParts = [customer.address, customer.city, customer.region].filter(Boolean);
        if (addressParts.length > 0) {
          fullAddress = addressParts.join(", ");
        }
      }
      
      setFormData({
        customerName: customer.fullName || "",
        customerEmail: customer.email || "",
        customerPhone: customer.phone || "",
        shippingAddress: fullAddress,
        notes: "",
      });
      setDataLoaded(true);
    } else if (!isAuthenticated && dataLoaded) {
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        shippingAddress: "",
        notes: "",
      });
      setDataLoaded(false);
    }
  }, [isAuthenticated, customer, dataLoaded]);

  const subtotal = getTotal();
  const shippingCost = selectedShipping?.price || 0;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const order = await ordersApi.create({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        shippingType: selectedShipping?.type,
        notes: formData.notes,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          isEmbroidered: item.isEmbroidered,
          embroideryName: item.embroideryName,
        })),
        paymentMethod: "webpay",
      }) as Order;

      const webpayResponse = await ordersApi.initiateWebpay(order.id) as WebpayResponse;

      if (webpayResponse.url) {
        window.location.href = webpayResponse.url;
      } else {
        throw new Error("No se recibió URL de Webpay");
      }
    } catch (error: any) {
      console.error("Error al procesar orden:", error);
      notification.showError(error.message || "Error al procesar la orden. Por favor, intenta nuevamente.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <PageTemplate>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto text-center">
              <Heading level={1} className="mb-4">Tu carrito está vacío</Heading>
              <Text className="text-gray-600 mb-8">
                Agrega productos antes de proceder al pago
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
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al carrito
            </Button>
          </Link>

          <Heading level={1} className="mb-6 sm:mb-8">Checkout</Heading>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary-600" />
                    <Heading level={2} className="text-xl">Información de contacto</Heading>
                  </div>
                  {isAuthenticated && customer && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Usando datos de tu cuenta</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="customerEmail"
                        required
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="customerPhone"
                        required
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección de envío *
                    </label>
                    <textarea
                      id="shippingAddress"
                      required
                      value={formData.shippingAddress}
                      onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Truck className="w-4 h-4 inline mr-2" />
                      Tipo de envío *
                    </label>
                    <div className="space-y-2">
                      {shippingTypes.map((shipping) => (
                        <label
                          key={shipping.type}
                          className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedShipping?.type === shipping.type
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={shipping.type}
                            checked={selectedShipping?.type === shipping.type}
                            onChange={() => setSelectedShipping(shipping)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <Text className="font-semibold">{shipping.name}</Text>
                                <Text className="text-sm text-gray-600">{shipping.description}</Text>
                                <Text className="text-xs text-gray-500 mt-1">
                                  Tiempo estimado: {shipping.estimatedDays} día{shipping.estimatedDays !== 1 ? 's' : ''}
                                </Text>
                              </div>
                              <Text className="font-bold text-primary-600 ml-4">
                                {formatPrice(shipping.price)}
                              </Text>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Notas adicionales (opcional)
                    </label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Instrucciones especiales para la entrega..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !selectedShipping}
                  >
                    {loading ? (
                      "Procesando..."
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Proceder al pago
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <Heading level={2} className="mb-4">Resumen del pedido</Heading>
                <div className="space-y-3 mb-6">
                  <div className="space-y-2">
                    {items.map((item) => {
                      const itemTotal = item.product.price * item.quantity + (item.isEmbroidered && item.product.canBeEmbroidered && item.product.embroideryPrice ? item.product.embroideryPrice * item.quantity : 0);
                      return (
                        <div key={`${item.product.id}-${item.isEmbroidered}`} className="flex justify-between text-sm">
                          <div>
                            <Text className="font-medium">{item.product.name} x {item.quantity}</Text>
                            {item.isEmbroidered && item.embroideryName && (
                              <Text className="text-xs text-accent-600">✨ Bordado: {item.embroideryName}</Text>
                            )}
                          </div>
                          <Text className="font-semibold">{formatPrice(itemTotal)}</Text>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between mb-2">
                      <Text className="text-gray-600">Subtotal</Text>
                      <Text className="font-semibold">{formatPrice(subtotal)}</Text>
                    </div>
                    <div className="flex justify-between mb-2">
                      <Text className="text-gray-600">Envío</Text>
                      <Text className="font-semibold">{formatPrice(shippingCost)}</Text>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between">
                        <Text className="text-lg font-bold">Total</Text>
                        <Text className="text-lg font-bold text-primary-600">{formatPrice(total)}</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
