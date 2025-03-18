//@ts-ignore
import { reactRouter } from '@react-router/dev/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import type { PluginOption } from 'vite';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import type { VitePWAOptions } from 'vite-plugin-pwa';
import { VitePWA } from 'vite-plugin-pwa';
import tsConfigPaths from 'vite-tsconfig-paths';

const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  manifest: {
    short_name: 'PFC',
    name: 'Process Flow Configurator',
    lang: 'en',
    start_url: '/',
    background_color: '#FFFFFF',
    theme_color: '#FFFFFF',
    dir: 'ltr',
    display: 'standalone',
    prefer_related_applications: false,
    icons: [
      {
        src: '/assets/favicon.svg',
        purpose: 'any',
        sizes: '48x48 72x72 96x96 128x128 256x256',
      },
    ],
  },
};

export default defineConfig({
  plugins: [
    checker({
      typescript: true,
      biome: true,
    }),
    tsConfigPaths(),
    reactRouter(),
    visualizer({ template: 'sunburst' }) as unknown as PluginOption,
    VitePWA(pwaOptions),
  ],
  server: {
    open: true,
  },
});
