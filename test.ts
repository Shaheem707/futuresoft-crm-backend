import { db } from './lib/index.js';
import { sql } from 'drizzle-orm';

async function main() {
    try {
        const result = await db.execute(sql`SELECT 1 + 1 AS result`);
        console.log("✅ Database Connected! Result:", result[0]);
        process.exit(0);
    } catch (err) {
        console.error("❌ Connection failed:", err);
        process.exit(1);
        // test
    }
}

main();