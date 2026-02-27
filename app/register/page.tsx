"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageTemplate } from "@/components/templates/PageTemplate";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { UserPlus, Mail, Phone, MapPin, Lock, User } from "lucide-react";
import Link from "next/link";
import { customersApi } from "@/lib/api";
import { useNotification } from "@/contexts/NotificationContext";
import { useCustomer } from "@/contexts/CustomerContext";

export default function RegisterPage() {
  const router = useRouter();
  const notification = useNotification();
  const { login } = useCustomer();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    region: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      notification.showError("Por favor, ingresa tu nombre completo");
      return;
    }

    if (!formData.email.trim()) {
      notification.showError("Por favor, ingresa tu email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      notification.showError("Por favor, ingresa un email válido");
      return;
    }

    if (!formData.phone.trim()) {
      notification.showError("Por favor, ingresa tu teléfono");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      notification.showError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      notification.showError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const { customer, token } = await customersApi.register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address || undefined,
        city: formData.city || undefined,
        region: formData.region || undefined,
      }) as { customer: any; token: string };

      login(token, customer);

      notification.showSuccess("🎉 ¡Registro exitoso! Bienvenido a Xicam");
      
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error: any) {
      console.error("Error al registrar:", error);
      
      let errorMessage = "Error al registrar. Por favor, intenta nuevamente.";
      
      if (error.status === 409) {
        errorMessage = "❌ Este email ya está registrado. ¿Ya tienes una cuenta? Inicia sesión o usa otro email.";
      } else if (error.status === 400) {
        errorMessage = error.message ? `❌ ${error.message}` : "❌ Por favor, completa todos los campos requeridos correctamente.";
      } else if (error.message) {
        errorMessage = `❌ ${error.message}`;
      }
      
      notification.showError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <PageTemplate>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-md mx-auto">
            <Card className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-primary-600" />
                </div>
                <Heading level={1} className="mb-2">Crear cuenta</Heading>
                <Text className="text-gray-600 text-sm">
                  Regístrate para una experiencia personalizada
                </Text>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="juan@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+56912345678"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-4 h-4 inline mr-1" />
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      id="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar contraseña *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Repite la contraseña"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Calle y número"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Santiago"
                    />
                  </div>

                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                      Región
                    </label>
                    <input
                      type="text"
                      id="region"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Región Metropolitana"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Registrando..." : "Crear cuenta"}
                </Button>

                <div className="text-center">
                  <Text className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                      Inicia sesión
                    </Link>
                  </Text>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
