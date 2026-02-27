'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import sql, { initDb } from './db';

export interface UserDashboardStats {
    totals: {
        links: number;
        totalClicks: number;
        activeLinks: number;
        avgClicksPerLink: number;
        bestLinkId: string | null;
        bestLinkClicks: number;
    };
    clicksLast7Days: Array<{
        date: string;
        clicks: number;
    }>;
    topLinks: Array<{
        id: string;
        url: string;
        clicks: number;
    }>;
    recentClicks: Array<{
        redirect_id: string;
        clicked_at: string;
        source_type: string | null;
        referrer_host: string | null;
    }>;
    trafficSources: Array<{
        source: string;
        clicks: number;
    }>;
}

export interface UserLinkStats {
    totals: {
        clicks: number;
        last24h: number;
        last7d: number;
    };
    clicksLast7Days: Array<{
        date: string;
        clicks: number;
    }>;
    trafficSources: Array<{
        source: string;
        clicks: number;
    }>;
    topReferrers: Array<{
        referrer_host: string;
        clicks: number;
    }>;
}

export async function createUserRedirect(url: string, customId?: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const id = customId || nanoid(6);

    try {
        await initDb();
        await sql`INSERT INTO redirects (id, url, user_id) VALUES (${id}, ${url}, ${userId})`;
        revalidatePath('/dashboard');
        return { success: true, id };
    } catch (error: any) {
        if (error.code === '23505') {
            return { error: 'Cet identifiant existe deja.' };
        }
        console.error('Create redirect error:', error);
        return { error: 'Une erreur est survenue.' };
    }
}

export async function deleteUserRedirect(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await sql`DELETE FROM redirects WHERE id = ${id} AND user_id = ${userId}`;
    revalidatePath('/dashboard');
    return { success: true };
}

export async function getUserRedirects() {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    try {
        const { rows } =
            await sql`SELECT * FROM redirects WHERE user_id = ${userId} ORDER BY created_at DESC`;
        return rows as any[];
    } catch (error: any) {
        if (error.message?.includes('relation "redirects" does not exist')) {
            console.log('Table "redirects" not found, creating...');
            await initDb();
            return [];
        }
        console.error('Get redirects error:', error);
        return [];
    }
}

export async function getUserRedirectStats(): Promise<UserDashboardStats> {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    try {
        await initDb();

        const { rows: totalsRows } = await sql`
      SELECT
        COUNT(*)::int AS links,
        COALESCE(SUM(clicks), 0)::int AS total_clicks,
        COUNT(*) FILTER (WHERE clicks > 0)::int AS active_links
      FROM redirects
      WHERE user_id = ${userId}
    `;

        const { rows: bestLinkRows } = await sql`
      SELECT id, clicks
      FROM redirects
      WHERE user_id = ${userId}
      ORDER BY clicks DESC, created_at ASC
      LIMIT 1
    `;

        const { rows: clicksLast7DaysRows } = await sql`
      WITH days AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '6 days',
          CURRENT_DATE,
          INTERVAL '1 day'
        )::date AS day
      )
      SELECT
        TO_CHAR(days.day, 'YYYY-MM-DD') AS date,
        COALESCE(COUNT(r.id), 0)::int AS clicks
      FROM days
      LEFT JOIN redirect_click_events e
        ON e.clicked_at >= days.day
       AND e.clicked_at < days.day + INTERVAL '1 day'
      LEFT JOIN redirects r
        ON r.id = e.redirect_id
       AND r.user_id = ${userId}
      GROUP BY days.day
      ORDER BY days.day ASC
    `;

        const { rows: topLinksRows } = await sql`
      SELECT id, url, clicks
      FROM redirects
      WHERE user_id = ${userId}
      ORDER BY clicks DESC, created_at DESC
      LIMIT 5
    `;

        const { rows: recentClicksRows } = await sql`
      SELECT
        e.redirect_id,
        e.clicked_at,
        e.source_type,
        e.referrer_host
      FROM redirect_click_events e
      INNER JOIN redirects r ON r.id = e.redirect_id
      WHERE r.user_id = ${userId}
      ORDER BY e.clicked_at DESC
      LIMIT 8
    `;

        const { rows: trafficSourcesRows } = await sql`
      SELECT
        COALESCE(e.source_type, 'unknown') AS source,
        COUNT(*)::int AS clicks
      FROM redirect_click_events e
      INNER JOIN redirects r ON r.id = e.redirect_id
      WHERE r.user_id = ${userId}
      GROUP BY COALESCE(e.source_type, 'unknown')
      ORDER BY clicks DESC
      LIMIT 6
    `;

        const totals = totalsRows[0] as
            | { links: number; total_clicks: number; active_links: number }
            | undefined;
        const bestLink = bestLinkRows[0] as { id: string; clicks: number } | undefined;

        const links = totals?.links ?? 0;
        const totalClicks = totals?.total_clicks ?? 0;
        const activeLinks = totals?.active_links ?? 0;

        return {
            totals: {
                links,
                totalClicks,
                activeLinks,
                avgClicksPerLink: links > 0 ? Number((totalClicks / links).toFixed(1)) : 0,
                bestLinkId: bestLink?.id ?? null,
                bestLinkClicks: bestLink?.clicks ?? 0,
            },
            clicksLast7Days: clicksLast7DaysRows as Array<{ date: string; clicks: number }>,
            topLinks: topLinksRows as Array<{ id: string; url: string; clicks: number }>,
            recentClicks: recentClicksRows as Array<{ redirect_id: string; clicked_at: string; source_type: string | null; referrer_host: string | null }>,
            trafficSources: trafficSourcesRows as Array<{ source: string; clicks: number }>,
        };
    } catch (error: any) {
        if (
            error.message?.includes('relation "redirects" does not exist') ||
            error.message?.includes('relation "redirect_click_events" does not exist')
        ) {
            await initDb();
        }

        return {
            totals: {
                links: 0,
                totalClicks: 0,
                activeLinks: 0,
                avgClicksPerLink: 0,
                bestLinkId: null,
                bestLinkClicks: 0,
            },
            clicksLast7Days: [],
            topLinks: [],
            recentClicks: [],
            trafficSources: [],
        };
    }
}

