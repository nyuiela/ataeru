import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import RainbowProvider from "./contexts/rainbowkit";
import { Toaster } from "sonner";

// Load Outfit font with all necessary weights and styles
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// const lato = Lato({
//   subsets: ["latin"],
//   variable: "--font-lato",
//   style: ["normal"],
//   display: "swap",
//   weight: ["100", "300", "400", "700", "900"],
// });

export const metadata: Metadata = {
  title: "Ataeru | Decentralized Family Building",
  description: "Web3-powered fertility solutions with smart contracts and blockchain verification",
  icons: {
    icon: '/images/logo.svg',
    apple: '/images/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        /> */}
      </head>
      <body
        className={`${outfit.variable} font-outfit antialiased`}
        suppressHydrationWarning
      >
        <RainbowProvider>
          <Toaster />
          {children}
        </RainbowProvider>
      </body>
    </html>
  );
}
