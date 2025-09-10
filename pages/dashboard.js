// Dashboard page - protected client-side using context user state

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../context/AppContext';
import ExpenseDashboard from '../components/ExpenseDashboard';

export default function DashboardPage() {
  const { user, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user]);

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <ExpenseDashboard />
    </div>
  );
}
