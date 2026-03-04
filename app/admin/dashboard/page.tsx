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
          <div className="dashboard-brand">
            <span className="brand">DraykoRedirect</span>
            <span className="brand-pill">Admin</span>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="btn btn-soft">
              Deconnexion
            </button>
          </form>
        </div>
      </header>

      <div className="content">
        <DashboardClient initialRedirects={redirects} />
      </div>
    </main>
  );
}

