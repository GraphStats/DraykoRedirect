import sql, { initDb } from '@/lib/db';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import RedirectPageClient from './RedirectPageClient';

function getSourceType(referrerHost: string | null): string {
    if (!referrerHost) return 'direct';

    const host = referrerHost.toLowerCase();
    if (
        host.includes('google.') ||
        host.includes('bing.') ||
        host.includes('duckduckgo.') ||
        host.includes('yahoo.')
    ) {
        return 'search';
    }

    if (
        host.includes('x.com') ||
        host.includes('twitter.com') ||
        host.includes('facebook.com') ||
        host.includes('instagram.com') ||
        host.includes('tiktok.com') ||
        host.includes('linkedin.com') ||
        host.includes('reddit.com') ||
        host.includes('youtube.com')
    ) {
        return 'social';
    }

    return 'referral';
}

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
        const headerStore = await headers();
        const referer = headerStore.get('referer');
        const userAgent = headerStore.get('user-agent');
        const countryCode = headerStore.get('x-vercel-ip-country') || headerStore.get('cf-ipcountry');

        let referrerHost: string | null = null;
        if (referer) {
            try {
                referrerHost = new URL(referer).hostname;
            } catch {
                referrerHost = null;
            }
        }

        const sourceType = getSourceType(referrerHost);

        const { rows } = await sql`SELECT url FROM redirects WHERE id = ${slug}`;
        const redirectData = rows[0] as { url: string } | undefined;

        if (redirectData) {
            const eventToken = `${slug}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
            let trackedToken = '';

            // Increment clicks immediately when the page is loaded
            await sql`UPDATE redirects SET clicks = clicks + 1 WHERE id = ${slug}`;
            await sql`
              INSERT INTO redirect_click_events (redirect_id, referrer_host, source_type, country_code, user_agent)
              VALUES (${slug}, ${referrerHost}, ${sourceType}, ${countryCode}, ${userAgent})
            `;
            try {
                await sql`
                  INSERT INTO redirect_wait_events (redirect_id, event_token, status)
                  VALUES (${slug}, ${eventToken}, 'pending')
                `;
                trackedToken = eventToken;
            } catch (trackingError) {
                console.error('Redirect wait tracking insert failed:', trackingError);
            }

            return <RedirectPageClient url={redirectData.url} eventToken={trackedToken} />;
        }
    } catch (error) {
        console.error('Redirect error:', error);
    }

    return notFound();
}
