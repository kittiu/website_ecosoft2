import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://ecosoft.co.th",
  srcDir: "src",
  server: {
    port: 4321,
  },
  scopedStyleStrategy: "where",
  integrations: [sitemap()],
});

