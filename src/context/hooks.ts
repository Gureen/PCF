import { useContext } from 'react';
import { ProcessFlowContext } from './ProcessFlowContext';

/**
 * Hook for accessing the process flow context
 * Throws an error if used outside of a ProcessFlowProvider
 */
export const useProcessFlow = () => {
  const context = useContext(ProcessFlowContext);
  const isContextNull = context === null;

  if (isContextNull) {
    throw new Error('useProcessFlow must be used within a ProcessFlowProvider');
  }

  return context;
};
