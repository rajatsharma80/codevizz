import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '../styles/globals.css';
import '../styles/styles.css'; // Import your custom CSS file

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TarzanAI",
  description: "AI assistant for generating code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
        <script src="https://www.paypal.com/sdk/js?client-id=AXHOAiW-KeruPbDdnJoUq2l3lJ2RdtWscYUTPsrFfwTBVKZevYZNbmX3C0xQz57xOOWjPLz74liEdx23"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
