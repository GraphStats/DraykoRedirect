'use client';

import { useState } from 'react';
import { createUserRedirect, deleteUserRedirect, getUserRedirectLinkStats, updateUserRedirect } from '@/lib/user-actions';

interface Redirect {
  id: string;
  url: string;
  clicks: number;
  created_at?: string;
}

interface DashboardStats {
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

interface LinkStats {
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

function formatDayLabel(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' });
}

function formatRelativeDate(date: string) {
  const ts = new Date(date).getTime();
  const diffMs = Date.now() - ts;
  const min = Math.floor(diffMs / 60000);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);

  if (min < 1) return 'a l\'instant';
  if (min < 60) return `il y a ${min} min`;
  if (hour < 24) return `il y a ${hour} h`;
  return `il y a ${day} j`;
}

function formatSourceLabel(source: string | null) {
  if (!source) return 'unknown';
  if (source === 'direct') return 'direct';
  if (source === 'social') return 'social';
  if (source === 'search') return 'search';
  if (source === 'referral') return 'site externe';
  return source;
}

export default function DashboardClient({
  initialRedirects,
  initialStats,
}: {
  initialRedirects: Redirect[];
  initialStats: DashboardStats;
}) {
  const [url, setUrl] = useState('');
  const [customId, setCustomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const redirects = initialRedirects;

  const maxDailyClicks = Math.max(...initialStats.clicksLast7Days.map((d) => d.clicks), 1);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await createUserRedirect(url, customId || undefined);
      if (res.error) {
        setError(res.error);
      } else {
        setUrl('');
        setCustomId('');
        window.location.reload();
      }
    } catch {
      setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <section className="glass-card section-card">
        <h2 style={{ marginBottom: '1rem' }}>Stats</h2>

        <div className="stats-grid">
          <div className="glass-card stat-card">
            <p className="stat-label">Total clics</p>
            <p className="stat-value">{initialStats.totals.totalClicks}</p>
            <p className="stat-sub">{initialStats.totals.activeLinks} liens actifs</p>
          </div>
          <div className="glass-card stat-card">
            <p className="stat-label">Liens crees</p>
            <p className="stat-value">{initialStats.totals.links}</p>
            <p className="stat-sub">Moyenne: {initialStats.totals.avgClicksPerLink} clic / lien</p>
          </div>
          <div className="glass-card stat-card">
            <p className="stat-label">Meilleur lien</p>
            <p className="stat-value">{initialStats.totals.bestLinkClicks}</p>
            <p className="stat-sub">
              {initialStats.totals.bestLinkId ? `/${initialStats.totals.bestLinkId}` : 'Aucun pour le moment'}
            </p>
          </div>
        </div>

        <div className="analytics-grid" style={{ marginTop: '1rem' }}>
          <div className="glass-card">
            <h3 style={{ marginBottom: '1rem' }}>Clics sur 7 jours</h3>
            {initialStats.clicksLast7Days.length === 0 ? (
              <p style={{ opacity: 0.6 }}>Pas encore de donnees sur les 7 derniers jours.</p>
            ) : (
              <div className="bars-row">
                {initialStats.clicksLast7Days.map((point) => (
                  <div key={point.date} className="bar-col">
                    <div className="bar-wrap">
                      <div
                        className="bar"
                        style={{
                          height: `${Math.max((point.clicks / maxDailyClicks) * 140, point.clicks > 0 ? 12 : 4)}px`,
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
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '1rem' }}>Activite recente</h3>
            {initialStats.recentClicks.length === 0 ? (
              <p style={{ opacity: 0.6 }}>Aucun clic recent.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {initialStats.recentClicks.map((event, index) => (
                  <div
                    key={`${event.redirect_id}-${event.clicked_at}-${index}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      fontSize: '0.9rem',
                      borderBottom: '1px solid var(--glass-border)',
                      paddingBottom: '0.4rem',
                    }}
                  >
                    <span style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>/{event.redirect_id}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {formatSourceLabel(event.source_type)} · {formatRelativeDate(event.clicked_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="glass-card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Top liens</h3>
          {initialStats.topLinks.length === 0 ? (
            <p style={{ opacity: 0.6 }}>Aucune performance a afficher.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {initialStats.topLinks.map((link) => (
                <div key={link.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontFamily: 'monospace', color: 'var(--accent)' }}>/{link.id}</p>
                    <p style={{ margin: 0, opacity: 0.65, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.url}</p>
                  </div>
                  <strong>{link.clicks} clics</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Origine des clics</h3>
          {initialStats.trafficSources.length === 0 ? (
            <p style={{ opacity: 0.6 }}>Pas assez de donnees.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {initialStats.trafficSources.map((row) => (
                <div key={row.source} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.35rem' }}>
                  <span style={{ textTransform: 'capitalize' }}>{formatSourceLabel(row.source)}</span>
                  <strong>{row.clicks}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="glass-card section-card">
        <h2 style={{ marginBottom: '1rem' }}>Liste lien</h2>

        <div className="dashboard-grid">
          <div className="glass-card fade-in create-panel">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Creer un nouveau lien</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="input-label">Destination URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  placeholder="https://super-site.com"
                  className="glass-input"
                />
              </div>
              <div>
                <label className="input-label">
                  Slug personnalise <span style={{ opacity: 0.5 }}>(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value)}
                  placeholder="ex: ma-promo"
                  className="glass-input"
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
                {loading ? 'Creation...' : 'Creer le lien'}
              </button>
            </form>
            {error && <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
          </div>

          <div className="glass-card list-panel">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Vos liens actifs</h2>

            {redirects.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>Aucun</div>
                <p>Vous n'avez pas encore de liens.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scroll">
                {redirects.map((r) => (
                  <RedirectItem key={r.id} redirect={r} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 1rem;
        }

        .stat-card {
          min-height: 120px;
        }

        .section-card {
          padding: 1.25rem;
        }

        .stat-label {
          color: var(--text-muted);
          font-size: 0.85rem;
          margin: 0 0 0.4rem;
        }

        .stat-value {
          font-size: 2rem;
          line-height: 1;
          margin: 0;
          font-weight: 700;
        }

        .stat-sub {
          margin: 0.5rem 0 0;
          opacity: 0.65;
          font-size: 0.9rem;
        }

        .bars-row {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 0.5rem;
          align-items: end;
          min-height: 180px;
        }

        .bar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }

        .bar-wrap {
          height: 140px;
          display: flex;
          align-items: flex-end;
        }

        .bar {
          width: 100%;
          min-width: 22px;
          border-radius: 10px 10px 4px 4px;
          background: linear-gradient(180deg, #22d3ee 0%, #0891b2 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bar-count {
          font-size: 0.8rem;
          opacity: 0.9;
        }

        .bar-label {
          font-size: 0.72rem;
          opacity: 0.6;
          text-transform: uppercase;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 2rem;
          align-items: start;
        }

        .glass-input {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 0.75rem;
          color: white;
          width: 100%;
          transition: all 0.2s;
        }

        .glass-input:focus {
          border-color: var(--primary);
          background: rgba(0, 0, 0, 0.4);
          outline: none;
        }

        .input-label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 1200px) {
          .stats-grid,
          .analytics-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function RedirectItem({ redirect }: { redirect: Redirect }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState(redirect.url);
  const [showQr, setShowQr] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [linkStats, setLinkStats] = useState<LinkStats | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Voulez-vous vraiment supprimer ce lien ?')) return;
    try {
      await deleteUserRedirect(redirect.id);
      window.location.reload();
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserRedirect(redirect.id, editUrl);
      setIsEditing(false);
      window.location.reload();
    } catch {
      alert('Erreur de sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/redirect/${redirect.id}`);
      const btn = document.getElementById(`copy-${redirect.id}`);
      if (btn) {
        const original = btn.innerText;
        btn.innerText = 'Copie !';
        setTimeout(() => (btn.innerText = original), 2000);
      }
    } catch {
      alert('Erreur copie');
    }
  };

  const toggleStats = async () => {
    if (showStats) {
      setShowStats(false);
      return;
    }

    setShowStats(true);
    if (linkStats) return;

    setStatsLoading(true);
    try {
      const data = await getUserRedirectLinkStats(redirect.id);
      setLinkStats(data);
    } catch {
      alert('Erreur chargement stats');
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '1.25rem',
        transition: 'background 0.2s',
      }}
      className="redirect-row"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <a
              href={`/redirect/${redirect.id}`}
              target="_blank"
              style={{
                color: 'var(--accent)',
                fontWeight: 700,
                fontSize: '1.1rem',
                fontFamily: 'monospace',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              /{redirect.id}
              <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>open</span>
            </a>
            <span
              style={{
                fontSize: '0.75rem',
                background: 'rgba(255,255,255,0.1)',
                padding: '0.2rem 0.6rem',
                borderRadius: '99px',
                color: 'var(--text-muted)',
              }}
            >
              {redirect.clicks} clics
            </span>
          </div>

          {isEditing ? (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="glass-input"
                style={{ padding: '0.4rem', fontSize: '0.9rem', width: 'auto', flex: 1 }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleSave} disabled={isSaving} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                  OK
                </button>
                <button onClick={() => setIsEditing(false)} className="btn btn-glass" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                  X
                </button>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ opacity: 0.5 }}>-{'>'}</span>
              {redirect.url}
              <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, padding: '2px' }} title="Modifier">
                Edit
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button id={`copy-${redirect.id}`} onClick={copyToClipboard} className="btn btn-glass" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Copier
          </button>
          <button
            onClick={toggleStats}
            className="btn btn-glass"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            title="Voir les stats individuelles"
          >
            Stats
          </button>
          <button
            onClick={() => setShowQr(!showQr)}
            className="btn btn-glass"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            title="Voir le QR Code"
          >
            QR
          </button>
          <button
            onClick={handleDelete}
            style={{
              background: 'transparent',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '0.5rem 1rem',
              borderRadius: '99px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Suppr.
          </button>
        </div>
      </div>

      {showQr && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
          <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Scan pour acceder au lien</p>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '1rem', display: 'inline-block' }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                `${typeof window !== 'undefined' ? window.location.origin : ''}/redirect/${redirect.id}`,
              )}`}
              alt="QR Code"
              style={{ display: 'block' }}
            />
          </div>
        </div>
      )}

      {showStats && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
          {statsLoading ? (
            <p style={{ opacity: 0.7 }}>Chargement des stats...</p>
          ) : !linkStats ? (
            <p style={{ opacity: 0.7 }}>Aucune stat disponible.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem' }}>Resume du lien</h4>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>Total: <strong>{linkStats.totals.clicks}</strong></p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>24h: <strong>{linkStats.totals.last24h}</strong></p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>7 jours: <strong>{linkStats.totals.last7d}</strong></p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem' }}>Origine</h4>
                {linkStats.trafficSources.length === 0 ? (
                  <p style={{ margin: 0, opacity: 0.7 }}>Aucune source</p>
                ) : (
                  linkStats.trafficSources.map((row) => (
                    <div key={row.source} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                      <span>{formatSourceLabel(row.source)}</span>
                      <strong>{row.clicks}</strong>
                    </div>
                  ))
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem' }}>Referers</h4>
                {linkStats.topReferrers.length === 0 ? (
                  <p style={{ margin: 0, opacity: 0.7 }}>Aucun referer externe</p>
                ) : (
                  linkStats.topReferrers.map((row) => (
                    <div key={row.referrer_host} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem', gap: '0.5rem' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.referrer_host}</span>
                      <strong>{row.clicks}</strong>
                    </div>
                  ))
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem' }}>7 jours</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '0.35rem', alignItems: 'end', minHeight: '80px' }}>
                  {linkStats.clicksLast7Days.map((point) => {
                    const localMax = Math.max(...linkStats.clicksLast7Days.map((d) => d.clicks), 1);
                    return (
                      <div key={point.date} style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            height: `${Math.max((point.clicks / localMax) * 50, point.clicks > 0 ? 8 : 3)}px`,
                            borderRadius: '6px 6px 2px 2px',
                            background: 'linear-gradient(180deg, #34d399 0%, #059669 100%)',
                            marginBottom: '0.2rem',
                          }}
                        />
                        <div style={{ fontSize: '0.65rem', opacity: 0.65 }}>{formatDayLabel(point.date)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
