// Custom App to include global styles, context provider and ToastContainer

import '../styles/global.css';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider } from '../context/AppContext';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="py-6">
          <Component {...pageProps} />
        </main>
        <ToastContainer position="top-right" />
      </div>
    </AppProvider>
  );
}

export default MyApp;
