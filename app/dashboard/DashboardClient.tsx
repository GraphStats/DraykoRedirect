'use client';

import { useMemo, useState } from 'react';
import { createUserRedirect, deleteUserRedirect, updateUserRedirect } from '@/lib/user-actions';

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
  const [sortBy, setSortBy] = useState<'recent' | 'clicks'>('recent');

  const [redirects] = useState<Redirect[]>(initialRedirects);

  const sortedRedirects = useMemo(() => {
    const copy = [...redirects];

    if (sortBy === 'clicks') {
      copy.sort((a, b) => b.clicks - a.clicks);
      return copy;
    }

    copy.sort((a, b) => {
      const aTs = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTs = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTs - aTs;
    });
    return copy;
  }, [redirects, sortBy]);

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
      <section className="stats-grid">
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
      </section>

      <section className="analytics-grid">
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
                  <span style={{ color: 'var(--text-muted)' }}>{formatRelativeDate(event.clicked_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Vos liens actifs</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'clicks')}
              className="glass-input"
              style={{ width: 'auto', minWidth: '200px', padding: '0.5rem 0.75rem' }}
            >
              <option value="recent">Trier: plus recents</option>
              <option value="clicks">Trier: plus cliques</option>
            </select>
          </div>

          {sortedRedirects.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>Aucun</div>
              <p>Vous n'avez pas encore de liens.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scroll">
              {sortedRedirects.map((r) => (
                <RedirectItem key={r.id} redirect={r} />
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="glass-card">
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
    </div>
  );
}
