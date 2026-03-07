'use client';

import { useState } from 'react';
import {
  createUserRedirect,
  deleteUserRedirect,
  updateUserRedirect,
} from '@/lib/user-actions';

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
  const [activeView, setActiveView] = useState<'stats' | 'links'>('links');
  const [url, setUrl] = useState('');
  const [customId, setCustomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="dash-layout">
      <div className="view-switch-wrap">
        <div className="view-switch" role="tablist" aria-label="Selection de la vue dashboard">
          <button
            type="button"
            className={`view-pill ${activeView === 'links' ? 'active' : ''}`}
            onClick={() => setActiveView('links')}
            role="tab"
            aria-selected={activeView === 'links'}
          >
            Liens
          </button>
          <button
            type="button"
            className={`view-pill ${activeView === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveView('stats')}
            role="tab"
            aria-selected={activeView === 'stats'}
          >
            Stats Global
          </button>
        </div>
      </div>

      {activeView === 'stats' ? (
        <section className="glass-card section-card">
        <h2>Apercu global</h2>

        <div className="stats-grid">
          <article className="stat-card">
            <p className="stat-label">Total clics</p>
            <p className="stat-value">{initialStats.totals.totalClicks}</p>
            <p className="stat-sub">{initialStats.totals.activeLinks} liens actifs</p>
          </article>
          <article className="stat-card">
            <p className="stat-label">Liens crees</p>
            <p className="stat-value">{initialStats.totals.links}</p>
            <p className="stat-sub">Moyenne: {initialStats.totals.avgClicksPerLink} clic / lien</p>
          </article>
          <article className="stat-card">
            <p className="stat-label">Meilleur lien</p>
            <p className="stat-value">{initialStats.totals.bestLinkClicks}</p>
            <p className="stat-sub">
              {initialStats.totals.bestLinkId ? `/${initialStats.totals.bestLinkId}` : 'Aucun pour le moment'}
            </p>
          </article>
        </div>

        <div className="analytics-grid">
          <article className="card-block">
            <h3>Clics sur 7 jours</h3>
            {initialStats.clicksLast7Days.length === 0 ? (
              <p>Pas encore de donnees sur les 7 derniers jours.</p>
            ) : (
              <div className="bars-row">
                {initialStats.clicksLast7Days.map((point) => (
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

          <article className="card-block">
            <h3>Activite recente</h3>
            {initialStats.recentClicks.length === 0 ? (
              <p>Aucun clic recent.</p>
            ) : (
              <div className="activity-list">
                {initialStats.recentClicks.map((event, index) => (
                  <div key={`${event.redirect_id}-${event.clicked_at}-${index}`} className="activity-item">
                    <span className="mono-link">/{event.redirect_id}</span>
                    <span>
                      {formatSourceLabel(event.source_type)} · {formatRelativeDate(event.clicked_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>

        <div className="detail-grid">
          <article className="card-block">
            <h3>Top liens</h3>
            {initialStats.topLinks.length === 0 ? (
              <p>Aucune performance a afficher.</p>
            ) : (
              <div className="list-wrap">
                {initialStats.topLinks.map((link) => (
                  <div key={link.id} className="line-row">
                    <div>
                      <p className="mono-link" style={{ marginBottom: '0.18rem' }}>
                        /{link.id}
                      </p>
                      <p className="url-sub">{link.url}</p>
                    </div>
                    <strong>{link.clicks} clics</strong>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="card-block">
            <h3>Origine des clics</h3>
            {initialStats.trafficSources.length === 0 ? (
              <p>Pas assez de donnees.</p>
            ) : (
              <div className="list-wrap">
                {initialStats.trafficSources.map((row) => (
                  <div key={row.source} className="line-row">
                    <span>{formatSourceLabel(row.source)}</span>
                    <strong>{row.clicks}</strong>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>
        </section>
      ) : (
        <section className="dashboard-grid">
        <article className="glass-card section-card create-panel">
          <h2>Creer un nouveau lien</h2>
          <form onSubmit={handleCreate} className="form-stack">
            <div>
              <label className="input-label">Destination URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="input-label">Slug personnalise (optionnel)</label>
              <input
                type="text"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                placeholder="ex: ma-campagne"
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary form-btn">
              {loading ? 'Creation...' : 'Creer le lien'}
            </button>
          </form>
          {error && <p className="error-msg">{error}</p>}
        </article>

        <article className="glass-card section-card">
          <h2>Vos liens actifs</h2>
          {initialRedirects.length === 0 ? (
            <div className="empty-state">
              <p>Aucun lien cree pour le moment.</p>
            </div>
          ) : (
            <div className="redirect-list">
              {initialRedirects.map((redirect) => (
                <RedirectItem key={redirect.id} redirect={redirect} />
              ))}
            </div>
          )}
        </article>
        </section>
      )}

      <style jsx>{`
        .dash-layout {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .view-switch-wrap {
          display: flex;
          justify-content: center;
        }

        .view-switch {
          background: #eef3fb;
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 0.24rem;
          display: inline-flex;
          gap: 0.3rem;
          width: fit-content;
          max-width: 100%;
        }

        .view-pill {
          border: 0;
          background: transparent;
          color: #35506c;
          font-weight: 700;
          border-radius: 999px;
          padding: 0.46rem 1rem;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
          white-space: nowrap;
        }

        .view-pill.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
        }

        .stats-grid,
        .analytics-grid,
        .detail-grid {
          margin-top: 0.9rem;
          display: grid;
          gap: 0.75rem;
        }

        .stats-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .analytics-grid,
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

        .stat-sub {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-top: 0.45rem;
        }

        h2 {
          font-size: 1.18rem;
        }

        h3 {
          font-size: 0.95rem;
          margin-bottom: 0.72rem;
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

        .activity-list,
        .list-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .activity-item,
        .line-row {
          border-bottom: 1px solid var(--line);
          padding-bottom: 0.45rem;
          display: flex;
          justify-content: space-between;
          gap: 0.65rem;
          font-size: 0.9rem;
        }

        .mono-link {
          color: #1e40af;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-weight: 700;
        }

        .url-sub {
          color: var(--text-muted);
          font-size: 0.82rem;
          max-width: 420px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 1rem;
          align-items: start;
        }

        .create-panel {
          position: sticky;
          top: 92px;
        }

        .form-stack {
          margin-top: 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.88rem;
        }

        .input-label {
          display: block;
          font-size: 0.84rem;
          color: var(--text-muted);
          margin-bottom: 0.44rem;
        }

        .form-btn {
          margin-top: 0.12rem;
          width: 100%;
        }

        .error-msg {
          color: var(--danger);
          margin-top: 0.8rem;
          font-size: 0.86rem;
        }

        .empty-state {
          border: 1px dashed var(--line-strong);
          border-radius: 12px;
          background: #fbfdff;
          min-height: 180px;
          display: grid;
          place-items: center;
          margin-top: 0.8rem;
          text-align: center;
          padding: 1rem;
        }

        .redirect-list {
          margin-top: 0.8rem;
          max-height: 740px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        @media (max-width: 1200px) {
          .stats-grid,
          .analytics-grid,
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 960px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .create-panel {
            position: static;
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
        btn.innerText = 'Copie';
        setTimeout(() => (btn.innerText = original), 1500);
      }
    } catch {
      alert('Erreur copie');
    }
  };

  return (
    <div className="link-card">
      <div className="top-row">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="title-row">
            <a href={`/redirect/${redirect.id}`} target="_blank" className="slug-link" rel="noreferrer">
              /{redirect.id}
            </a>
            <span className="click-pill">{redirect.clicks} clics</span>
          </div>

          {isEditing ? (
            <div className="edit-row">
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                style={{ flex: 1 }}
              />
              <button onClick={handleSave} disabled={isSaving} className="btn btn-primary mini-btn" type="button">
                OK
              </button>
              <button onClick={() => setIsEditing(false)} className="btn btn-soft mini-btn" type="button">
                Annuler
              </button>
            </div>
          ) : (
            <div className="url-line">
              <span>{redirect.url}</span>
            </div>
          )}
        </div>

        <div className="action-row">
          <button onClick={() => setIsEditing(true)} className="btn btn-soft mini-btn" type="button">
            Modifier
          </button>
          <button id={`copy-${redirect.id}`} onClick={copyToClipboard} className="btn btn-soft mini-btn" type="button">
            Copier
          </button>
          <a href={`/dashboard/link/${redirect.id}`} className="btn btn-soft mini-btn">
            Stats
          </a>
          <button onClick={() => setShowQr((prev) => !prev)} className="btn btn-soft mini-btn" type="button">
            QR
          </button>
          <button onClick={handleDelete} className="btn btn-danger mini-btn" type="button">
            Supprimer
          </button>
        </div>
      </div>

      {showQr && (
        <div className="expand-block">
          <p className="expand-label">QR du lien</p>
          <div className="qr-wrap">
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
      <style jsx>{`
        .link-card {
          border: 1px solid var(--line);
          border-radius: 12px;
          background: #fbfdff;
          padding: 0.88rem;
        }

        .top-row {
          display: flex;
          justify-content: space-between;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .slug-link {
          color: #1e40af;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-weight: 700;
        }

        .click-pill {
          border-radius: 999px;
          background: #edf2f7;
          color: #405266;
          padding: 0.2rem 0.52rem;
          font-size: 0.76rem;
          font-weight: 600;
        }

        .url-line {
          margin-top: 0.45rem;
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
        }

        .url-line span {
          color: var(--text-muted);
          font-size: 0.9rem;
          word-break: break-all;
          flex: 1;
        }

        .edit-row {
          margin-top: 0.45rem;
          display: flex;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        .action-row {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .mini-btn {
          padding: 0.42rem 0.75rem;
          font-size: 0.78rem;
        }

        .expand-block {
          margin-top: 0.8rem;
          border-top: 1px solid var(--line);
          padding-top: 0.8rem;
        }

        .expand-label {
          margin-bottom: 0.55rem;
          font-size: 0.82rem;
        }

        .qr-wrap {
          display: inline-block;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 0.5rem;
        }

      `}</style>
    </div>
  );
}

