import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Delius_Swash_Caps, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Providers from "@/components/Providers";

const fontDisplay = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const fontInter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const fontDelius = Delius_Swash_Caps({
  weight: "400",
  variable: "--font-delius",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Foundry — Tech Intelligence",
  description: "Explore, compare, and analyze Y Combinator startups, Product Hunt launches, and open-source GitHub repositories powered by AI.",
  keywords: ["Foundry", "Y Combinator", "startups", "Product Hunt", "GitHub OSS", "tech intelligence", "startup analytics"],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/icon.svg"],
    apple: ["/icon.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${fontSans.variable} ${fontInter.variable} ${fontDisplay.variable} ${fontMono.variable} ${fontDelius.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[#FF6600] selection:text-white">
        <Providers>
          <Navbar />
          <main className="flex-1 pt-20 sm:pt-24">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

