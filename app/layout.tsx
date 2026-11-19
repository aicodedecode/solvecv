import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "solveCV: free AI tools and real jobs for your job search",
    template: "%s | solveCV",
  },
  description:
    "Free AI tools for job seekers: ATS resume checker, cover letters, interview prep, and fresh jobs from employer sources. No signup.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
