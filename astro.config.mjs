import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://onsubmit.github.io",
  base: "web-apis",
  integrations: [
    starlight({
      title: "Web APIs",
      social: {
        github: "https://github.com/onsubmit/web-apis",
      },
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "Specifications",
          autogenerate: {
            directory: "js",
          },
        },
      ],
    }),
    react(),
  ],
});
