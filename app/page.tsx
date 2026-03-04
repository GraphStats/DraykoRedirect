'use client';

import Link from 'next/link';

const features = [
  {
    title: 'Simple et rapide',
    text: 'Creez un lien en quelques secondes avec une interface epuree et sans friction.',
  },
  {
    title: 'Liens memorables',
    text: 'Choisissez des slugs clairs pour partager des URLs propres et faciles a retenir.',
  },
  {
    title: 'Suivi utile',
    text: 'Consultez les clics, les sources de trafic et vos liens les plus performants.',
  },
];

const steps = [
  {
    label: '01',
    title: 'Ajoutez votre destination',
    text: 'Collez votre URL complete dans le formulaire.',
  },
  {
    label: '02',
    title: 'Definissez un slug',
    text: 'Utilisez un alias personnalise ou laissez la generation automatique.',
  },
  {
    label: '03',
    title: 'Partagez partout',
    text: 'Diffusez votre nouveau lien court sur vos reseaux, mails et supports.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="landing-nav">
        <div className="container landing-nav-inner">
          <div className="brand" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            DraykoRedirect
          </div>
          <div className="nav-links">
            <Link href="#features">Fonctionnalites</Link>
            <Link href="#how">Parcours</Link>
            <Link href="/dashboard" className="btn btn-primary">
              Ouvrir le dashboard
            </Link>
          </div>
        </div>
      </nav>

      <section className="container hero-section">
        <div className="hero-grid">
          <div className="animate-in delay-1">
            <span className="hero-badge">Service public de redirection URL</span>
            <h1 style={{ marginTop: '0.9rem' }}>
              Raccourcissez vos liens avec
              <br />
              une interface moderne et lisible.
            </h1>
            <p style={{ maxWidth: 600, marginTop: '1rem' }}>
              DraykoRedirect transforme des URLs longues en liens courts, stables et faciles a partager.
              Le tout dans un espace de gestion clair, sans style neon.
            </p>
            <div className="hero-actions">
              <Link href="/dashboard" className="btn btn-primary">
                Commencer
              </Link>
              <Link href="#features" className="btn btn-soft">
                Voir les avantages
              </Link>
            </div>
          </div>

          <div className="glass-card hero-preview animate-in delay-2">
            <div className="preview-top">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="preview-domain">redirect.drayko.xyz</span>
            </div>
            <div className="preview-block">
              <small>URL source</small>
              <p>https://example.com/articles/2026/guide-complet-lancement-printemps</p>
            </div>
            <div className="preview-arrow">Transforme en</div>
            <div className="preview-block result">
              <small>Lien court</small>
              <p>redirect.drayko.xyz/printemps</p>
            </div>
            <div className="preview-stats">
              <div>
                <strong>17k+</strong>
                <span>liens crees</span>
              </div>
              <div>
                <strong>99.99%</strong>
                <span>disponibilite</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container section-space">
        <div className="section-head animate-in delay-2">
          <h2>Une experience plus sobre, pensee pour la production</h2>
          <p>
            Chaque ecran a ete simplifie pour aller droit au but: creer, suivre et administrer vos redirections.
          </p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="glass-card feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how" className="container section-space">
        <div className="glass-card how-card">
          <h2>Un parcours en 3 etapes</h2>
          <div className="steps-grid">
            {steps.map((step) => (
              <div className="step" key={step.label}>
                <span>{step.label}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section-space cta-wrap">
        <div className="glass-card cta-card">
          <h2>Pret a moderniser vos liens ?</h2>
          <p>Connectez-vous pour creer votre premier lien court et commencer le suivi des clics.</p>
          <Link href="/dashboard" className="btn btn-primary">
            Aller au dashboard
          </Link>
        </div>
      </section>

      <footer className="footer">
        <p>(c) 2026 DraykoRedirect.</p>
      </footer>

      <style jsx>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 2rem;
          align-items: center;
        }

        .hero-badge {
          display: inline-block;
          border-radius: 999px;
          background: var(--brand-soft);
          color: var(--brand);
          padding: 0.36rem 0.72rem;
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hero-actions {
          margin-top: 1.8rem;
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .hero-preview {
          padding: 1rem;
          border-radius: 20px;
        }

        .preview-top {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid var(--line);
        }

        .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #cad5e3;
        }

        .preview-domain {
          margin-left: auto;
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .preview-block {
          margin-top: 0.95rem;
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 0.82rem;
          background: #fbfdff;
        }

        .preview-block small {
          display: block;
          margin-bottom: 0.42rem;
          color: var(--text-muted);
          font-size: 0.73rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }

        .preview-block p {
          color: #243244;
          font-size: 0.9rem;
          line-height: 1.5;
          word-break: break-word;
        }

        .preview-arrow {
          text-align: center;
          margin-top: 0.8rem;
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .preview-block.result {
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .preview-block.result p {
          color: #1e40af;
          font-weight: 700;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
        }

        .preview-stats {
          margin-top: 1rem;
          padding-top: 0.9rem;
          border-top: 1px solid var(--line);
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.6rem;
        }

        .preview-stats div {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .preview-stats strong {
          color: #1f2937;
          font-size: 1.15rem;
        }

        .preview-stats span {
          color: var(--text-muted);
          font-size: 0.8rem;
        }

        .section-space {
          padding-bottom: 3.4rem;
        }

        .section-head {
          margin-bottom: 1rem;
          max-width: 800px;
        }

        .section-head p {
          margin-top: 0.7rem;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }

        .feature-card {
          padding: 1.1rem;
        }

        .feature-card h3 {
          margin-bottom: 0.45rem;
          font-size: 1.05rem;
        }

        .how-card {
          padding: 1.2rem;
        }

        .steps-grid {
          margin-top: 1rem;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.8rem;
        }

        .step {
          border: 1px solid var(--line);
          border-radius: 12px;
          background: #fbfdff;
          padding: 0.9rem;
        }

        .step span {
          color: #1d4ed8;
          font-weight: 800;
          font-size: 0.76rem;
        }

        .step h3 {
          font-size: 0.95rem;
          margin: 0.45rem 0;
        }

        .step p {
          font-size: 0.9rem;
        }

        .cta-wrap {
          padding-bottom: 3rem;
        }

        .cta-card {
          text-align: center;
          padding: 2.3rem 1rem;
          background: linear-gradient(180deg, #ffffff 0%, #f7faff 100%);
        }

        .cta-card p {
          margin: 0.7rem auto 1.2rem;
          max-width: 620px;
        }

        @media (max-width: 1080px) {
          .hero-grid,
          .feature-grid,
          .steps-grid {
            grid-template-columns: 1fr;
          }

          .hero-preview {
            max-width: 720px;
          }
        }
      `}</style>
    </main>
  );
}


