import { useState } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../context/AppContext';

export default function SignupForm() {
  const { signup } = useApp();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // validation rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (field) => {
    const errs = { ...errors };

    if (field === 'email') {
      if (!email.trim()) errs.email = 'Email is required';
      else if (!emailRegex.test(email.trim())) errs.email = 'Invalid email format';
      else delete errs.email;
    }

    if (field === 'password') {
      if (!password.trim()) errs.password = 'Password is required';
      else if (password.length < 6) errs.password = 'Password must be at least 6 characters long';
      else delete errs.password;

      // also check confirm password when password changes
      if (confirmPassword && confirmPassword !== password) {
        errs.confirmPassword = 'Passwords do not match';
      } else {
        delete errs.confirmPassword;
      }
    }

    if (field === 'confirmPassword') {
      if (!confirmPassword.trim()) errs.confirmPassword = 'Confirm password is required';
      else if (confirmPassword !== password) errs.confirmPassword = 'Passwords do not match';
      else delete errs.confirmPassword;
    }

    setErrors(errs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // run full validation before submit
    validateField('email');
    validateField('password');
    validateField('confirmPassword');

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const ok = await signup({ email, password, confirmPassword });
    setLoading(false);
    if (ok) router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create an account</h2>

      {/* Email */}
      <label className="block mb-2 text-sm">
        Email
        <input
          type="email"
          className="mt-1 block w-full border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validateField('email')}
        />
        {errors.email && <span className="text-red-600 text-sm">{errors.email}</span>}
      </label>

      {/* Password */}
      <label className="block mb-2 text-sm">
        Password
        <input
          type="password"
          className="mt-1 block w-full border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => validateField('password')}
        />
        {errors.password && <span className="text-red-600 text-sm">{errors.password}</span>}
      </label>

      {/* Confirm Password */}
      <label className="block mb-4 text-sm">
        Confirm Password
        <input
          type="password"
          className="mt-1 block w-full border rounded px-3 py-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => validateField('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className="text-red-600 text-sm">{errors.confirmPassword}</span>
        )}
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        {loading ? 'Creating...' : 'Sign up'}
      </button>
    </form>
  );
}
