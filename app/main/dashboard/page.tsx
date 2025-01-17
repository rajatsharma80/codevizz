"use client";

import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="p-4">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-black">Welcome to Your Dashboard</h2>
        <p className="text-lg mb-6 text-black">
          Navigate to the features below:
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/main")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            AI Diagram Generator
          </button>
          <button
            onClick={() => alert("Profile Page Coming Soon!")}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Profile
          </button>
          <button
            onClick={() => alert("Settings Page Coming Soon!")}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
