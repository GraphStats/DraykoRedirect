export default function Home() {
    return (
        <main className="landing">
            <header className="landing-nav reveal">
                <div className="brand">DraykoRedirect</div>
                <nav className="nav-links">
                    <a href="#features">Fonctionnalites</a>
                    <a href="#how">Comment ca marche</a>
                    <a className="nav-cta" href="/dashboard">Se connecter</a>
                </nav>
            </header>

            <section className="hero section">
                <div className="hero-text">
                    <p className="eyebrow reveal">Service public de redirection</p>
                    <h1 className="reveal delay-1">
                        Des liens courts, propres et memorables pour vos partages.
                    </h1>
                    <p className="hero-subtitle reveal delay-2">
                        Creez des URL simples, personnalisez vos slugs, puis suivez les clics
                        depuis un tableau de bord ultra clair.
                    </p>
                    <div className="cta-row reveal delay-3">
                        <a className="btn primary" href="/dashboard">Acceder au dashboard</a>
                        <a className="btn ghost" href="#features">Voir les fonctionnalites</a>
                    </div>
                    <div className="hero-meta reveal delay-4">
                        <div>
                            <span className="meta-label">Slug personnalise</span>
                            <span className="meta-value">redirect.drayko.xyz/redirect/mon-lien</span>
                        </div>
                        <div>
                            <span className="meta-label">Stats immediates</span>
                            <span className="meta-value">clics suivis en temps reel</span>
                        </div>
                    </div>
                </div>

                <div className="hero-card floaty reveal delay-2" aria-hidden="true">
                    <div className="card-top">
                        <span className="pill">Nouveau lien</span>
                        <span className="status-dot"></span>
                    </div>
                    <div className="card-main">
                        <div className="slug-line">/promo-hiver</div>
                        <div className="url-line">https://exemple.com/collection/hiver</div>
                        <div className="progress">
                            <span style={{ width: '72%' }}></span>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="stat">
                            <span className="stat-label">Clics</span>
                            <span className="stat-value">128</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Copie</span>
                            <span className="stat-value">1 clic</span>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="features section">
                <div className="section-title reveal">
                    <h2>Tout ce qu'il faut, rien de trop.</h2>
                    <p>Des outils simples pour des redirections fiables et rapides.</p>
                </div>
                <div className="feature-grid">
                    <div className="feature-card reveal delay-1">
                        <div className="icon">01</div>
                        <h3>Slugs sur mesure</h3>
                        <p>Choisissez un identifiant clair ou laissez le systeme generer un code.</p>
                    </div>
                    <div className="feature-card reveal delay-2">
                        <div className="icon">02</div>
                        <h3>Suivi des clics</h3>
                        <p>Chaque lien compte ses clics pour mesurer l'impact de vos partages.</p>
                    </div>
                    <div className="feature-card reveal delay-3">
                        <div className="icon">03</div>
                        <h3>Gestion rapide</h3>
                        <p>Copiez, supprimez ou modifiez vos liens depuis un dashboard simple.</p>
                    </div>
                </div>
            </section>

            <section id="how" className="steps section">
                <div className="section-title reveal">
                    <h2>Comment ca marche</h2>
                </div>
                <div className="steps-grid">
                    <div className="step reveal delay-1">
                        <span className="step-number">1</span>
                        <h3>Creer</h3>
                        <p>Entrez votre URL et choisissez votre slug si besoin.</p>
                    </div>
                    <div className="step reveal delay-2">
                        <span className="step-number">2</span>
                        <h3>Partager</h3>
                        <p>Copiez le lien genere et diffusez-le partout.</p>
                    </div>
                    <div className="step reveal delay-3">
                        <span className="step-number">3</span>
                        <h3>Suivre</h3>
                        <p>Consultez les clics directement depuis votre espace.</p>
                    </div>
                </div>
            </section>

            <section className="cta section reveal">
                <div>
                    <h2>Pret a lancer vos prochains liens ?</h2>
                    <p>Le service est ouvert. Connectez-vous et creez votre premier lien.</p>
                </div>
                <a className="btn primary" href="/dashboard">Ouvrir le dashboard</a>
            </section>

            <footer className="landing-footer">
                <p>(c) 2026 DraykoRedirect. Redirections claires pour le web public.</p>
            </footer>
        </main>
    )
}
