import { auth } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserRedirects, getUserRedirectStats } from '@/lib/user-actions';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/dashboard/sign-in');
  }

  const [redirects, stats] = await Promise.all([getUserRedirects(), getUserRedirectStats()]);

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <div className="container header-flex">
          <div className="dashboard-brand">
            <span className="brand">DraykoRedirect</span>
            <span className="brand-pill">Espace utilisateur</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div className="content">
        <DashboardClient initialRedirects={redirects} initialStats={stats} />
      </div>
    </main>
  );
}

