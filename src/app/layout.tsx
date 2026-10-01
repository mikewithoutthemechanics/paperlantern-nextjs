import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Scene from "@/components/Scene";
import Texture from "@/components/Texture";
import ScrollProgress from "@/components/ScrollProgress";

const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://paperlantern.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Paperlantern — A creative studio that works in the dark",
    template: "%s · Paperlantern",
  },
  description:
    "Paperlantern.xyz is a creative studio building brands, interfaces and objects that glow in the dark — art direction, digital craft and motion for people who refuse to be background.",
  keywords: [
    "creative studio",
    "art direction",
    "brand identity",
    "web design",
    "motion design",
    "3D web",
    "design agency",
  ],
  authors: [{ name: "Paperlantern" }],
  creator: "Paperlantern",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Paperlantern",
    title: "Paperlantern — A creative studio that works in the dark",
    description:
      "Brands, interfaces and objects that glow in the dark. Art direction, digital craft and motion.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paperlantern — A creative studio that works in the dark",
    description:
      "Brands, interfaces and objects that glow in the dark. Art direction, digital craft and motion.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05050a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${geistSans.variable} ${geistMono.variable} grain vignette antialiased`}
    >
      <head>
        {/* Without JS the reveal animations would leave the page blank, so
            opt out of them entirely. */}
        <noscript>
          <style>{`.reveal,.reveal-clip{opacity:1!important;transform:none!important;clip-path:none!important}.word>span{transform:none!important}`}</style>
        </noscript>
        <script
          // Runs before first paint so the page never flashes light-on-white.
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="bg-ink-950 font-sans text-paper-100">
        <a href="#work" className="skip-link">
          Skip to the work
        </a>
        <Preloader />
        <SmoothScroll />
        <Cursor />
        <ScrollProgress />
        <Scene />
        <Texture />
        {children}
      </body>
    </html>
  );
}
