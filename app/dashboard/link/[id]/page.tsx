import { auth } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { notFound, redirect } from 'next/navigation';
import { getUserRedirectById, getUserRedirectLinkStats } from '@/lib/user-actions';

export const dynamic = 'force-dynamic';

function formatDayLabel(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' });
}

function formatSourceLabel(source: string | null) {
  if (!source || source === 'unknown') return 'direct';
  if (source === 'direct') return 'direct';
  if (source === 'internal') return 'interne';
  if (source === 'social') return 'social';
  if (source === 'search') return 'search';
  if (source === 'referral') return 'site externe';
  return source;
}

function buildLinePoints(values: number[], maxValue: number, width: number, height: number, pad: number) {
  const safeMax = Math.max(maxValue, 1);
  const step = values.length > 1 ? (width - pad * 2) / (values.length - 1) : 0;
  return values
    .map((value, index) => {
      const x = pad + step * index;
      const y = height - pad - (value / safeMax) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(' ');
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
  const waitMax = Math.max(...stats.waitLast7Days.flatMap((d) => [d.stayed, d.left]), 1);
  const stayedValues = stats.waitLast7Days.map((d) => d.stayed);
  const leftValues = stats.waitLast7Days.map((d) => d.left);
  const stayedPoints = buildLinePoints(stayedValues, waitMax, 520, 180, 16);
  const leftPoints = buildLinePoints(leftValues, waitMax, 520, 180, 16);
  const totalDecisions = stats.totals.stayedUntilRedirect + stats.totals.leftBeforeRedirect;
  const stayedRatio = totalDecisions > 0 ? Math.round((stats.totals.stayedUntilRedirect / totalDecisions) * 1000) / 10 : 0;

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
            <div className="trend-head">
              <h3>Tendance attente / abandon (7 jours)</h3>
              <span className="ratio-pill">Ratio reste: {stayedRatio}%</span>
            </div>
            <div className="line-chart-wrap">
              <svg viewBox="0 0 520 180" className="line-chart" role="img" aria-label="Graphique attente et abandon">
                <polyline points={stayedPoints} className="line-stayed" />
                <polyline points={leftPoints} className="line-left" />
              </svg>
              <div className="x-axis-labels">
                {stats.waitLast7Days.map((point) => (
                  <span key={point.date}>{formatDayLabel(point.date)}</span>
                ))}
              </div>
            </div>
            <div className="legend-row">
              <span className="legend-item">
                <i className="legend-dot stayed" />
                Restent jusqu'a la redirection
              </span>
              <span className="legend-item">
                <i className="legend-dot left" />
                Partent avant la redirection
              </span>
            </div>
          </article>

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
    </main>
  );
}
