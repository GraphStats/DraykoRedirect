import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Ambient Background Blobs */}
            <div className="hero-blob blob-1"></div>
            <div className="hero-blob blob-2"></div>

            {/* Navigation */}
            <nav className="landing-nav animate-in">
                <div className="brand text-gradient" style={{ fontSize: '1.5rem' }}>DraykoRedirect</div>
                <div className="nav-links">
                    <Link href="#features">Fonctionnalités</Link>
                    <Link href="#how">Fonctionnement</Link>
                    <Link href="/dashboard" className="btn btn-primary">Se connecter</Link>
                </div>
            </nav>

            {/* Hero Visualization */}
            <section className="container hero-section">
                <div className="hero-content animate-in delay-1">
                    <span style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '99px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: 'var(--primary)',
                        marginBottom: '1.5rem'
                    }}>
                        ✨ Service public de redirection
                    </span>
                    <h1>
                        Des liens courts,<br />
                        un impact <span className="text-gradient">immédiat</span>.
                    </h1>
                    <p style={{ marginBottom: '2.5rem', fontSize: '1.2rem', maxWidth: '500px' }}>
                        Transformez vos URLs longues et complexes en liens élégants, mémorables et suivis.
                        La solution ultime pour vos partages.
                    </p>
                    <div className="hero-btns">
                        <Link href="/dashboard" className="btn btn-primary">
                            Commencer gratuitement
                        </Link>
                        <Link href="#features" className="btn btn-glass">
                            Voir les fonctionnalités
                        </Link>
                    </div>

                    <div style={{ marginTop: '3rem', display: 'flex', gap: '3rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.8rem' }}>10k+</h3>
                            <p className="text-sm">Liens créés</p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.8rem' }}>99.999%</h3>
                            <p className="text-sm">Uptime</p>
                        </div>
                    </div>
                </div>

                <div className="hero-visual animate-in delay-2 animate-float">
                    <div className="glass-card" style={{ padding: '2.5rem', position: 'relative' }}>
                        {/* Decorative floating elements */}
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            background: 'var(--secondary)',
                            padding: '1rem',
                            borderRadius: '16px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                            transform: 'rotate(10deg)'
                        }}>
                            🚀
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }}></div>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></div>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>redirect.drayko.xyz</div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.5rem' }}>Source</label>
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '12px',
                                fontFamily: 'monospace',
                                color: '#ec4899',
                                fontSize: '0.9rem',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                https://monsite.com/promos/super-longue-url-2026/ref=twitter
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                            <div style={{
                                display: 'inline-flex',
                                padding: '0.5rem',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                ↓
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.5rem' }}>Résultat</label>
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(34, 197, 94, 0.1)',
                                borderRadius: '12px',
                                fontFamily: 'monospace',
                                color: '#06b6d4',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <span>redirect.drayko.xyz/hiver</span>
                                <span style={{ fontSize: '1.2rem' }}>✨</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="container" style={{ padding: '6rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }} className="animate-in delay-3">
                    <h2 style={{ marginBottom: '1rem' }}>Pourquoi utiliser <span className="text-gradient">DraykoRedirect</span> ?</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto' }}>
                        Une suite d'outils pensée pour la performance et conçue pour votre image de marque.
                    </p>
                </div>

                <div className="features-grid animate-in delay-3">
                    <div className="glass-card">
                        <div className="feature-icon" style={{ fontSize: '1.5rem' }}>⚡</div>
                        <h3>Redirections Éclairs</h3>
                        <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
                            Infrastructure optimisée en bordure de réseau (Edge) pour une latence minimale. Vos visiteurs n'attendent pas.
                        </p>
                    </div>
                    <div className="glass-card">
                        <div className="feature-icon" style={{ fontSize: '1.5rem' }}>🎨</div>
                        <h3>Slugs Personnalisés</h3>
                        <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
                            Fini les suites de caractères aléatoires. Choisissez un slug qui correspond à votre contenu (ex: /promo, /youtube).
                        </p>
                    </div>
                    <div className="glass-card">
                        <div className="feature-icon" style={{ fontSize: '1.5rem' }}>📊</div>
                        <h3>Suivi en Temps Réel</h3>
                        <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
                            Un tableau de bord précis pour suivre chaque clic. Comprenez votre audience instantanément.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how" className="container" style={{ padding: '4rem 2rem 6rem' }}>
                <div className="glass-card" style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}>
                    <div className="hero-blob" style={{ width: '300px', height: '300px', top: '-50px', right: '-50px', background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}></div>

                    <h2 style={{ marginBottom: '3rem' }}>Simple comme bonjour.</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', position: 'relative', zIndex: 1 }}>
                        <div style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '1.5rem' }}>
                            <span style={{ fontSize: '3rem', fontWeight: '800', opacity: 0.2, lineHeight: 1 }}>01</span>
                            <h3 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>Collez votre lien</h3>
                            <p style={{ fontSize: '0.9rem' }}>Entrez l'URL de destination que vous souhaitez raccourcir.</p>
                        </div>
                        <div style={{ borderLeft: '2px solid var(--secondary)', paddingLeft: '1.5rem' }}>
                            <span style={{ fontSize: '3rem', fontWeight: '800', opacity: 0.2, lineHeight: 1 }}>02</span>
                            <h3 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>Personnalisez</h3>
                            <p style={{ fontSize: '0.9rem' }}>Définissez un alias court ou laissez-nous en générer un pour vous.</p>
                        </div>
                        <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: '1.5rem' }}>
                            <span style={{ fontSize: '3rem', fontWeight: '800', opacity: 0.2, lineHeight: 1 }}>03</span>
                            <h3 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>Partagez</h3>
                            <p style={{ fontSize: '0.9rem' }}>Copiez votre nouveau lien et diffusez-le sur vos réseaux.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="container" style={{ padding: '0 2rem 8rem' }}>
                <div style={{
                    textAlign: 'center',
                    padding: '5rem 2rem',
                    borderRadius: '3rem',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.0) 100%)',
                    border: '1px solid var(--glass-border)'
                }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Prêt à transformer vos liens ?</h2>
                    <p style={{ marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        Rejoignez la nouvelle génération de créateurs qui utilisent DraykoRedirect.
                    </p>
                    <Link href="/dashboard" className="btn btn-primary" style={{ transform: 'scale(1.1)', padding: '1rem 2.5rem' }}>
                        Créer mon premier lien
                    </Link>
                </div>
            </section>

            <footer className="footer">
                <p style={{ opacity: 0.6 }}>© 2026 DraykoRedirect. Redirections claires pour le web public.</p>
            </footer>
        </main>
    );
}
