// Custom App to include global styles, context provider and ToastContainer

import '../styles/global.css';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider } from '../context/AppContext';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>Expense Management</title>
          <meta name="description" content="Track your expenses easily" />
          <link rel="icon" href="/expense-icon.ico" />
        </Head>
        <Navbar />
        <main className="py-6">
          <Component {...pageProps} />
        </main>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </AppProvider>
  );
}

export default MyApp;
