import { z } from "zod";
declare const envSchema: z.ZodObject<{
    PORT: z.ZodString;
    DATABASE_URL: z.ZodString;
    JWT_SECRET: z.ZodString;
}, z.core.$strip>;
export declare const env: {
    PORT: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
};
export type Env = z.infer<typeof envSchema>;
export default env;
//# sourceMappingURL=env.d.ts.map