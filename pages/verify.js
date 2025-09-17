import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function VerifyPage() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/auth/verify?token=${token}`);
        if (res.ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded shadow max-w-md text-center">
        {status === 'loading' && (
          <p className="text-gray-600">Verifying your email...</p>
        )}
        {status === 'success' && (
          <>
            <h1 className="text-2xl font-semibold text-green-600 mb-4">
              ✅ Email Verified
            </h1>
            <p className="text-gray-700 mb-6">
              Your email has been verified successfully. You can now log in.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Go to Login
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-semibold text-red-600 mb-4">
              ❌ Verification Failed
            </h1>
            <p className="text-gray-700 mb-6">
              The verification link is invalid or expired.
            </p>
            <button
              onClick={() => router.push('/signup')}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Go to Signup
            </button>
          </>
        )}
      </div>
    </div>
  );
}
