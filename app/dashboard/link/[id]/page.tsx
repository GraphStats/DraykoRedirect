import { auth } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { notFound, redirect } from 'next/navigation';
import { getUserRedirectById, getUserRedirectLinkStats } from '@/lib/user-actions';

export const dynamic = 'force-dynamic';

function formatDayLabel(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' });
}

function formatSourceLabel(source: string | null) {
  if (!source) return 'unknown';
  if (source === 'direct') return 'direct';
  if (source === 'social') return 'social';
  if (source === 'search') return 'search';
  if (source === 'referral') return 'site externe';
  return source;
}

export default async function LinkStatsPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/dashboard/sign-in');
  }

  const { id } = await params;
  const [link, stats] = await Promise.all([getUserRedirectById(id), getUserRedirectLinkStats(id)]);
  if (!link) {
    notFound();
  }

  const maxDailyClicks = Math.max(...stats.clicksLast7Days.map((d) => d.clicks), 1);

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <div className="container header-flex">
          <div className="dashboard-brand">
            <span className="brand">DraykoRedirect</span>
            <span className="brand-pill">Stats lien</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div className="content">
        <section className="glass-card section-card link-stats-page">
          <div className="top-row">
            <div>
              <h2>Stats du lien /{link.id}</h2>
              <p className="link-url">{link.url}</p>
            </div>
            <a href="/dashboard" className="btn btn-soft">
              Retour dashboard
            </a>
          </div>

          <div className="stats-grid">
            <article className="stat-card">
              <p className="stat-label">Total clics</p>
              <p className="stat-value">{stats.totals.clicks}</p>
            </article>
            <article className="stat-card">
              <p className="stat-label">Dernieres 24h</p>
              <p className="stat-value">{stats.totals.last24h}</p>
            </article>
            <article className="stat-card">
              <p className="stat-label">7 derniers jours</p>
              <p className="stat-value">{stats.totals.last7d}</p>
            </article>
            <article className="stat-card">
              <p className="stat-label">Attendent la redirection</p>
              <p className="stat-value">{stats.totals.stayedUntilRedirect}</p>
            </article>
            <article className="stat-card">
              <p className="stat-label">Partent avant redirection</p>
              <p className="stat-value">{stats.totals.leftBeforeRedirect}</p>
            </article>
          </div>

          <div className="detail-grid">
            <article className="card-block">
              <h3>Origine</h3>
              {stats.trafficSources.length === 0 ? (
                <p>Aucune source</p>
              ) : (
                <div className="list-wrap">
                  {stats.trafficSources.map((row) => (
                    <div key={row.source} className="line-row">
                      <span>{formatSourceLabel(row.source)}</span>
                      <strong>{row.clicks}</strong>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="card-block">
              <h3>Referers</h3>
              {stats.topReferrers.length === 0 ? (
                <p>Aucun referer externe</p>
              ) : (
                <div className="list-wrap">
                  {stats.topReferrers.map((row) => (
                    <div key={row.referrer_host} className="line-row">
                      <span className="ellipsis">{row.referrer_host}</span>
                      <strong>{row.clicks}</strong>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>

          <article className="card-block">
            <h3>Clics sur 7 jours</h3>
            {stats.clicksLast7Days.length === 0 ? (
              <p>Pas encore de donnees sur les 7 derniers jours.</p>
            ) : (
              <div className="bars-row">
                {stats.clicksLast7Days.map((point) => (
                  <div key={point.date} className="bar-col">
                    <div className="bar-wrap">
                      <div
                        className="bar"
                        style={{
                          height: `${Math.max((point.clicks / maxDailyClicks) * 122, point.clicks > 0 ? 10 : 3)}px`,
                        }}
                        title={`${point.clicks} clics`}
                      />
                    </div>
                    <span className="bar-count">{point.clicks}</span>
                    <span className="bar-label">{formatDayLabel(point.date)}</span>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>
      </div>

      <style jsx>{`
        .link-stats-page {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .top-row {
          display: flex;
          justify-content: space-between;
          gap: 0.8rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .link-url {
          margin-top: 0.35rem;
          color: var(--text-muted);
          word-break: break-all;
        }

        .stats-grid,
        .detail-grid {
          display: grid;
          gap: 0.75rem;
        }

        .stats-grid {
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }

        .detail-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .stat-card,
        .card-block {
          border: 1px solid var(--line);
          border-radius: 12px;
          background: #fbfdff;
          padding: 0.9rem;
        }

        .stat-label {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: 0.35rem;
        }

        .stat-value {
          font-size: 1.75rem;
          font-family: 'Manrope', sans-serif;
          color: #0f172a;
        }

        h2 {
          font-size: 1.18rem;
        }

        h3 {
          font-size: 0.95rem;
          margin-bottom: 0.72rem;
        }

        .list-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .line-row {
          border-bottom: 1px solid var(--line);
          padding-bottom: 0.45rem;
          display: flex;
          justify-content: space-between;
          gap: 0.65rem;
          font-size: 0.9rem;
        }

        .ellipsis {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .bars-row {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 0.45rem;
          align-items: end;
          min-height: 150px;
        }

        .bar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.18rem;
        }

        .bar-wrap {
          height: 122px;
          display: flex;
          align-items: end;
        }

        .bar {
          width: 20px;
          border-radius: 8px 8px 3px 3px;
          background: linear-gradient(180deg, #60a5fa 0%, #2563eb 100%);
        }

        .bar-count {
          font-size: 0.74rem;
          color: #1f2937;
        }

        .bar-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        @media (max-width: 1200px) {
          .stats-grid,
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
