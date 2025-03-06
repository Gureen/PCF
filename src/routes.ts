import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('pages/home/index.tsx'),
  route('*', 'pages/404/index.tsx'),
] satisfies RouteConfig;
