import { type RouteConfig, index, route } from '@react-router/dev/routes';

/**
 * Application route configuration
 *
 * Each route is defined with a path and a component.
 * Adding IDs improves debugging and makes route references more reliable.
 * Routes are organized by feature/domain for better scalability.
 */

/**
 * Main application routes
 * Includes the home page and any other primary routes
 */
const mainRoutes = [index('pages/home/index.tsx', { id: 'home' })];

/**
 * Error handling routes
 * Includes the 404 page for handling unmatched routes
 */
const errorRoutes = [route('*', 'pages/404/index.tsx', { id: 'not-found' })];

/**
 * Combined application routes
 * All routes are combined into a single array and exported as the default
 */
export default [...mainRoutes, ...errorRoutes] satisfies RouteConfig;
