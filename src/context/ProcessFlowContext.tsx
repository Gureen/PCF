import { createContext } from 'react';
import type { ProcessFlowContextType } from './types';

/**
 * Context for the Process Flow functionality within the application
 *
 * This context provides access to activities, saved flows, and operations
 * for creating, updating, and managing process flows.
 *
 * @see ProcessFlowProvider for the implementation that provides this context
 * @see useProcessFlow for the hook that consumes this context
 */
export const ProcessFlowContext = createContext<ProcessFlowContextType | null>(
  null,
);
