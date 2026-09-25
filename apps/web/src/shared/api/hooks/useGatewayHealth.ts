import { useQuery } from '@tanstack/react-query';
import { gatewayApi } from '../gateway.api';

export const GATEWAY_QUERY_KEYS = {
  health: ['gateway', 'health'] as const,
  ready: ['gateway', 'ready'] as const,
  metrics: ['gateway', 'metrics'] as const,
};

export function useGatewayHealth(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: GATEWAY_QUERY_KEYS.health,
    queryFn: () => gatewayApi.getHealth(),
    refetchInterval: options?.refetchInterval ?? 30000,
    retry: 1,
  });
}

export function useGatewayReady() {
  return useQuery({
    queryKey: GATEWAY_QUERY_KEYS.ready,
    queryFn: () => gatewayApi.getReady(),
    retry: 1,
  });
}
