import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import { ProcessFlowProvider } from './context';
import './styles/global.css';

startTransition(() => {
  hydrateRoot(
    document,
    <ProcessFlowProvider>
      <HydratedRouter />
    </ProcessFlowProvider>,
  );
});
