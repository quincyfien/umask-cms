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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "UNMASK",
    template: "%s | UNMASK",
  },
  description: "Practical Innovation & Scientific Engineering",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "UNMASK",
    description: "Practical Innovation & Scientific Engineering",
    url: "https://unmask.org",
    siteName: "UNMASK",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "UNMASK",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UNMASK",
    description: "Practical Innovation & Scientific Engineering",
    images: ["/images/og-image.png"],
  },
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('unmask-theme')||localStorage.getItem('btrc-theme');if(t==='light'){document.documentElement.classList.remove('dark')}}catch(e){}})();`;

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
