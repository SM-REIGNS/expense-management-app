// Global state using React Context for auth + expenses
// Provides: user, expenses, signup, login, logout, CRUD expense methods
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Router from 'next/router';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null); // { id, email }
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // helper to include credentials for cookie-based auth
  const baseFetch = async (url, opts = {}) => {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...opts
    });
    return res;
  };

  // Auth actions
  const signup = async ({ email, password, confirmPassword }) => {
    try {
      const res = await baseFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, confirmPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Signup failed');
      setUser(data.user);
      toast.success(data?.message || 'Account Created', { autoClose: 3000 });
      return true;
    } catch (err) {
      toast.error(err.message || 'Signup error', { autoClose: 5000 });
      return false;
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await baseFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Login failed');
      setUser(data.user);
      toast.success('Logged in', { autoClose: 1000 });
      return true;
    } catch (err) {
      toast.error(err.message || 'Login error', { autoClose: 5000 });
      return false;
    }
  };

  const logout = async () => {
    try {
      const res = await baseFetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d?.message || 'Logout failed');
      }
      setUser(null);
      setExpenses([]);
      toast.success('Logged out', { autoClose: 1000 });
      return true;
    } catch (err) {
      toast.error(err.message || 'Logout error', { autoClose: 5000 });
      return false;
    }
  };

  // Expense actions
  const fetchExpenses = async () => {
    try {
      const res = await baseFetch('/api/expenses');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch expenses');
      setExpenses(data.expenses || []);
      return true;
    } catch (err) {
      // don't spam user on initial fail; only toast when authenticated
      if (user) toast.error(err.message || 'Could not load expenses', { autoClose: 5000 });
      return false;
    }
  };

  const createExpense = async ({ title, amount, category, date }) => {
    try {
      const res = await baseFetch('/api/expenses', {
        method: 'POST',
        body: JSON.stringify({ title, amount, category, date })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to create expense');
      setExpenses((prev) => [data.expense, ...prev]);
      toast.success('Expense added', { autoClose: 1000 });
      return true;
    } catch (err) {
      toast.error(err.message || 'Create expense error', { autoClose: 5000 });
      return false;
    }
  };

  const updateExpense = async (id, { title, amount, category, date }) => {
    try {
      const res = await baseFetch(`/api/expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, amount, category, date })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to update expense');
      setExpenses((prev) => prev.map((e) => (e._id === id ? data.expense : e)));
      toast.success('Expense updated', { autoClose: 1000 });
      return true;
    } catch (err) {
      toast.error(err.message || 'Update expense error', { autoClose: 5000 });
      return false;
    }
  };

  const deleteExpense = async (id) => {
    try {
      const res = await baseFetch(`/api/expenses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to delete expense');
      setExpenses((prev) => prev.filter((e) => e._id !== id));
      toast.success('Expense deleted', { autoClose: 1000 });
      return true;
    } catch (err) {
      toast.error(err.message || 'Delete expense error', { autoClose: 5000 });
      return false;
    }
  };

  // On mount, attempt to fetch current user (cookie-based auth)
  useEffect(() => {
    (async () => {
      try {
        const res = await baseFetch('/api/auth/me');
        if (res.ok) {
          const d = await res.json();
          setUser(d.user);
          // fetch expenses after we know the user
          await fetchExpenses();
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      expenses,
      loading,
      signup,
      login,
      logout,
      fetchExpenses,
      createExpense,
      updateExpense,
      deleteExpense
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
