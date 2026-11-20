import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CopyCode } from "@/components/copy-code";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { BASE_PATH, DESCRIPTION, SITE_URL } from "@/lib/site";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Pley docs", template: "%s · Pley docs" },
  description: DESCRIPTION,
  applicationName: "Pley",
  alternates: { canonical: `${BASE_PATH}/` },
  openGraph: {
    type: "website",
    url: `${BASE_PATH}/`,
    siteName: "Pley",
    locale: "en_US",
    // The home page's picture, served by its Worker.
    images: [{ url: "/opengraph-image.jpg", alt: "Pley: the media server that stays home, on a TV and a phone" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        {/* Pagefind's search (src/components/search.tsx), written into out/pagefind/ after the build. */}
        <link rel="stylesheet" href={`${BASE_PATH}/pagefind/pagefind-component-ui.css`} />
        <script type="module" src={`${BASE_PATH}/pagefind/pagefind-component-ui.js`} async />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CopyCode />
      </body>
    </html>
  );
}
