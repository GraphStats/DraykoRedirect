import { auth } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserRedirects } from '@/lib/user-actions';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const { userId } = auth();

    if (!userId) {
        redirect('/dashboard/sign-in');
    }

    const redirects = await getUserRedirects();

    return (
        <main className="dashboard-container">
            <header className="dashboard-header">
                <div className="container header-flex">
                    <div>
                        <h1>Dashboard</h1>
                        <p style={{ color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                            Gere tes liens publics et leurs clics.
                        </p>
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
