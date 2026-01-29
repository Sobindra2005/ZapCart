
import axios from 'axios';
import { setAuthToken, removeAuthToken } from '@/app/actions/auth.actions';
import { useAuthStore } from '@/stores';
import { get } from 'http';

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8080/api';

const endpoints = {
    signup: '/auth/signup',
    login: '/auth/login',
    refreshToken: '/auth/refresh-token',
    logout: '/auth/logout',
}

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh the token
                const response = await axiosInstance.post(endpoints.refreshToken, {});

                if (response?.data?.data?.tokens?.accessToken) {
                    const newAccessToken = response.data.data.tokens.accessToken;

                    // Set the new token in httpOnly cookie
                    await setAuthToken(newAccessToken);

                    // Process queued requests
                    processQueue(null, newAccessToken);

                    isRefreshing = false;

                    // Retry the original request
                    return axiosInstance(originalRequest);
                } else {
                    throw new Error('Invalid refresh token response');
                }
            } catch (refreshError) {
                // Refresh token is invalid or expired
                processQueue(refreshError, null);
                isRefreshing = false;

                // Logout user
                await removeAuthToken();
                useAuthStore.getState().logout();

                // Redirect to login page
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


const apiClient = {
    get: async (endpoint: string, config = {}) => {
        const response = await axiosInstance.get(endpoint, config);
        return response.data;
    },
    post: async (endpoint: string, body: any, config = {}) => {
        const response = await axiosInstance.post(endpoint, body, config);
        return response.data;
    },
    delete: async (endpoint: string, config = {}) => {
        const response = await axiosInstance.delete(endpoint, config);
        return response.data;
    },
    put: async (endpoint: string, body: any, config = {}) => {
        const response = await axiosInstance.put(endpoint, body, config);
        return response.data;
    }
}

export const authApi = {
    signup: (data: { firstName: string; lastName: string; email: string; password: string }) => {
        return apiClient.post(endpoints.signup, data);
    },
    login: (data: { email: string; password: string }) => {
        return apiClient.post(endpoints.login, data);
    },
    refreshToken: () => {
        return apiClient.post(endpoints.refreshToken, {});
    },
    logout: () => {
        return apiClient.post(endpoints.logout, {});
    }
};

export const productApi = {
    getProducts: () => {
        return apiClient.get('/products/featured');
    },
    getProductById: (id: string) => {
        return apiClient.get(`/products/${id}`);
    },
    getReleatedProducts: (id: string) => {
        return apiClient.get(`/products/${id}/related`);
    }
};

export const reviewsApi = {
    getReviewsByProductId: (productId: string) => {
        return apiClient.get(`/reviews/product/${productId}`);
    },
    createReview: (data: FormData | { product: string; rating: number; comment: string; images?: string[] }) => {
        const config = data instanceof FormData ? {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        } : {};
        return apiClient.post('/reviews', data, config);
    },
    editReview: (reviewId: string, data: FormData | { rating?: number; comment?: string; images?: string[] }) => {
        const config = data instanceof FormData ? {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        } : {};
        return apiClient.put(`/reviews/${reviewId}`, data, config);
    },
    deleteReview: (reviewId: string) => {
        return apiClient.delete(`/reviews/${reviewId}`);
    },
    markHelpful: (reviewId: string) => {
        return apiClient.post(`/reviews/${reviewId}/helpful`, {});
    },
    markNotHelpful: (reviewId: string) => {
        return apiClient.post(`/reviews/${reviewId}/not-helpful`, {});
    }
}

export const systemSettingsApi = {
    getSettings: () => {
        return apiClient.get('/settings');
    }
};

export const addressApi = {
    getAllAddress: () => {
        return apiClient.get('/addresses');
    },
    createAddress: (data: { fullName: string; phone: string; address?: string; city: string; postalCode: string; isDefault: boolean }) => {
        return apiClient.post('/addresses', data);
    },
    getUserAddress: () => {
        return apiClient.get('/addresses/user');
    },
    getAddressById: (id: string) => {
        return apiClient.get(`/addresses/${id}`);
    },
    updateAddress: (id: string, data: { fullName?: string; phone?: string; address?: string; city?: string; postalCode?: string; isDefault?: boolean }) => {
        return apiClient.put(`/addresses/${id}`, data);
    },
    deleteAddress: (id: string) => {
        return apiClient.delete(`/addresses/${id}`);
    }
};

export const orderApi = {
    createOrder: (data: { items: Array<{ productId: string;  sku: string;  quantity: number; unitPrice: number; discount:number; }>; shippingAddressId: number; billingAddressId: number; paymentMethod: string; shippingCost: number; tax: number; discount: number }) => {
        return apiClient.post('/orders', data);
    }
};