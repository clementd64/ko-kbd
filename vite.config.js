import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "production") {
    return {
      build: {
        lib: {
          entry: "index.ts",
          formats: ["es"],
        },
      },
    };
  }

  return {};
});
