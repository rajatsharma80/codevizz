import "../../styles/globals.css";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TarzanAI - AI Diagram GeneratorzanAI",
  description: "Generate software diagrams from text using AI. Create sequence diagrams, flowcharts, and more!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col bg-gray-100`}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
