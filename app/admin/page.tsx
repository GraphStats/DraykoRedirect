'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        setError('Acces refuse. Informations incorrectes.');
      }
    } catch {
      setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="glass-card login-form">
        <div className="brand-line">
          <span className="brand">DraykoRedirect</span>
          <span className="brand-pill">Admin</span>
        </div>

        <h1>Connexion administrateur</h1>

        {error && <p className="error">{error}</p>}

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@example.com"
          />
        </div>

        <div className="input-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary full-btn">
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <style jsx>{`
        .login-container {
          display: grid;
          place-items: center;
          padding: 1.2rem;
        }

        .login-form {
          width: 100%;
          max-width: 420px;
          padding: 1.25rem;
        }

        .brand-line {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.95rem;
        }

        h1 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }

        .input-group {
          margin-bottom: 0.8rem;
        }

        label {
          display: block;
          font-size: 0.84rem;
          color: var(--text-muted);
          margin-bottom: 0.4rem;
        }

        .error {
          border: 1px solid rgba(220, 38, 38, 0.2);
          background: #fef2f2;
          color: var(--danger);
          border-radius: 10px;
          padding: 0.55rem 0.7rem;
          margin-bottom: 0.8rem;
          font-size: 0.84rem;
        }

        .full-btn {
          margin-top: 0.2rem;
          width: 100%;
        }
      `}</style>
    </div>
  );
}

