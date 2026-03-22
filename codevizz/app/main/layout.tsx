import { Inter } from "next/font/google";
// import Script from "next/script"; // PAYMENT DISABLED — uncomment to restore PayPal
import "../../styles/globals.css";
import "../../styles/styles.css";
import TopMenu from "./components/TopMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Codevizz",
  description: "Generate software diagrams like flowcharts and sequence diagrams with the power of AI agent using Codevizz."
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* PAYMENT DISABLED — uncomment to restore PayPal SDK
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}`}
        strategy="afterInteractive"
      />
      */}
      <TopMenu />
      <main className={inter.className}>{children}</main>
    </>
  );
}