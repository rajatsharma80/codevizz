// app/main/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '../../styles/globals.css';
import '../../styles/styles.css'; // Import your custom CSS file
import Script from 'next/script';
import { DefaultSeo } from 'next-seo'; 
import TopMenu from './components/TopMenu'; // Import the TopMenu component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TarzanAI",
  description: "Generate software diagrams like flowcharts and sequence diagrams with the power of AI agent using TarzanAI."
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        
        <Script 
          src="https://www.paypal.com/sdk/js?client-id=AXHOAiW-KeruPbDdnJoUq2l3lJ2RdtWscYUTPsrFfwTBVKZevYZNbmX3C0xQz57xOOWjPLz74liEdx23" 
          strategy="afterInteractive" 
        />
      </head>
      <body className={inter.className}>
        <TopMenu /> {/* Render TopMenu here */}
        <main>{children}</main>
      </body>
    </html>
  );
}
