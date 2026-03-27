import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VerdaChain — The Carbon Credit Lie Detector",
  description:
    "Verify carbon credits instantly using AI + blockchain-backed transparency. Detect fraud, duplicates, and greenwashing with satellite-verified data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#050805]" suppressHydrationWarning>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(10, 14, 10, 0.9)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              color: "#e5e5e5",
              backdropFilter: "blur(20px)",
            },
          }}
        />
      </body>
    </html>
  );
}
