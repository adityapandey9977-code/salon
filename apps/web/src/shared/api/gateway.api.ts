import { apiClient } from './client';
import type { GatewayHealthResponse, GatewayReadyResponse } from './types';

export const gatewayApi = {
  /**
   * Check API Gateway liveness & downstream dependency status
   */
  async getHealth(): Promise<GatewayHealthResponse> {
    const response = await apiClient.get<GatewayHealthResponse>('/health');
    return response.data;
  },

  /**
   * Check API Gateway readiness for handling traffic
   */
  async getReady(): Promise<GatewayReadyResponse> {
    const response = await apiClient.get<GatewayReadyResponse>('/ready');
    return response.data;
  },

  /**
   * Fetch Prometheus metrics from the Gateway
   */
  async getMetrics(): Promise<string> {
    const response = await apiClient.get<string>('/metrics', {
      responseType: 'text',
    });
    return response.data;
  },
};
