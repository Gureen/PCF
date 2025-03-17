import { useContext } from 'react';
import { ProcessFlowContext } from './ProcessFlowContext';

/**
 * Custom hook that provides access to the ProcessFlow context values and actions
 *
 * @returns {ProcessFlowContextType} The process flow context containing state and actions
 * @throws {Error} If used outside of a ProcessFlowProvider component
 * @example
 * const { activities, addActivity, saveFlow } = useProcessFlow();
 */
export const useProcessFlow = () => {
  const context = useContext(ProcessFlowContext);
  const isContextNull = context === null;

  if (isContextNull) {
    throw new Error('useProcessFlow must be used within a ProcessFlowProvider');
  }

  return context;
};
