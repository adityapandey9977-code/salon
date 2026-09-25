import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiErrorResponse, ApiResponse, RefreshTokenResponse } from './types';

const BASE_GATEWAY_URL =
  import.meta.env.VITE_API_GATEWAY_URL ||
  (import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL || 'http://localhost:3030');

// Token Storage Keys
const ACCESS_TOKEN_KEY = 'digiflex_access_token';
const REFRESH_TOKEN_KEY = 'digiflex_refresh_token';
const TENANT_ID_KEY = 'digiflex_tenant_id';
const FRANCHISE_ID_KEY = 'digiflex_franchise_id';
const BRANCH_ID_KEY = 'digiflex_branch_id';

export const tokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string): void => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string): void => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TENANT_ID_KEY);
    localStorage.removeItem(FRANCHISE_ID_KEY);
    localStorage.removeItem(BRANCH_ID_KEY);
  },
  getTenantId: (): string | null => localStorage.getItem(TENANT_ID_KEY),
  setTenantId: (tenantId: string): void => localStorage.setItem(TENANT_ID_KEY, tenantId),
  getFranchiseId: (): string | null => localStorage.getItem(FRANCHISE_ID_KEY),
  setFranchiseId: (id: string): void => localStorage.setItem(FRANCHISE_ID_KEY, id),
  getBranchId: (): string | null => localStorage.getItem(BRANCH_ID_KEY),
  setBranchId: (id: string): void => localStorage.setItem(BRANCH_ID_KEY, id),
};

function generateCorrelationId(): string {
  return `web-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach Auth Token, Correlation ID, and Context Headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.headers) {
      config.headers['x-correlation-id'] = generateCorrelationId();

      const tenantId = tokenStorage.getTenantId();
      if (tenantId) {
        config.headers['x-tenant-id'] = tenantId;
      }

      const franchiseId = tokenStorage.getFranchiseId();
      if (franchiseId) {
        config.headers['x-franchise-id'] = franchiseId;
      }

      const branchId = tokenStorage.getBranchId();
      if (branchId) {
        config.headers['x-branch-id'] = branchId;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle 401 and Token Refreshing Queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Don't retry authentication mutation endpoints (login, refresh, mfa, password reset)
    const requestUrl = originalRequest?.url || '';
    const isAuthEndpoint =
      requestUrl.includes('/login') ||
      requestUrl.includes('/refresh-token') ||
      requestUrl.includes('/mfa/verify') ||
      requestUrl.includes('/forgot-password') ||
      requestUrl.includes('/reset-password') ||
      requestUrl.includes('/staff/me');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest._retry = true;
            if (originalRequest.headers) {
              if (typeof (originalRequest.headers as any).set === 'function') {
                (originalRequest.headers as any).set('Authorization', `Bearer ${token}`);
              } else {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        tokenStorage.clearTokens();
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        return Promise.reject(error);
      }

      try {
        let newAccessToken: string;
        let newRefreshToken: string | undefined;

        const performRefresh = async () => {
          const currentRefreshToken = tokenStorage.getRefreshToken();
          // If another tab has already refreshed the token, we can just use it
          if (currentRefreshToken && currentRefreshToken !== refreshToken) {
            newAccessToken = tokenStorage.getAccessToken() as string;
            newRefreshToken = currentRefreshToken;
            return;
          }

          const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
            '/api/v1/auth/refresh-token',
            { refreshToken: currentRefreshToken },
            {
              baseURL: BASE_GATEWAY_URL,
              headers: { 'Content-Type': 'application/json' },
            },
          );

          newAccessToken = response.data.data.accessToken;
          newRefreshToken = response.data.data.refreshToken;

          tokenStorage.setAccessToken(newAccessToken);
          if (newRefreshToken) {
            tokenStorage.setRefreshToken(newRefreshToken);
          }
        };

        if (typeof navigator !== 'undefined' && navigator.locks) {
          await navigator.locks.request('auth_refresh_token', performRefresh);
        } else {
          await performRefresh();
        }

        if (originalRequest.headers) {
          if (typeof (originalRequest.headers as any).set === 'function') {
            (originalRequest.headers as any).set('Authorization', `Bearer ${newAccessToken!}`);
          } else {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken!}`;
          }
        }

        processQueue(null, newAccessToken!);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clearTokens();
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
