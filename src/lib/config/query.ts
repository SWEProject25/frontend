import { DefaultOptions } from '@tanstack/react-query';

export const defaultQueryOptions: DefaultOptions = {
  queries: {
    staleTime: 60 * 1000, // 1 minute
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const statusCode = (error as { statusCode: number }).statusCode;
        if (statusCode === 401 || statusCode === 403) {
          return false;
        }
      }
      return failureCount < 3;
    },
  },
  mutations: {
    retry: false,
  },
};
