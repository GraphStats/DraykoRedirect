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
        // Ideally we'd fetch the new list or add it optimistically, 
        // but reloading is safer for now to get server-generated fields
        window.location.reload();
      }
    } catch {
      setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '2rem' }}>
      <div className="glass-card fade-in">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Créer un nouveau lien</h2>
        <form onSubmit={handleCreate} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', alignItems: 'end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Destination URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://super-site.com"
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Slug personnalisé <span style={{ opacity: 0.5 }}>(optionnel)</span>
            </label>
            <input
              type="text"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              placeholder="ex: ma-promo"
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', height: '46px' }}>
              {loading ? 'Création...' : 'Créer le lien'}
            </button>
          </div>
        </form>
        {error && <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem' }}>{error}</p>}
      </div>

      <div className="glass-card">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Vos liens actifs</h2>

        {redirects.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.6 }}>
            <p>Vous n'avez pas encore de liens.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {redirects.map((r) => (
              <RedirectItem key={r.id} redirect={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RedirectItem({ redirect }: { redirect: Redirect }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState(redirect.url);
  const [showQr, setShowQr] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}/${redirect.id}` : `.../${redirect.id}`;
  const displayUrl = `drayko.xyz/${redirect.id}`; // Hardcoded brand URL for aesthetics if preferred, or use dynamic

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
      // Could add toast here
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
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                style={{ padding: '0.4rem', fontSize: '0.9rem', width: '100%' }}
              />
              <button onClick={handleSave} disabled={isSaving} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                OK
              </button>
              <button onClick={() => setIsEditing(false)} className="btn btn-glass" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                X
              </button>
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
