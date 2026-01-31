'use client';

import { useEffect, useState } from 'react';

export default function RedirectPageClient({ url }: { url: string }) {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown <= 0) {
            window.location.href = url;
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, url]);

    return (
        <main className="redirect-interpage">
            <div className="card">
                <div className="loader"></div>
                <h1>Redirection en cours...</h1>
                <p className="countdown">Tu vas être redirigé dans <span>{countdown}</span> secondes.</p>
                <p className="destination">Cible : {url}</p>
                <div className="footer">
                    <p>Créé par <strong>DraykoRedirect</strong></p>
                </div>
            </div>

            <style jsx>{`
        .redirect-interpage {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: var(--background);
          padding: 2rem;
        }
        .card {
          background: var(--card);
          padding: 3rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
          text-align: center;
          max-width: 500px;
          width: 100%;
        }
        .loader {
          width: 48px;
          height: 48px;
          border: 4px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          display: inline-block;
          animation: rotation 1s linear infinite;
          margin-bottom: 2rem;
        }
        h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--foreground);
        }
        .countdown {
          color: var(--muted-foreground);
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }
        .countdown span {
          color: var(--accent);
          font-weight: 700;
          font-size: 1.5rem;
        }
        .destination {
          font-size: 0.85rem;
          color: var(--muted-foreground);
          margin-top: 2rem;
          padding: 0.75rem;
          background: var(--muted);
          border-radius: 0.5rem;
          word-break: break-all;
          max-height: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .footer {
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .footer p {
          font-size: 0.9rem;
          color: var(--muted-foreground);
        }
        strong {
          color: var(--foreground);
        }

        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </main>
    );
}
