import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://onsubmit.github.io',
  base: 'web-apis',
  integrations: [
    starlight({
      title: 'Web APIs',
      social: {
        github: 'https://github.com/onsubmit/web-apis',
      },
      editLink: {
        baseUrl: 'https://github.com/onsubmit/web-apis/edit/main',
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Specifications',
          autogenerate: {
            directory: 'js',
          },
        },
      ],
    }),
    react(),
  ],
  // https://github.com/withastro/astro/issues/7629
  vite: {
    ssr: {
      noExternal: [
        '@mui/joy',
        '@mui/styled-engine',
        '@mui/system',
        '@mui/utils',
      ],
    },
  },
});
