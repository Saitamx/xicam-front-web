"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  GraduationCap,
  Shirt,
  Award
} from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50">
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary-200/15 to-blue-200/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-gradient-to-tl from-blue-200/12 to-primary-200/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg mb-6 sm:mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <Text className="text-sm font-semibold text-primary-700">
              Uniformes Escolares Pacific School
            </Text>
          </div>

          <Heading 
            level={1} 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 text-gray-900 leading-tight"
          >
            <span className="block mb-2">Uniformes Escolares</span>
            <span className="block bg-gradient-to-r from-primary-600 via-blue-600 to-primary-700 bg-clip-text text-transparent">
              con Estilo y Calidad
            </span>
          </Heading>

          <Text className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Descubre nuestra colección completa de uniformes escolares para Pacific School. 
            <span className="block mt-2 font-semibold text-primary-700">
              Bordado de nombres disponible. Calidad garantizada.
            </span>
          </Text>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16">
            <Link href="/productos">
              <Button 
                size="lg" 
                className="group shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
              >
                <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Ver Productos
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/categorias">
              <Button 
                variant="outline" 
                size="lg"
                className="group border-2 border-primary-300 hover:border-primary-500 hover:bg-primary-50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Ver Categorías
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
            <div className="group p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-100 hover:border-primary-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <Text className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">Pacific School</Text>
              <Text className="text-xs text-gray-600">Uniformes oficiales</Text>
            </div>

            <div className="group p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-100 hover:border-primary-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Shirt className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <Text className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">Bordado</Text>
              <Text className="text-xs text-gray-600">Personalización</Text>
            </div>

            <div className="group p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-100 hover:border-primary-300 hover:shadow-lg transition-all duration-300 hover:scale-105 col-span-2 sm:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <Text className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">Calidad</Text>
              <Text className="text-xs text-gray-600">Garantizada</Text>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
