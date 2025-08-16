import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "<your-project-ref>",
  dirs: [
    "./packages/package-a/trigger",
    "./packages/package-b/trigger"
  ],
  ignorePatterns: [
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/non-tasks.ts"
  ],
  retries: {
    enabledInDev: false,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
});
