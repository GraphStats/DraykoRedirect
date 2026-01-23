import { sql } from '@vercel/postgres';

// Note: With @vercel/postgres, the schema creation is usually done once or 
// handled via migrations. For a simple app, we can check/create in the first call
// or just assume it's created via a script.
// For now, we'll export the sql object.

export async function initDb() {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS redirects (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        clicks INTEGER DEFAULT 0
      )
    `;
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}

export default sql;
