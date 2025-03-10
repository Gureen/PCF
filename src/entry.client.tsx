import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import './styles/global.css';
import { ProcessFlowProvider } from './context/ProcessFlowProvider';

startTransition(() => {
  hydrateRoot(
    document,
    <ProcessFlowProvider>
      <HydratedRouter />
    </ProcessFlowProvider>,
  );
});
