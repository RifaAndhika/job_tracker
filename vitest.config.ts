import {defineConfig} from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        environment: "node",
        include: ["src/__test__/**/*.test.ts"],
        setupFiles: ["./src/__test__/helpers/prismaMock.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
        },
    },
});