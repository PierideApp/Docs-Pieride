import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { sitePath } from "@/lib/site-path";
import "./globals.css";

const snPro = localFont({
  src: "../../public/fonts/SNPro-VariableRegular.woff2",
  variable: "--font-sn-pro",
  display: "swap",
  weight: "200 900",
});
const unbounded = localFont({
  src: [
    { path: "../../public/fonts/Unbounded-800-latin.woff2", weight: "800" },
    { path: "../../public/fonts/Unbounded-900-latin.woff2", weight: "900" },
  ],
  variable: "--font-unbounded",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Piéride — Documentation", template: "%s · Piéride" },
  description: "Les guides pour prendre Piéride en main et profiter de ta vie scolaire.",
  icons: { icon: sitePath("/brand/pieride-icon.png") },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="light">
      <body className={`${snPro.variable} ${unbounded.variable}`}>
        {children}
        <Script src={sitePath("/docs-interactions.js")} strategy="afterInteractive" />
      </body>
    </html>
  );
}
