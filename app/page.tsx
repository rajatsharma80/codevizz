'use client';

import '../styles/globals.css';
import { useRouter } from 'next/navigation';



export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white relative">
      {/* Top-right corner buttons */}
      <div className="absolute top-4 right-4 flex space-x-4">
        <button
          onClick={() => router.push('./signin')}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Sign Up
        </button>
        <button
          onClick={() => router.push('./signin')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
      </div>

      {/* Centered Welcome Text */}
      <h1 className="text-4xl font-bold">Welcome</h1>
    </div>
  );
}
