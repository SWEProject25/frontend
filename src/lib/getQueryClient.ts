import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';
import { defaultQueryOptions } from './config/query';

export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: defaultQueryOptions,
    })
);
