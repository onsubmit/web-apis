import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
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
          autogenerate: { directory: "web-apis" },
        },
      ],
    }),
  ],
});
