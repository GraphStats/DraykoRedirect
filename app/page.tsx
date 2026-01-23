export default function Home() {
    return (
        <main style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'var(--background)'
        }}>
            <div style={{
                textAlign: 'center',
                padding: '2rem',
                maxWidth: '600px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--card)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '700' }}>
                    Projet DraykoRedirect pas public pour le moment
                </h1>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '1.1rem' }}>
                    Ce service de redirection est actuellement personnel et non public.
                </p>
            </div>
        </main>
    )
}
