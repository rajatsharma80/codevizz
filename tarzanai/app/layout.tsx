import { Inter } from "next/font/google";
import "../styles/globals.css";
import SessionWrapper from "./components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CodeViz",
  description: "Generate software diagrams like flowcharts and sequence diagrams with the power of AI agent using CodeViz."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}