export async function getUserRedirectLinkStats(id: string): Promise<UserLinkStats> {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    try {
        await initDb();

        const { rows: ownershipRows } = await sql`
      SELECT id FROM redirects
      WHERE id = ${id} AND user_id = ${userId}
      LIMIT 1
    `;

        if (ownershipRows.length === 0) {
            throw new Error('Not found');
        }

        const { rows: totalsRows } = await sql`
      SELECT
        COUNT(*)::int AS clicks,
        COUNT(*) FILTER (WHERE clicked_at >= NOW() - INTERVAL '24 hours')::int AS last24h,
        COUNT(*) FILTER (WHERE clicked_at >= NOW() - INTERVAL '7 days')::int AS last7d
      FROM redirect_click_events
      WHERE redirect_id = ${id}
    `;

        const { rows: clicksLast7DaysRows } = await sql`
      WITH days AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '6 days',
          CURRENT_DATE,
          INTERVAL '1 day'
        )::date AS day
      )
      SELECT
        TO_CHAR(days.day, 'YYYY-MM-DD') AS date,
        COALESCE(COUNT(e.id), 0)::int AS clicks
      FROM days
      LEFT JOIN redirect_click_events e
        ON e.clicked_at >= days.day
       AND e.clicked_at < days.day + INTERVAL '1 day'
       AND e.redirect_id = ${id}
      GROUP BY days.day
      ORDER BY days.day ASC
    `;

        const { rows: trafficSourcesRows } = await sql`
      SELECT
        COALESCE(source_type, 'unknown') AS source,
        COUNT(*)::int AS clicks
      FROM redirect_click_events
      WHERE redirect_id = ${id}
      GROUP BY COALESCE(source_type, 'unknown')
      ORDER BY clicks DESC
      LIMIT 6
    `;

        const { rows: topReferrersRows } = await sql`
      SELECT
        referrer_host,
        COUNT(*)::int AS clicks
      FROM redirect_click_events
      WHERE redirect_id = ${id}
        AND referrer_host IS NOT NULL
      GROUP BY referrer_host
      ORDER BY clicks DESC
      LIMIT 6
    `;

        const totals = totalsRows[0] as { clicks: number; last24h: number; last7d: number } | undefined;

        return {
            totals: {
                clicks: totals?.clicks ?? 0,
                last24h: totals?.last24h ?? 0,
                last7d: totals?.last7d ?? 0,
            },
            clicksLast7Days: clicksLast7DaysRows as Array<{ date: string; clicks: number }>,
            trafficSources: trafficSourcesRows as Array<{ source: string; clicks: number }>,
            topReferrers: topReferrersRows as Array<{ referrer_host: string; clicks: number }>,
        };
    } catch (error) {
        return {
            totals: {
                clicks: 0,
                last24h: 0,
                last7d: 0,
            },
            clicksLast7Days: [],
            trafficSources: [],
            topReferrers: [],
        };
    }
}

export async function updateUserRedirect(id: string, newUrl: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    try {
        await sql`UPDATE redirects SET url = ${newUrl} WHERE id = ${id} AND user_id = ${userId}`;
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Update redirect error:', error);
        return { error: 'Erreur lors de la mise à jour.' };
    }
}
