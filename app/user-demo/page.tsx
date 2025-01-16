// app/features/page.tsx
"use client"; // Add this line at the top

import { useState } from 'react';

export default function Features() {
    const [isVideoVisible, setIsVideoVisible] = useState(false);

    return (
        <>
            <div className="p-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-20">
                    <h1 className="text-4xl font-bold mb-4">User Demo</h1>
                </div>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2 text-black">AI Sequence Diagram Generator</h2>
                    <p className="text-lg mb-4 text-black">
                        Generate sequence diagrams from text using AI.
                    </p>
                    <div className="mt-6 flex justify-right">
                        {!isVideoVisible ? (
                            <img
                                src="https://img.youtube.com/vi/aDBfQT-1C1Q/maxresdefault.jpg" // YouTube thumbnail URL
                                alt="Watch Demo"
                                className="w-96 cursor-pointer"
                                onClick={() => setIsVideoVisible(true)} // Show video on click
                            />
                        ) : (
                            <iframe
                                width="560"
                                height="315"
                                src="https://www.youtube.com/embed/aDBfQT-1C1Q"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-lg shadow-lg"
                            ></iframe>
                        )}
                    </div>
                    <div className="mt-8"></div>
                    <h2 className="text-2xl font-bold mb-2 text-black">Diagram Export</h2>
                    <p className="text-lg mb-4 text-black">
                        Export generated diagrams to a pdf file.
                    </p>
                    {/* Add more feature sections as needed */}
                </div>
            </div>
        </>
    );
}
