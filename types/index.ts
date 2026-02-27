export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  slug: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  category?: Category;
  size?: string;
  color?: string;
  canBeEmbroidered?: boolean;
  embroideryPrice?: number;
  size?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId?: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  isEmbroidered?: boolean;
  embroideryName?: string;
  embroideryPrice?: number;
  product?: Product;
  createdAt: string;
  updatedAt: string;
}

export type ShippingType = 'chilexpress' | 'correos_chile' | 'starken' | 'retiro_tienda';

export interface ShippingOption {
  type: ShippingType;
  name: string;
  description: string;
  estimatedDays: number;
  price: number;
  enabled: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress?: string;
  shippingType?: ShippingType;
  trackingNumber?: string;
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'webpay' | 'transfer' | 'cash';
  paymentStatus: 'pending' | 'approved' | 'rejected' | 'cancelled';
  webpayToken?: string;
  webpayTransactionId?: string;
  notes?: string;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WebpayResponse {
  token: string;
  url: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  region?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
