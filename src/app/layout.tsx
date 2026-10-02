import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import Shell from "@/components/Shell";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bamenda Tech Research Center",
    template: "%s | Bamenda Tech Research Center",
  },
  description: "Practical Innovation & Scientific Engineering",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <Shell header={<Header />} footer={<Footer />}>
          {children}
        </Shell>
      </body>
    </html>
  );
}
