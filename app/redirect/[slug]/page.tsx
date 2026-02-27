import sql, { initDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import RedirectPageClient from './RedirectPageClient';

export default async function RedirectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // List of reserved paths and static file extensions to skip
    const reserved = ['admin', 'api', 'favicon.ico', 'robots.txt', 'sitemap.xml'];
    if (!slug || reserved.includes(slug) || slug.includes('.')) {
        return notFound();
    }

    try {
        await initDb();
        const { rows } = await sql`SELECT url FROM redirects WHERE id = ${slug}`;
        const redirectData = rows[0] as { url: string } | undefined;

        if (redirectData) {
            // Increment clicks immediately when the page is loaded
            await sql`UPDATE redirects SET clicks = clicks + 1 WHERE id = ${slug}`;
            await sql`INSERT INTO redirect_click_events (redirect_id) VALUES (${slug})`;

            return <RedirectPageClient url={redirectData.url} />;
        }
    } catch (error) {
        console.error('Redirect error:', error);
    }

    return notFound();
}
