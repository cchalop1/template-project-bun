import { drizzle } from "drizzle-orm/bun-sql";

// biome-ignore lint/style/noNonNullAssertion: DATABASE_URL is required at startup
export const db = drizzle(Bun.env.DATABASE_URL!);
