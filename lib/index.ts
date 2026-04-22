import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./db/schema.js";
import * as relations from "./db/relations.js";

const connection = mysql.createPool(process.env.DATABASE_URL!);

export const db = drizzle(connection, { 
    schema: { ...schema, ...relations }, 
    mode: 'default' 
});