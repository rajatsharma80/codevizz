// app/main/features/page.tsx

export default function Features() {
    return (
        <>
            <div className="p-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-20">
                    <h1 className="text-4xl font-bold mb-4">Features</h1>
                </div>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2 text-black">Feature 1: AI Diagram Generator</h2>
                    <p className="text-lg mb-4 text-black">
                        Generate software diagrams from text using AI, supporting different diagram types like flowcharts and sequence diagrams.
                    </p>
                    <h2 className="text-2xl font-bold mb-2 text-black">Feature 2: Code Export</h2>
                    <p className="text-lg mb-4 text-black">
                        Export generated diagrams as code, including HTML, Java code, JUnit tests, and more.
                    </p>
                    <h2 className="text-2xl font-bold mb-2 text-black">Feature 3: Multi-Language Support</h2>
                    <p className="text-lg mb-4 text-black">
                        Supports multiple programming languages for code generation, making it versatile for different use cases.
                    </p>
                    {/* Add more feature sections as needed */}
                </div>
            </div>
        </>
    );
}