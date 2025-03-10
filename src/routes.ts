import { type RouteConfig, index, route } from '@react-router/dev/routes';

/**
 * Application route configuration
 *
 * Each route is defined with a path and a component.
 * Adding IDs improves debugging and makes route references more reliable.
 * Routes are organized by feature/domain for better scalability.
 */

// Main routes
const mainRoutes = [index('pages/home/index.tsx', { id: 'home' })];

// Error handling routes
const errorRoutes = [route('*', 'pages/404/index.tsx', { id: 'not-found' })];

export default [...mainRoutes, ...errorRoutes] satisfies RouteConfig;
