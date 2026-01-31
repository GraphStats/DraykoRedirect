'use client';

import { useState } from 'react';
import { createUserRedirect, deleteUserRedirect, updateUserRedirect } from '@/lib/user-actions';

interface Redirect {
  id: string;
  url: string;
  clicks: number;
  created_at?: string;
}

export default function DashboardClient({ initialRedirects }: { initialRedirects: Redirect[] }) {
  const [url, setUrl] = useState('');
  const [customId, setCustomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Optimistic UI updates
  const [redirects, setRedirects] = useState<Redirect[]>(initialRedirects);

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
    <div className="dashboard-grid">
      {/* Creation Panel - Fixed width or smaller ratio */}
      <div className="glass-card fade-in create-panel">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Créer un nouveau lien</h2>
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
              Slug personnalisé <span style={{ opacity: 0.5 }}>(optionnel)</span>
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
            {loading ? 'Création...' : 'Créer le lien'}
          </button>
        </form>
        {error && <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
      </div>

      {/* List Panel - Takes remaining space */}
      <div className="glass-card list-panel">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Vos liens actifs</h2>

        {redirects.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🕸️</div>
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

      <style jsx>{`
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
        btn.innerText = 'Copié !';
        setTimeout(() => btn.innerText = original, 2000);
      }
    } catch {
      alert('Erreur copie');
    }
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '16px',
      padding: '1.25rem',
      transition: 'background 0.2s',
    }} className="redirect-row">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>

        {/* Left Info */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <a href={`/redirect/${redirect.id}`} target="_blank" style={{
              color: 'var(--accent)',
              fontWeight: 700,
              fontSize: '1.1rem',
              fontFamily: 'monospace',
              textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              /{redirect.id}
              <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>↗</span>
            </a>
            <span style={{
              fontSize: '0.75rem',
              background: 'rgba(255,255,255,0.1)',
              padding: '0.2rem 0.6rem',
              borderRadius: '99px',
              color: 'var(--text-muted)'
            }}>
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
              <span style={{ opacity: 0.5 }}>→</span>
              {redirect.url}
              <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, padding: '2px' }} title="Modifier">
                ✏️
              </button>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            id={`copy-${redirect.id}`}
            onClick={copyToClipboard}
            className="btn btn-glass"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
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
              fontSize: '0.85rem'
            }}
          >
            Suppr.
          </button>
        </div>
      </div>

      {/* QR Code Expansion */}
      {showQr && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
          <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Scan pour accéder au lien</p>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '1rem', display: 'inline-block' }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/redirect/${redirect.id}`)}`}
              alt="QR Code"
              style={{ display: 'block' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
