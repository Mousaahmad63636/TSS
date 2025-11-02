import '../styles/globals.css';
import Head from 'next/head';
import { AuthProvider } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { reportWebVitals } from '../utils/performance';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Register service worker for caching and offline functionality
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      // Only register in production or when specifically enabled
      const shouldRegisterSW = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_SW === 'true';
      
      if (shouldRegisterSW) {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
            
            // Check for updates immediately
            registration.update();
            
            // Force update if a new service worker is waiting
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            
            // Listen for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available, reload page
                  window.location.reload();
                }
              });
            });
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      }
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
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Brew Caffe" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

// Export reportWebVitals for Next.js to use
export { reportWebVitals };
