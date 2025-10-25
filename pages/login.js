import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Firebase login
    router.push('/admin/firebase-login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-menu-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-menu-accent-500"></div>
    </div>
  );
}
