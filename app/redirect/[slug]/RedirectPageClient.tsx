'use client';

import { useEffect, useState } from 'react';

type RedirectEventStatus = 'completed' | 'abandoned';

export default function RedirectPageClient({ url, eventToken }: { url: string; eventToken: string }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let finalEventSent = false;
    let redirectStarted = false;

    const sendStatus = (status: RedirectEventStatus) => {
      if (!eventToken) return;
      if (finalEventSent) return;
      finalEventSent = true;

      const payload = JSON.stringify({ eventToken, status });
      const blob = new Blob([payload], { type: 'application/json' });
      const sent = navigator.sendBeacon('/api/redirect-events', blob);
      if (!sent) {
        fetch('/api/redirect-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    };

    const onPageHide = () => {
      if (!redirectStarted) {
        sendStatus('abandoned');
      }
    };

    window.addEventListener('pagehide', onPageHide);

    if (countdown <= 0) {
      redirectStarted = true;
      sendStatus('completed');
      const timer = setTimeout(() => {
        window.location.href = url;
      }, 40);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('pagehide', onPageHide);
      };
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [countdown, eventToken, url]);

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

