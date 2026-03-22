import { Inter } from "next/font/google";
import "../../styles/globals.css";
import { NextAuthProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Codevizz - AI Diagram Generator",
  description: "Generate software diagrams from text using AI. Create sequence diagrams, flowcharts, and more!",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children; // Remove nested html structure
}