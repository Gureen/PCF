import { createContext } from 'react';
import type { ProcessFlowContextType } from './types';

/**
 * Context for managing process flow state and operations
 */
export const ProcessFlowContext = createContext<ProcessFlowContextType | null>(
  null,
);
