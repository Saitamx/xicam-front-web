import { ShippingOption } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
    customHeaders?: Record<string, string>,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...customHeaders,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: `Error HTTP: ${response.status} ${response.statusText}` 
        }));
        
        let errorMessage = errorData.message || errorData.error || `Error HTTP: ${response.status}`;
        
        if (response.status === 409) {
          errorMessage = errorData.message || 'Este email ya está registrado. Por favor, inicia sesión o usa otro email.';
        } else if (response.status === 401) {
          errorMessage = errorData.message || 'Credenciales inválidas. Verifica tu email y contraseña.';
        } else if (response.status === 400) {
          errorMessage = errorData.message || errorData.error || 'Datos inválidos. Por favor, verifica la información ingresada.';
        } else if (response.status === 404) {
          errorMessage = errorData.message || 'Recurso no encontrado.';
        } else if (response.status >= 500) {
          errorMessage = 'Error del servidor. Por favor, intenta más tarde.';
        }
        
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).error = errorData;
        throw error;
      }

      return response.json();
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de red al conectar con el servidor');
    }
  }

  async get<T>(endpoint: string, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, customHeaders);
  }

  async post<T>(endpoint: string, data?: unknown, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, customHeaders);
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

export const productsApi = {
  getAll: () => apiClient.get('/products?isActive=true'),
  getFeatured: () => apiClient.get('/products/featured'),
  getById: (id: string) => apiClient.get(`/products/${id}`),
  getBySlug: (slug: string) => apiClient.get(`/products/slug/${slug}`),
  getByCategory: (categoryId: string) => apiClient.get(`/products?categoryId=${categoryId}&isActive=true`),
};

export const categoriesApi = {
  getAll: () => apiClient.get('/categories'),
  getById: (id: string) => apiClient.get(`/categories/${id}`),
  getBySlug: (slug: string) => apiClient.get(`/categories/slug/${slug}`),
};

export const ordersApi = {
  create: (data: any) => apiClient.post('/orders', data),
  getMyOrders: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null;
    return apiClient.get('/orders/my-orders', token ? { Authorization: `Bearer ${token}` } : {});
  },
  getById: (id: string) => apiClient.get(`/orders/${id}`),
  getShippingTypes: (): Promise<ShippingOption[]> => apiClient.get<ShippingOption[]>('/orders/shipping/types'),
  initiateWebpay: (orderId: string) => apiClient.post(`/orders/${orderId}/webpay/init`),
  confirmWebpay: (token: string) => apiClient.post('/orders/webpay/confirm', { token }),
};

export const customersApi = {
  register: (data: any) => apiClient.post('/customers/register', data),
  login: (data: { email: string; password: string }) => apiClient.post('/customers/login', data),
  getProfile: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null;
    return apiClient.get('/customers/me', token ? { Authorization: `Bearer ${token}` } : {});
  },
};
