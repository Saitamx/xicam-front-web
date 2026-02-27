"use client";

import Link from "next/link";
import { Card } from "../atoms/Card";
import { Category } from "@/types";
import { Sparkles } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link href={`/categorias/${category.slug}`}>
      <Card className="group text-center p-4 sm:p-6 hover:border-primary-300 border-2 border-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          )}
        </div>
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {category.description}
          </p>
        )}
      </Card>
    </Link>
  );
};
