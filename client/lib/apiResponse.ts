export interface ApiMeta {
  total: number;
  page: number;
  pageSize: number;
  timestamp: string;
  executionTimeMs: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: ApiMeta;
  error?: {
    code: string;
    message: string;
  };
}

export function createApiResponse<T>(
  data: T,
  meta: Omit<ApiMeta, "timestamp"> & { timestamp?: string }
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      ...meta,
      timestamp: meta.timestamp ?? new Date().toISOString(),
    },
  };
}
