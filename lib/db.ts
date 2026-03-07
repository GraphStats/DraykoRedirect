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
        clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        referrer_host TEXT,
        source_type TEXT,
        country_code TEXT,
        user_agent TEXT
      )
    `;
        await sql`ALTER TABLE redirect_click_events ADD COLUMN IF NOT EXISTS referrer_host TEXT`;
        await sql`ALTER TABLE redirect_click_events ADD COLUMN IF NOT EXISTS source_type TEXT`;
        await sql`ALTER TABLE redirect_click_events ADD COLUMN IF NOT EXISTS country_code TEXT`;
        await sql`ALTER TABLE redirect_click_events ADD COLUMN IF NOT EXISTS user_agent TEXT`;
        await sql`CREATE INDEX IF NOT EXISTS redirect_click_events_redirect_id_idx ON redirect_click_events(redirect_id)`;
        await sql`CREATE INDEX IF NOT EXISTS redirect_click_events_clicked_at_idx ON redirect_click_events(clicked_at)`;
        await sql`CREATE INDEX IF NOT EXISTS redirect_click_events_source_type_idx ON redirect_click_events(source_type)`;
        await sql`CREATE INDEX IF NOT EXISTS redirect_click_events_referrer_host_idx ON redirect_click_events(referrer_host)`;
        await sql`
      CREATE TABLE IF NOT EXISTS redirect_wait_events (
        id BIGSERIAL PRIMARY KEY,
        redirect_id TEXT NOT NULL REFERENCES redirects(id) ON DELETE CASCADE,
        event_token TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL DEFAULT 'pending',
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
        await sql`ALTER TABLE redirect_wait_events ADD COLUMN IF NOT EXISTS redirect_id TEXT`;
        await sql`ALTER TABLE redirect_wait_events ADD COLUMN IF NOT EXISTS event_token TEXT`;
        await sql`ALTER TABLE redirect_wait_events ADD COLUMN IF NOT EXISTS status TEXT`;
        await sql`ALTER TABLE redirect_wait_events ADD COLUMN IF NOT EXISTS started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
        await sql`ALTER TABLE redirect_wait_events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
        await sql`CREATE UNIQUE INDEX IF NOT EXISTS redirect_wait_events_event_token_uidx ON redirect_wait_events(event_token)`;
        await sql`CREATE INDEX IF NOT EXISTS redirect_wait_events_redirect_id_idx ON redirect_wait_events(redirect_id)`;
        await sql`CREATE INDEX IF NOT EXISTS redirect_wait_events_status_idx ON redirect_wait_events(status)`;
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}

export default sql;
