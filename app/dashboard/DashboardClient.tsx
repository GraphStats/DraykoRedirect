'use client';

import { useState } from 'react';
import { createUserRedirect, deleteUserRedirect } from '@/lib/user-actions';

export default function DashboardClient({ initialRedirects }: { initialRedirects: any[] }) {
    const [url, setUrl] = useState('');
    const [customId, setCustomId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [redirects] = useState(initialRedirects);

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

    const handleDelete = async (id: string) => {
        if (!confirm('Voulez-vous vraiment supprimer ce lien ?')) return;

        try {
            await deleteUserRedirect(id);
            window.location.reload();
        } catch {
            alert('Erreur lors de la suppression.');
        }
    };

    const copyToClipboard = async (id: string) => {
        const fullUrl = `${window.location.origin}/redirect/${id}`;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(fullUrl);
                alert('Lien copie dans le presse-papier !');
            } else {
                throw new Error('Clipboard API not available');
            }
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = fullUrl;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                alert('Lien copie !');
            } catch {
                alert('Impossible de copier automatiquement. Voici le lien: ' + fullUrl);
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className="dashboard-grid">
            <section className="create-section">
                <div className="card">
                    <h2>Creer un nouveau lien</h2>
                    <form onSubmit={handleCreate}>
                        <div className="input-group">
                            <label>URL de destination</label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                                placeholder="https://google.com..."
                            />
                        </div>
                        <div className="input-group">
                            <label>Slug personnalise (optionnel)</label>
                            <input
                                type="text"
                                value={customId}
                                onChange={(e) => setCustomId(e.target.value)}
                                placeholder="mon-lien-perso"
                            />
                            <p className="hint">Laisse vide pour un code aleatoire</p>
                        </div>
                        {error && <p className="error">{error}</p>}
                        <button type="submit" disabled={loading}>
                            {loading ? 'Creation...' : 'Generer le lien'}
                        </button>
                    </form>
                </div>
            </section>

            <section className="list-section">
                <div className="card">
                    <h2>Vos liens</h2>
                    <div className="redirects-list">
                        {redirects.length === 0 ? (
                            <p className="empty">Aucun lien cree pour le moment.</p>
                        ) : (
                            redirects.map((r) => (
                                <div key={r.id} className="redirect-item">
                                    <div className="item-info">
                                        <div className="id-line">
                                            <span className="slug">/redirect/{r.id}</span>
                                            <span className="clicks">{r.clicks} clics</span>
                                        </div>
                                        <div className="dest-line" title={r.url}>{r.url}</div>
                                    </div>
                                    <div className="item-actions">
                                        <button onClick={() => copyToClipboard(r.id)} className="copy-btn">Copier</button>
                                        <button onClick={() => handleDelete(r.id)} className="delete-btn">Supprimer</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            <style jsx>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 2rem;
        }
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
        .card {
          background: var(--card);
          padding: 2rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02);
          height: fit-content;
        }
        h2 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }
        .input-group {
          margin-bottom: 1.25rem;
        }
        label {
          display: block;
          font-size: 0.85rem;
          color: var(--muted-foreground);
          margin-bottom: 0.5rem;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          background: var(--input);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          color: var(--foreground);
        }
        .hint {
          font-size: 0.75rem;
          color: var(--muted-foreground);
          margin-top: 0.25rem;
        }
        .error {
          color: #ef4444;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }
        button[type="submit"] {
          width: 100%;
          padding: 0.75rem;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        button[type="submit"]:hover {
          filter: brightness(1.05);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }
        .redirects-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .redirect-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
        }
        .item-info {
           overflow: hidden;
           margin-right: 1rem;
        }
        .slug {
          font-weight: 700;
          color: var(--accent);
          font-family: monospace;
          font-size: 1.1rem;
        }
        .clicks {
          font-size: 0.75rem;
          color: var(--muted-foreground);
          margin-left: 0.75rem;
          background: var(--muted);
          padding: 0.1rem 0.4rem;
          border-radius: 1rem;
        }
        .dest-line {
          font-size: 0.85rem;
          color: var(--muted-foreground);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 0.25rem;
        }
        .item-actions {
          display: flex;
          gap: 0.5rem;
        }
        .copy-btn, .delete-btn {
          padding: 0.4rem 0.8rem;
          border-radius: 0.4rem;
          font-size: 0.85rem;
          cursor: pointer;
          font-weight: 500;
        }
        .copy-btn {
          background: var(--muted);
          border: 1px solid var(--border);
          color: var(--foreground);
        }
        .delete-btn {
          background: transparent;
          border: 1px solid #ef444433;
          color: #ef4444;
        }
        .delete-btn:hover {
          background: #ef4444;
          color: white;
        }
        .empty {
          text-align: center;
          color: var(--muted-foreground);
          padding: 2rem;
        }
      `}</style>
        </div>
    );
}
