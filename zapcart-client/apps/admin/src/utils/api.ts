
import axios from 'axios';
import { setAuthToken, removeAuthToken } from '@repo/lib/actions/auth.actions';
import { useAuthStore } from '@/stores';

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8080/api/v1';

const endpoints = {
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

        // Check if error is 401 and we haven't already tried to refresh, and it's not a login request
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes(endpoints.login)) {
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

export const authApi = {
    login: (data: { email: string; password: string }) => {
        return axiosInstance.post(endpoints.login, data);
    },
    logout: () => {
        return axiosInstance.post(endpoints.logout, {});
    }
};

export const customersApi = {
    getCustomers: (params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        search?: string;
    }) => {
        return axiosInstance.get('/admin/users', { params });
    }
};


export const salesApi = {
    getOrderAnalytics: (params?: {
        salesRange?: string;
        ordersRange?: string;
        aovRange?: string;
        refundRange?: string;
    }) => {
        return axiosInstance.get('/admin/analytics/orders', { params });
    },
    getTopProducts: (params?: {
        productsRange?: string;
        startDate?: string;
        endDate?: string;
    }) => {
        const response = axiosInstance.get('/admin/analytics/top-products', { params });
        console.log("Fetching top products with params:", { params, response });
        return response;
    },
    getChartData: (params?: {
        chartRange?: string;
        startDate?: string;
        endDate?: string;
    }) => {
        return axiosInstance.get('/admin/analytics/chart-data', { params });
    },
    getRecentLogisticsOrders: (
        params?: {
            start?: number;
            limit?: number;
        }
    ) => {
        return axiosInstance.get('/admin/orders/logistics/recent', { params });
    }
}

export const marketingApi = {
    // Hero Carousel Endpoints
    getHeroCarousel: (params?: {
        status?: string;
    }) => {
        return axiosInstance.get('/marketing/carousel', { params });
    },
    getHeroCarouselById: (id: string) => {
        return axiosInstance.get(`/marketing/carousel/${id}`);
    },
    createHeroCarousel: (data: FormData | { title: string; description: string; link: string; status?: string }) => {
        const config = data instanceof FormData ? {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        } : {};
        return axiosInstance.post('/marketing/carousel', data, config);
    },
    updateHeroCarousel: (id: string, data: FormData) => {
        const config = data instanceof FormData ? {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        } : {};
        return axiosInstance.patch(`/marketing/carousel/${id}`, data, config);
    },
    deleteHeroCarousel: (id: string) => {
        return axiosInstance.delete(`/marketing/carousel/${id}`);
    },

    // Flash Sales Endpoints
    getCampaigns: (params?: {
        status?: string;
        createdBy?: string;
        search?: string;
    }) => {
        return axiosInstance.get('/marketing/campaign', { params });
    },
    getCampaignById: (id: string, params?: {
        status?: string;
        createdBy?: string;
    }) => {
        return axiosInstance.get(`/marketing/campaign/${id}`, { params });
    },
    createCampaign: (data: FormData | { name: string; description: string; products: string[]; status?: string; discountType?: string; discountValue?: number, startDate: Date, endDate: Date }) => {
        const config = data instanceof FormData ? {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        } : {};
        return axiosInstance.post('/marketing/campaign', data, config);
    },
    updateCampaign: (id: string, data: FormData) => {
        const config = data instanceof FormData ? {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        } : {};
        return axiosInstance.patch(`/marketing/campaign/${id}`, data, config);
    },
    deleteCampaign: (id: string) => {
        return axiosInstance.delete(`/marketing/campaign/${id}`);
    },

}