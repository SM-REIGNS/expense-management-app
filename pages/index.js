import Link from 'next/link';
import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useRouter } from 'next/router';

export default function Home() {
  const { user, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [loading, user]);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto text-center mt-12">
        <h1 className="text-3xl font-bold mb-4">Expense Management (MVP)</h1>
        <p className="text-gray-600 mb-6">
          Track simple expenses — signup and get started in seconds.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="px-5 py-2 bg-indigo-600 text-white rounded"
          >
            Get started
          </Link>
          <Link href="/login" className="px-5 py-2 border rounded">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
