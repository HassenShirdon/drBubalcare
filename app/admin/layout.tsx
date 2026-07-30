import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminShell } from './admin-shell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  const name = session.user.name ?? null;
  const email = session.user.email ?? null;

  return (
    <AdminShell name={name} email={email}>
      {children}
    </AdminShell>
  );
}
