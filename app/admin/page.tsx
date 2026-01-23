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
                setError('Accès refusé. Informations incorrectes.');
            }
        } catch (err) {
            setError('Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h1>Connexion Admin</h1>
                {error && <p className="error">{error}</p>}
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="votre@email.com"
                    />
                </div>
                <div className="input-group">
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>

            <style jsx>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: var(--background);
        }
        .login-form {
          background: var(--card);
          padding: 2.5rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
        }
        h1 {
          font-size: 1.5rem;
          margin-bottom: 2rem;
          text-align: center;
          font-weight: 600;
        }
        .error {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .input-group {
          margin-bottom: 1.5rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--muted-foreground);
        }
        input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--input);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          color: var(--foreground);
          font-size: 1rem;
          outline: none;
        }
        input:focus {
          border-color: var(--accent);
        }
        button {
          width: 100%;
          padding: 0.85rem;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
          margin-top: 1rem;
        }
        button:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
}
