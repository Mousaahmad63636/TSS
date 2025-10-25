import '../styles/globals.css';
import Head from 'next/head';
import { AuthProvider } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { reportWebVitals } from '../utils/performance';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Register service worker for caching and offline functionality
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return (
    <AuthProvider>
      <Head>
        <title>Brew Caffe - Digital Menu</title>
        <meta name="description" content="Digital menu for Brew Caffe restaurant" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#f97316" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Brew Caffe" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

// Export reportWebVitals for Next.js to use
export { reportWebVitals };
