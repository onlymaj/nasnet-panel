import { StrictMode } from 'react';

import { RouterProvider, createRouter } from '@tanstack/react-router';
import * as ReactDOM from 'react-dom/client';

import { routeTree } from './routeTree.gen';

import './styles.css';


// Create the router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
