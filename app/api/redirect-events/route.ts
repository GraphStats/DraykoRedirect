import { NextRequest, NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

type RedirectEventStatus = 'completed' | 'abandoned';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventToken = typeof body?.eventToken === 'string' ? body.eventToken : '';
    const status = body?.status as RedirectEventStatus;

    if (!eventToken || (status !== 'completed' && status !== 'abandoned')) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    await initDb();
    await sql`
      UPDATE redirect_wait_events
      SET status = ${status}, updated_at = NOW()
      WHERE event_token = ${eventToken} AND status = 'pending'
    `;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
