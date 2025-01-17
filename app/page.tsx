'use client'; // This marks the file as a Client Component

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import '../styles/globals.css';

export default function LandingPage() {
  const [authSuccess, setAuthSuccess] = useState(false);
  const router = useRouter();

  const handleAuth = () => {
    // Example authentication logic
    const isAuthenticated = true; // Replace with your auth logic
    if (isAuthenticated) {
      setAuthSuccess(true);
      router.push('/main/dashboard'); // Redirect to dashboard
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Landing Page</h1>
        <p className="text-lg mb-6">Please log in to access the dashboard</p>
        <button
          onClick={handleAuth}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Login
        </button>
      </div>
    </div>
  );
}
