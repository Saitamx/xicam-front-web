"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageTemplate } from "@/components/templates/PageTemplate";
import { useCart } from "@/contexts/CartContext";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { CheckCircle, XCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { ordersApi } from "@/lib/api";
import { Order } from "@/types";

function CheckoutConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token || token === "rejected") {
      setStatus("error");
      setError("Pago rechazado o cancelado");
      return;
    }

    const confirmPayment = async () => {
      try {
        const confirmedOrder = await ordersApi.confirmWebpay(token) as Order;
        setOrder(confirmedOrder);
        setStatus("success");
        clearCart();
      } catch (err: any) {
        console.error("Error al confirmar pago:", err);
        setStatus("error");
        setError(err.message || "Error al confirmar el pago");
      }
    };

    confirmPayment();
  }, [searchParams, clearCart]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (status === "loading") {
    return (
      <PageTemplate>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-6"></div>
              <Heading level={1} className="mb-4">Confirmando pago...</Heading>
              <Text className="text-gray-600">
                Por favor espera mientras procesamos tu pago
              </Text>
            </div>
          </div>
        </div>
      </PageTemplate>
    );
  }

  if (status === "error") {
    return (
      <PageTemplate>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <Heading level={1} className="mb-4 text-red-600">Pago rechazado</Heading>
              <Text className="text-gray-600 mb-8">
                {error || "Hubo un problema al procesar tu pago. Por favor, intenta nuevamente."}
              </Text>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/cart">
                  <Button>Volver al carrito</Button>
                </Link>
                <Link href="/productos">
                  <Button variant="ghost">Continuar comprando</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="p-6 sm:p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <Heading level={1} className="mb-4 text-green-600">
                ¡Pago exitoso!
              </Heading>
              
              <Text className="text-gray-600 mb-6">
                Tu orden ha sido procesada correctamente. Te hemos enviado un correo de confirmación a{" "}
                <span className="font-semibold">{order?.customerEmail}</span>
              </Text>

              {order && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Text className="text-gray-600">Número de orden:</Text>
                      <Text className="font-semibold">{order.orderNumber}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text className="text-gray-600">Total pagado:</Text>
                      <Text className="font-semibold text-primary-600">
                        {formatPrice(order.total)}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text className="text-gray-600">Estado:</Text>
                      <Text className="font-semibold text-green-600">Pagado</Text>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-primary-50 rounded-lg p-4 mb-6">
                <Text className="text-sm text-gray-700">
                  📦 Tu pedido será preparado y enviado a la dirección proporcionada. 
                  Te notificaremos cuando sea enviado.
                </Text>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/productos">
                  <Button>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Continuar comprando
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost">Volver al inicio</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}

export default function CheckoutConfirmPage() {
  return (
    <Suspense fallback={
      <PageTemplate>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-6"></div>
              <Heading level={1} className="mb-4">Cargando...</Heading>
            </div>
          </div>
        </div>
      </PageTemplate>
    }>
      <CheckoutConfirmContent />
    </Suspense>
  );
}
