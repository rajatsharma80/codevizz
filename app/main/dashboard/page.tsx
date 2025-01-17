'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call the `signOut` function and redirect to the home page
      await signOut({ callbackUrl: '/' });

      // Clear cookies manually by setting them to an empty value
      document.cookie =
        'next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

      document.cookie =
        '__Secure-next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg">Welcome to your personalized dashboard</p>
      </div>
      <div className="p-6">
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => router.push('/main')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            AI Diagram Generator
          </button>
          <button
            onClick={() => alert('Profile Page Coming Soon!')}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Profile
          </button>
          <button
            onClick={() => alert('Settings Page Coming Soon!')}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
