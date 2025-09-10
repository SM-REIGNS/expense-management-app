import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user, logout } = useApp();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="text-xl font-semibold text-gray-800">
            ExpenseApp
          </Link>
          <span className="text-sm text-gray-500">v1.0</span>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-700 hidden sm:inline">{user.email}</span>
              <Link href="/dashboard" className="text-sm text-gray-700 hover:text-gray-900">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-700 hover:text-gray-900">
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
