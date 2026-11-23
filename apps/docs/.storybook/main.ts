import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [],
  framework: "@storybook/react-vite",
  docs: { autodocs: "tag" },
  async viteFinal(viteConfig) {
    const rollupOptions = viteConfig.build?.rollupOptions ?? {};
    const previousOnWarn = rollupOptions.onwarn;
    return {
      ...viteConfig,
      build: {
        ...viteConfig.build,
        rollupOptions: {
          ...rollupOptions,
          onwarn(warning, defaultHandler) {
            // Keep Next.js client-boundary directives in published output; Vite does not use them.
            if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client")) return;
            // Storybook's preview runtime uses eval internally; this known vendor warning is not app code.
            if (warning.code === "EVAL" && warning.id?.includes("@storybook/core/dist/preview/runtime")) return;
            if (typeof previousOnWarn === "function") previousOnWarn(warning, defaultHandler);
            else defaultHandler(warning);
          }
        }
      }
    };
  }
};

export default config;
