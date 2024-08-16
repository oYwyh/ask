import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/lib/db/schema.ts',
    out: './migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.ASK_DATABASE_URL!,
    },
    verbose: true, // generating migrations will tell you what have changed
    strict: true, // when running the migrations if it needs to change something it will tell you
});