import { getValidatedSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/share/DashboardClient';

export default async function SharePage() {
  const session = await getValidatedSession();
  if (!session?.user?.id) {
    redirect('/');
  }

  return <DashboardClient />;
}
