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
        await sql`ALTER TABLE redirects ADD COLUMN IF NOT EXISTS user_id TEXT`;
        await sql`CREATE INDEX IF NOT EXISTS redirects_user_id_idx ON redirects(user_id)`;
        await sql`
      CREATE TABLE IF NOT EXISTS redirect_click_events (
        id BIGSERIAL PRIMARY KEY,
        redirect_id TEXT NOT NULL REFERENCES redirects(id) ON DELETE CASCADE,
        clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
        await sql`CREATE INDEX IF NOT EXISTS redirect_click_events_redirect_id_idx ON redirect_click_events(redirect_id)`;
        await sql`CREATE INDEX IF NOT EXISTS redirect_click_events_clicked_at_idx ON redirect_click_events(clicked_at)`;
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}

export default sql;
