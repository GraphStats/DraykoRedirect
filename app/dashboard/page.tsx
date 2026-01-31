import { auth } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserRedirects } from '@/lib/user-actions';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/dashboard/sign-in');
    }

    const redirects = await getUserRedirects();

    return (
        <main className="dashboard-container">
            <header className="dashboard-header" style={{ padding: '0.8rem 0' }}>
                <div className="container header-flex" style={{ alignItems: 'center' }}>
                    <div className="flex items-center gap-4">
                        <span className="brand" style={{ fontSize: '1.2rem', background: 'linear-gradient(135deg, #fff 30%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            DraykoRedirect
                        </span>
                        <div style={{ height: '24px', width: '1px', background: 'var(--border)' }}></div>
                        <h1 style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-muted)', fontWeight: 500 }}>Dashboard</h1>
                    </div>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </header>

            <div className="container content">
                <DashboardClient initialRedirects={redirects} />
            </div>
        </main>
    );
}
