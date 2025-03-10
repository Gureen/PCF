import { Meta, Outlet, Scripts, isRouteErrorResponse } from 'react-router';
import type { Route } from './+types/root';
import type { ErrorMessageProps } from './interfaces';

/**
 * Application layout component
 * Defines the main HTML structure and includes necessary meta tags and scripts
 */
export function Layout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PFC</title>
        <Meta />
      </head>
      <body>
        <Scripts />
        <div className="content-container">
          <Outlet />
        </div>
      </body>
    </html>
  );
}

/**
 * Root component that serves as the application's entry point
 * This simply renders the current route via Outlet
 */
// biome-ignore lint/style/noDefaultExport: <explanation>
export default function Root() {
  return <Outlet />;
}

/**
 * Error message component to display error details
 */
function ErrorMessage({ message, details, stack }: ErrorMessageProps) {
  const stackTraceElement = stack && import.meta.env.DEV && (
    <pre className="w-full p-4 overflow-x-auto">
      <code>{stack}</code>
    </pre>
  );

  return (
    <main className="pt-16 p-4 container mx-auto content-container">
      <h1>{message}</h1>
      <p>{details}</p>
      {stackTraceElement}
    </main>
  );
}

/**
 * Error boundary to catch and display route errors
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    const message = error.status === 404 ? '404' : 'Error';
    const details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || 'An unexpected error occurred.';

    return <ErrorMessage message={message} details={details} />;
  }

  // Handle non-route errors
  const isDevMode = import.meta.env.DEV;
  const details =
    isDevMode && error instanceof Error
      ? error.message
      : 'An unexpected error occurred.';
  const stack = isDevMode && error instanceof Error ? error.stack : undefined;

  return <ErrorMessage message="Oops!" details={details} stack={stack} />;
}
