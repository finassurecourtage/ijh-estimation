import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const title = "Estimation de volume — IJH Transport";
const description =
  "Estimez en quelques photos le volume de votre déménagement vers Israël et recevez votre estimation indicative par email.";

export const metadata: Metadata = {
  metadataBase: new URL("https://estimation.ijhtransport.com"),
  title,
  description,
  openGraph: {
    title,
    description,
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/ijh-logo.png", width: 1200, height: 1200, alt: "IJH Transport" }],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/ijh-logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1e3a5f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
