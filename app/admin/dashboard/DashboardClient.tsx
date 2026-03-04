'use client';

import { useState } from 'react';
import { createRedirect, deleteRedirect } from '@/lib/actions';

export default function DashboardClient({ initialRedirects }: { initialRedirects: any[] }) {
  const [url, setUrl] = useState('');
  const [customId, setCustomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await createRedirect(url, customId || undefined);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce lien ?')) return;

    try {
      await deleteRedirect(id);
      window.location.reload();
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  const copyToClipboard = async (id: string) => {
    const fullUrl = `${window.location.origin}/redirect/${id}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      alert('Lien copie dans le presse-papier.');
    } catch {
      alert(`Impossible de copier automatiquement. Lien: ${fullUrl}`);
    }
  };

  return (
    <div className="admin-grid">
      <section className="glass-card section-card">
        <h2>Creer un nouveau lien</h2>
        <form onSubmit={handleCreate} className="stack-form">
          <div>
            <label>URL de destination</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label>Slug personnalise (optionnel)</label>
            <input
              type="text"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              placeholder="mon-lien"
            />
            <p className="hint">Laissez vide pour un id automatique.</p>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary full-btn">
            {loading ? 'Creation...' : 'Generer le lien'}
          </button>
        </form>
      </section>

      <section className="glass-card section-card">
        <h2>Liste des liens</h2>
        {initialRedirects.length === 0 ? (
          <p className="empty">Aucun lien cree pour le moment.</p>
        ) : (
          <div className="redirects-list">
            {initialRedirects.map((r) => (
              <article key={r.id} className="row">
                <div className="info">
                  <p className="slug">/redirect/{r.id}</p>
                  <p className="dest" title={r.url}>
                    {r.url}
                  </p>
                </div>
                <div className="row-actions">
                  <span className="clicks">{r.clicks} clics</span>
                  <button onClick={() => copyToClipboard(r.id)} className="btn btn-soft mini" type="button">
                    Copier
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="btn btn-danger mini" type="button">
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .admin-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 1rem;
        }

        h2 {
          font-size: 1.12rem;
        }

        label {
          display: block;
          color: var(--text-muted);
          font-size: 0.84rem;
          margin-bottom: 0.4rem;
        }

        .stack-form {
          margin-top: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.82rem;
        }

        .hint {
          margin-top: 0.26rem;
          font-size: 0.75rem;
        }

        .error {
          color: var(--danger);
          font-size: 0.85rem;
        }

        .full-btn {
          width: 100%;
        }

        .redirects-list {
          margin-top: 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          max-height: 760px;
          overflow-y: auto;
        }

        .row {
          display: flex;
          justify-content: space-between;
          gap: 0.7rem;
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 0.8rem;
          background: #fbfdff;
          flex-wrap: wrap;
        }

        .info {
          min-width: 0;
          flex: 1;
        }

        .slug {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          color: #1e40af;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .dest {
          margin-top: 0.2rem;
          font-size: 0.83rem;
          color: var(--text-muted);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .row-actions {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .mini {
          padding: 0.4rem 0.7rem;
          font-size: 0.78rem;
        }

        .clicks {
          padding: 0.22rem 0.54rem;
          border-radius: 999px;
          background: #eef2ff;
          color: #3730a3;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .empty {
          margin-top: 1rem;
          text-align: center;
          border: 1px dashed var(--line-strong);
          border-radius: 12px;
          background: #fbfdff;
          padding: 2rem 1rem;
        }

        @media (max-width: 980px) {
          .admin-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

