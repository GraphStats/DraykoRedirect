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
      <section className="glass-card redirect-card">
        <div className="loader" />
        <h1>Redirection en cours</h1>
        <p>
          Vous serez redirige dans <strong>{countdown}</strong> seconde{countdown > 1 ? 's' : ''}.
        </p>
        <div className="target-box">{url}</div>
        <p className="footer-note">
          Propulse par <strong>DraykoRedirect</strong>
        </p>
      </section>

      <style jsx>{`
        .redirect-interpage {
          display: grid;
          place-items: center;
          padding: 1rem;
        }

        .redirect-card {
          width: 100%;
          max-width: 520px;
          padding: 1.4rem;
          text-align: center;
        }

        .loader {
          width: 42px;
          height: 42px;
          border: 3px solid #dbe4ef;
          border-top-color: var(--brand);
          border-radius: 50%;
          margin: 0 auto 0.9rem;
          animation: spin 0.9s linear infinite;
        }

        h1 {
          font-size: 1.2rem;
          margin-bottom: 0.45rem;
        }

        p {
          font-size: 0.95rem;
        }

        strong {
          color: #1e40af;
        }

        .target-box {
          margin-top: 0.9rem;
          border: 1px solid var(--line);
          border-radius: 10px;
          background: #fbfdff;
          padding: 0.65rem;
          color: var(--text-muted);
          font-size: 0.82rem;
          word-break: break-all;
        }

        .footer-note {
          margin-top: 1rem;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

