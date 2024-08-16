import { drizzle } from 'drizzle-orm/postgres-js' // the way we connect
import * as schema from '@/lib/db/schema'  // getting the schema
import postgres from 'postgres' // getting the database driver

import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";

const client = postgres(process.env.ASK_DATABASE_URL as string, {
    max: 1, // Max number of clients in the pool
    ssl: false // if you are using SSL
});

const usersClient = postgres(process.env.USERS_DATABASE_URL as string, {
    max: 1, // Max number of clients in the pool
    ssl: false // if you are using SSL
});

export const db: PostgresJsDatabase<typeof schema> = drizzle(client, { schema, logger: true /* to log all the sql query we make */ })

export const usersDb: PostgresJsDatabase = drizzle(usersClient)

export default db;