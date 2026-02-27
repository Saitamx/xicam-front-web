"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageTemplate } from "@/components/templates/PageTemplate";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { CreditCard, CheckCircle } from "lucide-react";
import { ordersApi } from "@/lib/api";
import { useNotification } from "@/contexts/NotificationContext";

function WebpaySimulateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const notification = useNotification();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      await ordersApi.confirmWebpay(token);
      router.push(`/checkout/confirm?token=${token}`);
    } catch (error: any) {
      console.error("Error al aprobar pago:", error);
      notification.showError("Error al procesar el pago. Por favor, intenta nuevamente.");
      setLoading(false);
    }
  };

  const handleReject = () => {
    router.push("/checkout/confirm?token=rejected");
  };

  return (
    <PageTemplate>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-md mx-auto">
            <Card className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-primary-600" />
                </div>
                <Heading level={1} className="mb-2">Simulación de Webpay</Heading>
                <Text className="text-gray-600 text-sm">
                  Esta es una simulación del proceso de pago. En producción, serías redirigido a Webpay Transbank.
                </Text>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <Text className="text-sm text-yellow-800">
                  ⚠️ <strong>Modo de prueba:</strong> Este es un entorno simulado. 
                  En producción, el pago se procesaría a través de Webpay Transbank.
                </Text>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={handleApprove}
                  disabled={loading}
                >
                  {loading ? (
                    "Procesando..."
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Aprobar pago (Simulación)
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleReject}
                  disabled={loading}
                >
                  Rechazar pago (Simulación)
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Text className="text-xs text-gray-500 text-center">
                  Token: {token?.substring(0, 20)}...
                </Text>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}

export default function WebpaySimulatePage() {
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
      <WebpaySimulateContent />
    </Suspense>
  );
}
