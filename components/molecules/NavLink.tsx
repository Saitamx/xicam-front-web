"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const NavLink = ({ href, children, className = "" }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
        isActive
          ? "bg-primary-100 text-primary-700"
          : "text-gray-700 hover:bg-gray-100 hover:text-primary-600"
      } ${className}`}
    >
      {children}
    </Link>
  );
};
