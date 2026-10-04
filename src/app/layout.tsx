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

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('btrc-theme');if(t==='light'){document.documentElement.classList.remove('dark')}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <Shell header={<Header />} footer={<Footer />}>
          {children}
        </Shell>
      </body>
    </html>
  );
}
