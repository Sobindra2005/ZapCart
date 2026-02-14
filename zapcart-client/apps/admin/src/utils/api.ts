
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
    getCustomers: (params?: { page?: number; limit?: number; sortBy?: 'newest' | 'name' }) => {
        return axiosInstance.get('/admin/users', { params });
    }
};
