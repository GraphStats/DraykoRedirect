import { isAdmin } from '@/lib/auth';
import { getRedirects } from '@/lib/actions';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    if (!(await isAdmin())) {
        redirect('/admin');
    }

    const redirects = await getRedirects();

    return (
        <main className="dashboard-container">
            <header className="dashboard-header">
                <div className="container header-flex">
                    <h1>Dashboard Admin</h1>
                    <form action="/api/auth/logout" method="POST">
                        <button type="submit" className="logout-btn">Déconnexion</button>
                    </form>
                </div>
            </header>

            <div className="container content">
                <DashboardClient initialRedirects={redirects} />
            </div>
        </main>
    );
}
