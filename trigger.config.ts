import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: "proj_vqvrevlyccwiuylcprrb",
  dirs: ["./trigger/tasks"],
  logLevel: "log",
  maxDuration: 3600,
  retries: {
    enabledInDev: false,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 5000,
      maxTimeoutInMs: 30000,
      factor: 2,
      randomize: true,
    },
  },
  build: {
    extensions: [],
  },
});
