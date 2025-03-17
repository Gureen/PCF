import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import './styles/global.css';
import { ProcessFlowProvider } from './context/ProcessFlowProvider';

/**
 * Client-side entry point for the application
 * Hydrates the React application using React 19's concurrent features
 * Wraps the application in the ProcessFlowProvider to provide context
 */
startTransition(() => {
  hydrateRoot(
    document,
    <ProcessFlowProvider>
      <HydratedRouter />
    </ProcessFlowProvider>,
  );
});
