import React from 'react';
import {
  QueryClientProvider as ReactQueryClientProvider
} from 'react-query';

import { queryClient } from './queryClient';

export const QueryClientProvider = (props: QueryClientProviderProps) => {
  return (
    <ReactQueryClientProvider {...props} client={queryClient} />
  )
}

export interface QueryClientProviderProps {
  children?: React.ReactNode;
}
